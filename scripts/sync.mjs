// 한국관광공사 공개 API로 data/*.json 을 갱신합니다. (GitHub Actions에서 실행)
//  - TOURAPI_KEY 가 없으면 아무것도 하지 않고 정상 종료합니다.
//  - 결과는 직접 게시되지 않고, 워크플로가 Pull Request로 올려 관리자가 승인(머지)해야 사이트에 반영됩니다.
//  - 사용법: node scripts/sync.mjs [--probe]   (--probe: 응답 구조만 로그에 출력하고 파일은 바꾸지 않음)
//
// ※ 오퍼레이션 이름과 응답 필드는 공공데이터포털 문서 기준의 가정입니다. 첫 실행은 --probe 로 확인하세요.
import {readFileSync,writeFileSync} from 'node:fs';

const KEY=process.env.TOURAPI_KEY||'';
const PROBE=process.argv.includes('--probe');
const ENG=process.env.TOURAPI_ENG_BASE||'https://apis.data.go.kr/B551011/EngService2';
const LAB=process.env.TOURAPI_LAB_BASE||'https://apis.data.go.kr/B551011/DataLabService';
const FILE=f=>new URL('../data/'+f,import.meta.url);
const read=f=>JSON.parse(readFileSync(FILE(f),'utf8'));
const save=(f,o)=>writeFileSync(FILE(f),JSON.stringify(o,null,1)+'\n','utf8');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

if(!KEY){console.log('TOURAPI_KEY 가 설정되지 않아 동기화를 건너뜁니다.');process.exit(0);}

const keyParam=KEY.includes('%')?KEY:encodeURIComponent(KEY);   // 이미 인코딩된 키 / 원본 키 모두 허용
async function call(base,op,params){
  const qs=Object.entries({MobileOS:'ETC',MobileApp:'KoreaEasyTrip',_type:'json',...params})
    .map(([k,v])=>k+'='+encodeURIComponent(v)).join('&');
  const url=base+'/'+op+'?serviceKey='+keyParam+'&'+qs;
  let last;
  for(let i=0;i<3;i++){
    try{
      const r=await fetch(url,{headers:{'Accept':'application/json'}});
      const text=await r.text();
      if(!r.ok)throw new Error('HTTP '+r.status+' '+text.slice(0,200));
      let j;try{j=JSON.parse(text);}catch(e){throw new Error('JSON이 아닌 응답: '+text.slice(0,200));}
      const h=j.response&&j.response.header;
      if(!h||String(h.resultCode)!=='0000')throw new Error('API 오류: '+JSON.stringify(h||j).slice(0,200));
      return j.response.body||{};
    }catch(e){last=e;await sleep(800*(i+1));}
  }
  throw new Error(op+' 호출 실패: '+last.message);
}
const items=body=>{const it=body&&body.items&&body.items.item;return !it?[]:Array.isArray(it)?it:[it];};
const clean=s=>String(s||'').replace(/<[^>]*>/g,' ').replace(/[<>]/g,'').replace(/\s+/g,' ').trim();
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');

if(PROBE){
  // 결과를 Annotations(요약 화면)에도 남겨, 로그를 열지 않아도 원인을 볼 수 있게 합니다. 인증키는 가립니다.
  const mask=t=>String(t).split(KEY).join('***').split(keyParam).join('***');
  const note=(lv,t)=>console.log('::'+lv+'::'+mask(t).replace(/\r?\n/g,' ').slice(0,900));
  const ymd=d=>d.toISOString().slice(0,10).replace(/-/g,'');
  const e=new Date(Date.now()-4*864e5),s0=new Date(e-6*864e5);
  const steps=[
    ['searchKeyword2',async()=>{const b=await call(ENG,'searchKeyword2',{keyword:'Gyeongbokgung',numOfRows:3,pageNo:1});globalThis.__first=items(b)[0];return JSON.stringify(b);}],
    ['detailCommon2',async()=>{const f=globalThis.__first;if(!f||!f.contentid)throw new Error('searchKeyword2 결과가 비어 있어 건너뜁니다');return JSON.stringify(await call(ENG,'detailCommon2',{contentId:f.contentid}));}],
    ['metcoRegnVisitrDDList',async()=>JSON.stringify(await call(LAB,'metcoRegnVisitrDDList',{startYmd:ymd(s0),endYmd:ymd(e),numOfRows:5,pageNo:1}))]
  ];
  let failed=0;
  for(const [name,fn] of steps){
    try{const out=await fn();console.log('--- '+name+' OK ---\n'+mask(out).slice(0,1500));note('notice',name+' OK: '+out.slice(0,700));}
    catch(err){failed++;console.log('--- '+name+' FAIL ---\n'+mask(err.message));note('error',name+' FAIL: '+err.message);}
  }
  process.exit(failed?1:0);
}

// 1) 관광지 30건: 영문 서비스에서 같은 장소를 찾아 공식 정보(주소·전화·이미지·영문 개요)를 덧붙입니다.
const db=read('attractions.json');
let matched=0,missed=[];
for(const it of db.items){
  try{
    const body=await call(ENG,'searchKeyword2',{keyword:it.name.en,numOfRows:10,pageNo:1});
    const want=norm(it.name.en);
    const hit=items(body).find(x=>{const t=norm(x.title);return t&&(t.includes(want)||want.includes(t));});
    if(!hit){missed.push(it.id);continue;}
    let overview='';
    try{const d=items(await call(ENG,'detailCommon2',{contentId:hit.contentid}))[0]||{};overview=clean(d.overview).slice(0,600);}catch(e){}
    const img=hit.firstimage||'';
    it.tourapi={
      contentId:String(hit.contentid),
      title:clean(hit.title),
      addr:clean([hit.addr1,hit.addr2].filter(Boolean).join(' ')),
      tel:clean(hit.tel),
      image:/^https?:\/\//.test(img)?img.replace(/^http:\/\//,'http://'):'',
      overview,
      syncedAt:new Date().toISOString().slice(0,10)
    };
    it.source='curated+tourapi';matched++;
  }catch(e){console.warn('['+it.id+'] '+e.message);missed.push(it.id);}
  await sleep(250);
}
db.updated=new Date().toISOString().slice(0,10);
save('attractions.json',db);
console.log('관광지 연계: '+matched+'/'+db.items.length+'건'+(missed.length?' (미매칭: '+missed.join(', ')+')':''));

// 2) 공식 방문 통계: 최근 4주 외국인 방문자 수를 광역지자체별로 합산합니다. (집계 지연을 감안해 4일 전까지)
try{
  const end=new Date(Date.now()-4*864e5),start=new Date(end-27*864e5);
  const ymd=d=>d.toISOString().slice(0,10).replace(/-/g,'');
  const sums=new Map();let rows=0;
  for(let page=1;page<=40;page++){
    const body=await call(LAB,'metcoRegnVisitrDDList',{startYmd:ymd(start),endYmd:ymd(end),numOfRows:1000,pageNo:page});
    const list=items(body);if(!list.length)break;
    for(const r of list){
      rows++;
      if(String(r.touDivCd)!=='3')continue;            // 3 = 외국인
      const name=clean(r.areaNm||r.signguNm);const n=Number(r.touNum);
      if(!name||!Number.isFinite(n))continue;
      sums.set(name,(sums.get(name)||0)+n);
    }
    if(list.length<1000)break;await sleep(250);
  }
  const arr=[...sums.entries()].map(([region,visitors])=>({region,visitors:Math.round(visitors)})).sort((a,b)=>b.visitors-a.visitors).slice(0,10);
  if(!arr.length)throw new Error('외국인 방문자 행을 찾지 못했습니다 (조회 '+rows+'행). --probe 로 응답 구조를 확인하세요.');
  save('stats.json',{status:'ok',updated:new Date().toISOString().slice(0,10),period:ymd(start)+'-'+ymd(end),
    note:'Foreign visitors by region, summed over the period (daily unique visitors, mobile-data based). Source: Korea Tourism Organization open data.',
    sources:[{name:'Korea Tourism Data Lab',url:'https://datalab.visitkorea.or.kr/'},{name:'Korea Tourism Organization (Visit Korea)',url:'https://english.visitkorea.or.kr/'}],
    foreignVisitorsByRegion:arr});
  console.log('통계 갱신: 상위 '+arr.length+'개 지역');

  // 3) 자동 초안: 통계 요약 글을 draft 로 추가합니다. (관리자가 PR에서 status 를 approved 로 바꾸면 게시)
  const tr=read('trends.json');const id='stats-'+new Date().toISOString().slice(0,7);
  if(!tr.items.some(x=>x.id===id)){
    const top=arr.slice(0,3).map(x=>x.region).join(', ');
    tr.items.unshift({id,date:new Date().toISOString().slice(0,10),tag:'Official data',status:'draft',auto:true,
      title:'Where international visitors went in the last four weeks',
      summary:'According to Korea Tourism Organization data, the regions with the most international visitors over the period '+ymd(start)+'–'+ymd(end)+' were '+top+'. Figures are daily unique visitors based on mobile data.',
      related:[],source:{name:'Korea Tourism Data Lab',url:'https://datalab.visitkorea.or.kr/'}});
    save('trends.json',tr);console.log('트렌드 초안 추가: '+id+' (draft)');
  }
}catch(e){console.warn('통계 갱신 실패: '+e.message);process.exitCode=0;}
