// data/*.json 형식 검사. 형식이 틀리면 종료 코드 1로 끝나 배포·PR 생성이 멈춥니다.
import {readFileSync} from 'node:fs';
const err=[];const bad=(m)=>err.push(m);
const load=f=>{try{return JSON.parse(readFileSync(new URL('../data/'+f,import.meta.url),'utf8'));}catch(e){bad(f+': JSON을 읽을 수 없습니다 ('+e.message+')');return null;}};
const isStr=v=>typeof v==='string'&&v.trim().length>0;
const httpsOk=v=>{try{return new URL(v).protocol==='https:';}catch(e){return false;}};
const noMarkup=(v,w)=>{if(typeof v==='string'&&/[<>]/.test(v))bad(w+': HTML 기호(< >)는 사용할 수 없습니다');};

const A=load('attractions.json');
const ids=new Set();
if(A){
  if(!Array.isArray(A.items))bad('attractions.json: items 배열이 없습니다');
  else{
    if(A.items.length<30)bad('attractions.json: 30건 미만입니다 ('+A.items.length+')');
    for(const it of A.items){
      const w='attractions['+it.id+']';
      if(!isStr(it.id)||!/^[a-z0-9-]+$/.test(it.id))bad(w+': id 형식 오류');
      if(ids.has(it.id))bad(w+': id 중복');ids.add(it.id);
      for(const k of ['region','category','map'])if(!isStr(it[k]))bad(w+': '+k+' 누락');
      if(!it.name||!isStr(it.name.en)||!isStr(it.name.ko))bad(w+': name.en / name.ko 누락');
      if(!isStr(it.summary))bad(w+': summary 누락');
      for(const k of ['summary','access','localTip'])noMarkup(it[k],w+'.'+k);
      if(it.name)noMarkup(it.name.en,w+'.name.en');
      if(it.tourapi){
        const t=it.tourapi;
        if(t.image&&!httpsOk(t.image)&&!/^http:\/\/tong\.visitkorea\.or\.kr\//.test(t.image))bad(w+': tourapi.image 주소가 안전하지 않습니다');
        for(const k of ['overview','addr','tel'])noMarkup(t[k],w+'.tourapi.'+k);
      }
    }
  }
}
const T=load('trends.json');
if(T){
  if(!Array.isArray(T.items))bad('trends.json: items 배열이 없습니다');
  else{
    if(T.items.filter(x=>x.status==='approved').length<10)bad('trends.json: 승인된 글이 10건 미만입니다');
    const tid=new Set();
    for(const it of T.items){
      const w='trends['+it.id+']';
      if(!isStr(it.id)||tid.has(it.id))bad(w+': id 오류/중복');tid.add(it.id);
      for(const k of ['title','summary','tag','date'])if(!isStr(it[k]))bad(w+': '+k+' 누락');
      if(!['approved','draft'].includes(it.status))bad(w+': status는 approved 또는 draft');
      if(!it.source||!isStr(it.source.name)||!httpsOk(it.source.url))bad(w+': source(name, https url) 오류');
      for(const k of ['title','summary'])noMarkup(it[k],w+'.'+k);
      for(const r of it.related||[])if(A&&!ids.has(r))bad(w+': related 장소 id가 없습니다 ('+r+')');
    }
  }
}
const S=load('stats.json');
if(S){
  if(!['pending','ok'].includes(S.status))bad('stats.json: status는 pending 또는 ok');
  for(const s of S.sources||[])if(!httpsOk(s.url))bad('stats.json: source url 오류');
  if(S.status==='ok'&&!(S.foreignVisitorsByRegion||[]).length)bad('stats.json: ok인데 데이터가 비어 있습니다');
}
if(err.length){console.error('데이터 검사 실패:\n- '+err.join('\n- '));process.exit(1);}
console.log('데이터 검사 통과: 관광지 '+(A?A.items.length:0)+'건, 트렌드 '+(T?T.items.length:0)+'건, 통계 상태 '+(S?S.status:'-'));
