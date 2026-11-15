/* 다국어(한국어·영어·일본어·중국어 간체) 엔진
 * - 화면의 한국어 문구는 사전(I18N_DICT)으로 치환하고, 장소·뉴스·지역 같은 데이터는 덮어쓰기(overlay)로 바꿉니다.
 * - 언어를 바꾸면 등록된 onChange 콜백이 다시 그리도록 합니다.
 */
(function(){
'use strict';
const LANGS=[['ko','한국어'],['en','English'],['ja','日本語'],['zh','中文']];
const DICT=window.I18N_DICT||{};
let LANG='ko';const listeners=[];
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* ---------- 직접 만든 UI 문구 (키 기반) ---------- */
const K={
 dayN:{ko:'{n}일차',en:'Day {n}',ja:'{n}日目',zh:'第{n}天'},
 photo:{ko:'사진: ',en:'Photo: ',ja:'写真：',zh:'照片：'},
 dlHead:{ko:'코리아 이지트립 · 샘플 일정',en:'Korea Easy Trip · Sample itinerary',ja:'Korea Easy Trip · サンプル日程',zh:'Korea Easy Trip · 示例行程'},
 dlPlace:{ko:'장소: ',en:'Place: ',ja:'場所：',zh:'地点：'},
 dlMap:{ko:'지도: ',en:'Map: ',ja:'地図：',zh:'地图：'},
 dlFoot:{ko:'참고용 예시 일정입니다. 운영 시간, 접근 방법, 교통편은 공식 채널에서 확인하세요.',en:'This is a sample itinerary. Please check opening hours, access and transport through official channels.',ja:'参考用のサンプル日程です。営業時間、アクセス、交通手段は公式情報でご確認ください。',zh:'仅为参考示例行程。营业时间、前往方式与交通请通过官方渠道确认。'},
 resHead:{ko:'{place} {days}일 추천 일정',en:'{days}-day {place} itinerary',ja:'{place}{days}日間のおすすめ日程',zh:'{place}{days}日推荐行程'},
 resDesc:{ko:'테마: {theme} · 예시 코스이며 실시간 예약·요금 정보가 아닙니다.',en:'Theme: {theme} · A sample route, not real-time booking or price information.',ja:'テーマ：{theme} · サンプルコースであり、リアルタイムの予約・料金情報ではありません。',zh:'主题：{theme} · 示例路线，并非实时预订或价格信息。'},
 guidesN:{ko:'{n}개의 가이드',en:'{n} guides',ja:'{n}件のガイド',zh:'{n}篇指南'},
 /* 지역 페이지 */
 back:{ko:'← 서울 밖 여행',en:'← Beyond Seoul',ja:'← ソウルの外へ',zh:'← 首尔以外的旅行'},
 about:{ko:'{name} 소개',en:'About {name}',ja:'{name}について',zh:'关于{name}'},
 thisIs:{ko:'{name}, 이런 곳이에요',en:'{name} at a glance',ja:'{name}はこんな場所',zh:'{name}，这样的地方'},
 mapBtn:{ko:'지도에서 {name} 보기 ↗',en:'See {name} on the map ↗',ja:'地図で{name}を見る ↗',zh:'在地图上查看{name} ↗'},
 planBtn:{ko:'{name} 일정 만들기 →',en:'Plan a {name} trip →',ja:'{name}の日程を作る →',zh:'制作{name}行程 →'},
 planSeoul:{ko:'서울 일정 만들기 →',en:'Plan a Seoul trip →',ja:'ソウルの日程を作る →',zh:'制作首尔行程 →'},
 mustSee:{ko:'꼭 가볼 곳',en:'Must-see',ja:'ぜひ訪れたい場所',zh:'必去之地'},
 topSpots:{ko:'{name}의 대표 명소',en:'Top sights in {name}',ja:'{name}の代表的な名所',zh:'{name}代表性景点'},
 topSpotsDesc:{ko:'사진을 보고 마음에 드는 곳부터 골라 보세요.',en:'Browse the photos and start with the places you like.',ja:'写真を見て、気になる場所から選んでみましょう。',zh:'看看照片，从喜欢的地方开始选择吧。'},
 tastyTrip:{ko:'맛있는 여행',en:'Tasty travels',ja:'おいしい旅',zh:'美味之旅'},
 routeEy:{ko:'추천 동선',en:'Suggested route',ja:'おすすめルート',zh:'推荐路线'},
 routeH:{ko:'{name} 이렇게 다녀 보세요',en:'How to explore {name}',ja:'{name}の巡り方',zh:'{name}这样玩'},
 routeMap:{ko:'구글지도로 이 동선 보기 ↗',en:'View this route in Google Maps ↗',ja:'この動線をGoogleマップで見る ↗',zh:'在谷歌地图中查看此路线 ↗'},
 tipsTitle:{ko:'여행 전에 알아두세요',en:'Before you go',ja:'旅行前に知っておきたいこと',zh:'出发前请了解'},
 tipsNote:{ko:'이동 시간과 운영 정보는 대략적인 값이며 계절·날씨에 따라 달라집니다. 출발 전 공식 채널에서 확인하세요.',en:'Travel times and operating details are approximate and vary with season and weather. Please confirm through official channels before you go.',ja:'移動時間や運営情報はおおよその目安で、季節や天候によって変わります。出発前に公式情報でご確認ください。',zh:'交通时间与运营信息仅为大致数值，会因季节和天气而变化。出发前请通过官方渠道确认。'},
 otherRegions:{ko:'다른 지역도 둘러보기',en:'Explore other regions',ja:'ほかの地域も見る',zh:'浏览其他地区'},
 notFound:{ko:'지역을 찾을 수 없어요',en:'Region not found',ja:'地域が見つかりません',zh:'找不到该地区'},
 notFoundSub:{ko:'아래에서 지역을 골라 주세요.',en:'Please choose a region below.',ja:'下から地域を選んでください。',zh:'请从下方选择地区。'},
 regionTitle:{ko:'{name} 여행 가이드 | 코리아 이지트립',en:'{name} Travel Guide | Korea Easy Trip',ja:'{name}旅行ガイド | Korea Easy Trip',zh:'{name}旅行指南 | Korea Easy Trip'},
 creditsHead:{ko:'사진 출처(Wikimedia Commons): ',en:'Photo credits (Wikimedia Commons): ',ja:'写真の出典（Wikimedia Commons）：',zh:'图片来源（Wikimedia Commons）：'},
 creditsNote:{ko:'명소 사진은 위키백과 문서의 사진이며 각 사진 아래 링크에서 출처와 라이선스를 확인할 수 있습니다.',en:'Spot photos come from Wikipedia articles; see the link under each photo for its source and license.',ja:'名所の写真はWikipediaの記事のもので、各写真の下のリンクから出典とライセンスを確認できます。',zh:'景点照片取自维基百科条目，可通过每张照片下方的链接查看来源与授权。'},
 lang:{ko:'언어',en:'Language',ja:'言語',zh:'语言'}
};
function t(key,vars){const e=K[key];let s=e?(e[LANG]||e.ko):key;if(vars)for(const v in vars)s=s.split('{'+v+'}').join(vars[v]);return s;}

/* ---------- 패턴 규칙 (숫자·이름이 섞인 문구) ---------- */
function tr(ko){
  if(LANG==='ko')return ko;
  const d=DICT[ko];if(d&&d[LANG])return d[LANG];
  let m;
  if((m=ko.match(/^(\d+)일차$/)))return t('dayN',{n:m[1]});
  if((m=ko.match(/^(\d+)개의 가이드$/)))return t('guidesN',{n:m[1]});
  if((m=ko.match(/^(\S+) (\d+)일 추천 일정$/)))return t('resHead',{place:tr(m[1]),days:m[2]});
  if((m=ko.match(/^테마: (.+) · 예시 코스이며 실시간 예약·요금 정보가 아닙니다\.$/)))return t('resDesc',{theme:tr(m[1])});
  if((m=ko.match(/^(\d{4})년 (\d{1,2})월 (\d{1,2})일$/)))return LANG==='en'?MONTHS[m[2]-1]+' '+(+m[3])+', '+m[1]:m[1]+'年'+(+m[2])+'月'+(+m[3])+'日';
  return ko;
}

/* ---------- DOM 번역 ---------- */
const HANGUL=/[가-힣]/;
const ATTRS=['placeholder','alt','aria-label','title'];
let obs=null,busy=false;
function skip(n){const p=n.parentNode;return !p||p.nodeName==='SCRIPT'||p.nodeName==='STYLE'||(p.closest&&p.closest('[translate="no"]'));}
function doText(n){
  if(skip(n))return;
  if(n.__raw===undefined){
    const raw=n.nodeValue;if(!HANGUL.test(raw))return;
    const ko=raw.replace(/\s+/g,' ').trim();const out=tr(ko);
    if(LANG==='ko'||out===ko)return;
    n.__raw=raw;n.__ko=ko;
  }
  const raw=n.__raw,lead=raw.match(/^\s*/)[0],trail=raw.match(/\s*$/)[0];
  n.nodeValue=LANG==='ko'?raw:lead+tr(n.__ko)+trail;
}
function doAttrs(el){
  for(const a of ATTRS){
    if(!el.hasAttribute||!el.hasAttribute(a))continue;
    el.__ka=el.__ka||{};
    if(el.__ka[a]===undefined){const v=el.getAttribute(a);if(!HANGUL.test(v))continue;const out=tr(v.trim());if(LANG==='ko'||out===v.trim())continue;el.__ka[a]=v;}
    const ko=el.__ka[a];const nv=LANG==='ko'?ko:tr(ko.trim());if(el.getAttribute(a)!==nv)el.setAttribute(a,nv);
  }
}
function walk(root){
  if(!root)return;
  if(root.nodeType===3){doText(root);return;}
  if(root.nodeType!==1)return;
  doAttrs(root);
  const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
  let n;while((n=tw.nextNode())){if(n.nodeType===3)doText(n);else doAttrs(n);}
}
function translateAll(){
  busy=true;try{
    walk(document.body);
    if(document.documentElement.__koTitle===undefined)document.documentElement.__koTitle=document.title;
    const tk=document.documentElement.__koTitle;document.title=LANG==='ko'?tk:(HANGUL.test(tk)?tr(tk.trim()):document.title);
    const md=document.querySelector('meta[name="description"]');
    if(md){if(md.__ko===undefined)md.__ko=md.getAttribute('content');md.setAttribute('content',LANG==='ko'?md.__ko:tr(md.__ko));}
  }finally{busy=false;if(obs)obs.takeRecords();}
}
function observe(){
  if(obs)obs.disconnect();
  obs=new MutationObserver(ms=>{
    if(busy||LANG==='ko')return;busy=true;
    try{ms.forEach(m=>{
      if(m.type==='childList')m.addedNodes.forEach(n=>walk(n));
      else if(m.type==='attributes')doAttrs(m.target);
    });}finally{busy=false;if(obs)obs.takeRecords();}
  });
  obs.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:ATTRS});
}

/* ---------- 데이터 덮어쓰기 ---------- */
function clone(o){return JSON.parse(JSON.stringify(o));}
function applyData(){
  const L=LANG;
  const P=window.PLACES,PI=window.PLACE_I18N||{};
  if(P)for(const id in P){const p=P[id];if(!p._ko)p._ko={name:p.name,intro:p.intro};const o=L!=='ko'&&PI[id]&&PI[id][L];p.name=o?o[0]:p._ko.name;p.intro=o?o[1]:p._ko.intro;}
  const D=window.I18N_DATA||{};
  const TH=window.THEMES,THI=D.themes||{};
  if(TH)for(const k in TH){const x=TH[k];if(!x._ko)x._ko={label:x.label,desc:x.desc};const o=L!=='ko'&&THI[k]&&THI[k][L];x.label=o?o[0]:x._ko.label;x.desc=o?o[1]:x._ko.desc;}
  const RG=window.REGIONS,RGI=D.regions||{};
  if(RG)for(const k in RG){const r=RG[k];if(!r._ko)r._ko=clone({name:r.name,tagline:r.tagline,intro:r.intro,facts:r.facts,foodTitle:r.foodTitle,food:r.food,route:r.route,tips:r.tips,credit:r.credit});
    const b=r._ko,o=L!=='ko'&&RGI[k]&&RGI[k][L];
    r.name=o?o.name:b.name;r.tagline=o?o.tagline:b.tagline;r.intro=o?o.intro:b.intro;r.facts=o?o.facts:b.facts;r.foodTitle=o?o.foodTitle:b.foodTitle;r.food=o?o.food:b.food;r.tips=o?o.tips:b.tips;r.credit=o?o.credit:b.credit;
    r.route=b.route.map((x,i)=>o?[o.route[i][0],o.route[i][1],x[2]]:x);}
  const NW=window.NEWS,NWI=D.news||[];
  if(NW)NW.forEach((n,i)=>{if(!n._ko)n._ko={date:n.date,title:n.title,summary:n.summary};const o=L!=='ko'&&NWI[i]&&NWI[i][L];n.date=o?o[0]:n._ko.date;n.title=o?o[1]:n._ko.title;n.summary=o?o[2]:n._ko.summary;});
  const AR=window.ARTICLES,ARI=D.articles||{};
  if(AR)for(const k in AR){const a=AR[k];if(!a._ko)a._ko={cat:a.cat,title:a.title,body:a.body,credit:a.credit};const o=L!=='ko'&&ARI[k]&&ARI[k][L];a.cat=o?o[0]:a._ko.cat;a.title=o?o[1]:a._ko.title;a.body=o?o[2]:a._ko.body;a.credit=o?o[3]:a._ko.credit;}
  if(NW&&window.NEWS_UPDATED===undefined){}
}

/* ---------- 사진 출처 ---------- */
const CREDITS=[
 [['광화문','Gwanghwamun','光化門','光化门'],'Huntsmanleader','CC0'],
 [['북촌 한옥마을·경복궁 근정전','Bukchon Hanok Village & Geunjeongjeon Hall','北村韓屋村・景福宮勤政殿','北村韩屋村·景福宫勤政殿'],'Basile Morin','CC BY-SA 4.0'],
 [['감천문화마을','Gamcheon Culture Village','甘川文化村','甘川文化村'],'Bernard Gagnon','CC0'],
 [['성산일출봉 항공 사진','Seongsan Ilchulbong aerial photo','城山日出峰の航空写真','城山日出峰航拍照'],'Korea.net / Korean Culture and Information Service','CC BY-SA 2.0'],
 [['광장시장','Gwangjang Market','広蔵市場','广藏市场'],'Bgag','CC0'],
 [['해운대','Haeundae','海雲台','海云台'],'StephNurnberg','CC BY 2.0'],
 [['한복','Hanbok','韓服','韩服'],'IssamBarhoumi','CC BY-SA 4.0'],
 [['공항철도 승강장','Airport Railroad platform','空港鉄道のホーム','机场铁路站台'],'LERK','CC BY-SA 4.0'],
 [['서울 지하철','Seoul subway','ソウルの地下鉄','首尔地铁'],'Mtattrain','CC BY-SA 4.0'],
 [['인천공항 출입국 안내','Incheon Airport immigration sign','仁川空港の出入国案内','仁川机场出入境指示牌'],'Vuong Tri Binh','CC BY-SA 4.0'],
 [['명동 거리(안내문)','Myeongdong street (guide photo)','明洞の通り（ガイド写真）','明洞街头（指南配图）'],'Dwxn','CC BY-SA 4.0'],
 [['홍대 거리','Hongdae street','弘大の通り','弘大街头'],'lumoplank','CC0'],
 [['비빔밥','Bibimbap','ビビンバ','拌饭'],'Andy Li','CC0'],
 [['반포대교 달빛무지개분수','Banpo Bridge Moonlight Rainbow Fountain','盤浦大橋 月光レインボー噴水','盘浦大桥月光彩虹喷泉'],'Wvdp','CC0'],
 [['설악산','Seoraksan','雪岳山','雪岳山'],'Christophe95','CC BY-SA 4.0'],
 [['동대문디자인플라자','Dongdaemun Design Plaza','東大門デザインプラザ','东大门设计广场'],'lumoplank','CC0'],
 [['K-팝 무대(2011 한일축제한마당)','K-pop stage (2011 Korea-Japan Festival)','K-POPステージ（2011韓日交流おまつり）','K-POP舞台（2011韩日交流庆典）'],'Korea.net / Korean Culture and Information Service','CC BY-SA 2.0'],
 [['북한산 인수봉','Insubong Peak, Bukhansan','北漢山・仁寿峰','北汉山仁寿峰'],'Jo Hanshin','CC0'],
 [['광안대교 야경','Gwangan Bridge at night','広安大橋の夜景','广安大桥夜景'],'Doo-ho Kim','Public domain'],
 [['홍대 거리 야경','Hongdae street at night','弘大の夜景','弘大夜景'],'Ken Eckert','CC BY-SA 4.0'],
 [['명동 거리','Myeongdong street','明洞の通り','明洞街头'],'Sgroey','CC BY-SA 4.0'],
 [['종로구 야간 거리','Jongno-gu street at night','鍾路区の夜の通り','钟路区夜间街景'],'William Anderson','CC BY-SA 3.0']
];
function renderCredits(el,extra){
  if(!el)return;const i={ko:0,en:1,ja:2,zh:3}[LANG];
  el.textContent=t('creditsHead')+CREDITS.map(c=>c[0][i]+' — '+c[1]+' ('+c[2]+')').join(' · ')+(extra?' · '+extra:'');
}

/* ---------- 언어 전환 UI ---------- */
function mountSwitcher(){
  const host=document.querySelector('.header .wrap');if(!host||document.getElementById('langSwitch'))return;
  const w=document.createElement('div');w.className='lang-switch';w.id='langSwitch';w.setAttribute('translate','no');
  const sel=document.createElement('select');sel.setAttribute('aria-label','Language');
  LANGS.forEach(l=>{const o=document.createElement('option');o.value=l[0];o.textContent=l[1];sel.appendChild(o);});
  sel.value=LANG;sel.addEventListener('change',()=>setLang(sel.value));
  w.appendChild(sel);
  const cta=host.querySelector('a.btn');host.insertBefore(w,cta||null);
}
function detect(){
  let q=null;try{q=new URLSearchParams(location.search).get('lang');}catch(e){}
  if(q&&LANGS.some(l=>l[0]===q)){try{localStorage.setItem('kt-lang',q);}catch(e){}return q;}
  try{const s=localStorage.getItem('kt-lang');if(s&&LANGS.some(l=>l[0]===s))return s;}catch(e){}
  const n=(navigator.language||'ko').toLowerCase();
  if(n.startsWith('ko'))return 'ko';if(n.startsWith('ja'))return 'ja';if(n.startsWith('zh'))return 'zh';
  return 'en';
}
function setLang(l,silent){
  // 언어별 정적 페이지(가이드 글)에서는 해당 언어의 주소로 이동합니다.
  if(window.I18N_NAV&&window.I18N_PAGE_LANG&&l!==window.I18N_PAGE_LANG&&window.I18N_NAV[l]){try{localStorage.setItem('kt-lang',l);}catch(e){}location.href=window.I18N_NAV[l];return;}
  LANG=l;document.documentElement.lang=l==='zh'?'zh-CN':l;document.documentElement.setAttribute('data-lang',l);
  try{localStorage.setItem('kt-lang',l);}catch(e){}
  const sel=document.querySelector('#langSwitch select');if(sel)sel.value=l;
  applyData();
  listeners.forEach(f=>{try{f(l);}catch(e){console.error(e);}});
  translateAll();
}
function start(){
  const PL=window.I18N_PAGE_LANG,NAV=window.I18N_NAV;
  if(PL){
    // 한국어 글 페이지: 방문자가 명시적으로 고른 언어(?lang= 또는 저장된 선택)가 있으면 그 언어의 같은 글로 이동합니다.
    // 검색 로봇처럼 선택한 적이 없는 방문자는 이동시키지 않습니다.
    if(PL==='ko'&&NAV){
      let want=null;try{want=new URLSearchParams(location.search).get('lang');}catch(e){}
      if(!want){try{want=localStorage.getItem('kt-lang');}catch(e){}}
      if(want&&want!=='ko'&&NAV[want]){location.replace(NAV[want]);return;}
    }
    LANG=PL;try{localStorage.setItem('kt-lang',PL);}catch(e){}
  }else{LANG=detect();}
  mountSwitcher();observe();
  document.documentElement.lang=LANG==='zh'?'zh-CN':LANG;document.documentElement.setAttribute('data-lang',LANG);
  const sel=document.querySelector('#langSwitch select');if(sel)sel.value=LANG;
  applyData();
  if(LANG!=='ko'){listeners.forEach(f=>{try{f(LANG);}catch(e){console.error(e);}});}
  translateAll();
}
window.I18N={t,tr,start,setLang,renderCredits,onChange:f=>listeners.push(f),get lang(){return LANG;}};
})();
