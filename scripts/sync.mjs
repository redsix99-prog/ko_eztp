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
const ymdOf=d=>d.toISOString().slice(0,10).replace(/-/g,'');
// 집계가 올라오기까지 시간이 걸리므로, 데이터가 실제로 있는 가장 최근 28일 구간을 찾습니다.
async function findWindow(span,log){
  for(const lag of [4,10,20,35,50,70,100,130]){
    const end=new Date(Date.now()-lag*864e5),start=new Date(end-(span-1)*864e5);
    const body=await call(LAB,'metcoRegnVisitrDDList',{startYmd:ymdOf(start),endYmd:ymdOf(end),numOfRows:5,pageNo:1});
    const n=items(body).length;
    if(log)log(`기간 ${ymdOf(start)}~${ymdOf(end)}: ${n?'데이터 있음':'데이터 없음'} (totalCount=${body.totalCount})`+(n?' 샘플='+JSON.stringify(items(body).slice(0,2)):''));
    if(n)return {start,end,lag};
  }
  return null;
}
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
    ['metcoRegnVisitrDDList',async()=>{const lines=[];const w=await findWindow(28,l=>lines.push(l));if(!w)throw new Error('130일 전까지 데이터가 없습니다: '+lines.join(' | '));return lines.join(' | ');}]
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
  if(it.tourapiSkip){it.tourapi=null;it.source='curated';missed.push(it.id+'(제외)');continue;}   // 공식 데이터에 같은 대상이 없어 연결하지 않는 항목
  try{
    // 같은 이름의 상점·식당이 먼저 나오는 일이 있어, 먼저 '관광지(76)'로 좁혀 검색하고 점수로 가장 알맞은 항목만 고릅니다.
    // 점수: 한글 이름 포함 +3, 영문 이름 완전 일치 +3, 영문 이름 앞부분 일치 +2, 영문 이름 포함(길이 비슷) +1
    const kw=String(it.tourapiKeyword||it.name.en).replace(/\(.*?\)/g,'').trim();   // 검색어를 따로 지정할 수 있습니다(tourapiKeyword)
    const want=norm(kw),koName=String(it.name.ko||'').replace(/\(.*\)/,'').replace(/\s+/g,'');
    const score=x=>{
      const title=String(x.title||'');
      const en=norm(title.replace(/\(.*$/,'').replace(/\[.*?\]/g,''));
      let s=0;
      if(koName&&title.replace(/\s+/g,'').includes(koName))s+=3;
      if(en===want)s+=3;else if(en.length>=4&&(en.startsWith(want)||want.startsWith(en)))s+=2;else if(en.includes(want)&&en.length<=want.length+10)s+=1;
      return s;
    };
    const pick=(list,min)=>list.map(x=>({x,s:score(x)})).filter(o=>o.s>=min).sort((a,b)=>b.s-a.s)[0];
    let found=pick(items(await call(ENG,'searchKeyword2',{keyword:kw,contentTypeId:76,numOfRows:20,pageNo:1})),2);
    if(!found)found=pick(items(await call(ENG,'searchKeyword2',{keyword:kw,numOfRows:20,pageNo:1})),3);
    const hit=found&&found.x;
    if(!hit){it.tourapi=null;it.source='curated';missed.push(it.id);continue;}
    let overview='';
    try{const d=items(await call(ENG,'detailCommon2',{contentId:hit.contentid}))[0]||{};overview=clean(d.overview).slice(0,600);}catch(e){}
    // 공공누리 유형: 1(출처표시)·3(출처표시-변경금지)만 영리 사이트에서 쓸 수 있으므로 그 외 유형의 이미지는 쓰지 않습니다.
    const lic=String(hit.cpyrhtDivCd||'');const img=(['Type1','Type3'].includes(lic)&&hit.firstimage)||'';
    it.tourapi={
      contentId:String(hit.contentid),
      title:clean(hit.title),
      addr:clean([hit.addr1,hit.addr2].filter(Boolean).join(' ')),
      tel:clean(hit.tel),
      image:/^https?:\/\//.test(img)?img.replace(/^http:\/\//,'http://'):'',
      overview,
      imageLicense:lic,
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
  const w=await findWindow(28);if(!w)throw new Error('최근 130일 안에 방문자 데이터가 없습니다.');
  const ymd=ymdOf;
  // 광역 지자체 코드 → 영문 이름 (행정구역 개편 전·후 코드 모두 포함)
  const EN={'11':'Seoul','26':'Busan','27':'Daegu','28':'Incheon','29':'Gwangju','30':'Daejeon','31':'Ulsan','36':'Sejong','41':'Gyeonggi','42':'Gangwon','51':'Gangwon','43':'Chungbuk','44':'Chungnam','45':'Jeonbuk','52':'Jeonbuk','46':'Jeonnam','47':'Gyeongbuk','48':'Gyeongnam','50':'Jeju'};
  const NAME_EN=[[/전남광주/,'Gwangju & Jeonnam'],[/전북/,'Jeonbuk'],[/강원/,'Gangwon'],[/제주/,'Jeju']];
  const regionName=r=>{const code=String(r.areaCode||''),ko=clean(r.areaNm);if(EN[code])return EN[code];for(const [re,en] of NAME_EN)if(re.test(ko))return en;return /[가-힣]/.test(ko)?'Region '+code:ko;};
  async function fetchAll(st,en){
    const all=[];
    for(let page=1;page<=40;page++){
      const list=items(await call(LAB,'metcoRegnVisitrDDList',{startYmd:ymd(st),endYmd:ymd(en),numOfRows:1000,pageNo:page}));
      all.push(...list);if(list.length<1000)break;await sleep(250);
    }
    return all;
  }
  let list=await fetchAll(w.start,w.end);
  // 집계는 며칠 늦게 올라오므로, 찾은 데이터의 가장 최근 날짜를 기준으로 28일을 다시 조회합니다.
  const latest=list.map(r=>String(r.baseYmd||'')).filter(Boolean).sort().pop();
  if(latest&&latest<ymd(w.end)){
    const e2=new Date(latest.slice(0,4)+'-'+latest.slice(4,6)+'-'+latest.slice(6,8)+'T00:00:00Z');
    list=await fetchAll(new Date(e2-27*864e5),e2);
  }
  const sums=new Map();const days=new Set();const rows=list.length;
  for(const r of list){
    if(String(r.touDivCd)!=='3')continue;            // 1 현지인, 2 외지인, 3 외국인
    const name=regionName(r);const n=Number(r.touNum);
    if(!name||!Number.isFinite(n))continue;
    if(r.baseYmd)days.add(String(r.baseYmd));
    sums.set(name,(sums.get(name)||0)+n);
  }
  const arr=[...sums.entries()].map(([region,visitors])=>({region,visitors:Math.round(visitors)})).sort((a,b)=>b.visitors-a.visitors).slice(0,10);
  if(!arr.length)throw new Error('외국인 방문자 행을 찾지 못했습니다 (조회 '+rows+'행). --probe 로 응답 구조를 확인하세요.');
  const dl=[...days].sort();const first=dl[0]||ymd(w.start),last=dl[dl.length-1]||ymd(w.end);
  const fmt=y=>y.slice(0,4)+'-'+y.slice(4,6)+'-'+y.slice(6,8);
  save('stats.json',{status:'ok',updated:new Date().toISOString().slice(0,10),period:fmt(first)+' to '+fmt(last)+' ('+(dl.length||'?')+' days of data)',
    note:'Foreign visitors by region: the sum of daily unique visitor counts over the period shown (mobile-data based; a visitor staying three days counts three times). Source: Korea Tourism Organization open data.',
    sources:[{name:'Korea Tourism Data Lab',url:'https://datalab.visitkorea.or.kr/'},{name:'Korea Tourism Organization (Visit Korea)',url:'https://english.visitkorea.or.kr/'}],
    foreignVisitorsByRegion:arr});
  console.log('통계 갱신: 상위 '+arr.length+'개 지역');

  // 3) 자동 초안: 통계 요약 글을 draft 로 추가합니다. (관리자가 PR에서 status 를 approved 로 바꾸면 게시)
  const tr=read('trends.json');const id='stats-'+new Date().toISOString().slice(0,7);
  if(!tr.items.some(x=>x.id===id)){
    const top=arr.slice(0,3).map(x=>x.region).join(', ');
    tr.items.unshift({id,date:new Date().toISOString().slice(0,10),tag:'Official data',status:'draft',auto:true,
      title:'Where international visitors went: latest official figures',
      summary:'According to Korea Tourism Organization data, the regions with the most international visitors over the period '+fmt(first)+' to '+fmt(last)+' were '+top+'. Figures are daily unique visitors based on mobile data.',
      related:[],source:{name:'Korea Tourism Data Lab',url:'https://datalab.visitkorea.or.kr/'}});
    save('trends.json',tr);console.log('트렌드 초안 추가: '+id+' (draft)');
  }
}catch(e){console.warn('통계 갱신 실패: '+e.message);process.exitCode=0;}
