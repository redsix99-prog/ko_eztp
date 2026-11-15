/* 구글 애드센스 설정과 로더
 * 1) 아래 ADS.client 에 게시자 ID(ca-pub-숫자16자리)를, ADS.slot 에 광고 단위 ID(숫자)를 넣으면 광고가 켜집니다.
 * 2) ID가 비어 있으면 광고 영역과 동의 배너는 화면에 나타나지 않고, 광고 스크립트도 불러오지 않습니다.
 * 3) 방문자가 광고 쿠키에 동의한 경우에만 광고 스크립트를 불러옵니다(localStorage 'kt-ads-consent').
 */
(function(){
'use strict';
const ADS={client:'ca-pub-5580189283913928',slot:''};   // ← 여기만 채우면 됩니다. 예: client:'ca-pub-1234567890123456', slot:'1234567890'
const KEY='kt-ads-consent';
const TX={
 ko:{label:'광고',msg:'이 사이트는 구글 애드센스 광고를 표시하며, 광고 제공을 위해 쿠키가 사용될 수 있습니다. 광고 쿠키 사용에 동의하시겠어요?',yes:'동의',no:'거부',more:'개인정보 처리방침',privacy:'개인정보 처리방침'},
 en:{label:'Advertisement',msg:'This site shows Google AdSense ads, which may use cookies. Do you agree to the use of advertising cookies?',yes:'Agree',no:'Decline',more:'Privacy policy',privacy:'Privacy policy'},
 ja:{label:'広告',msg:'このサイトではGoogleアドセンス広告を表示し、広告配信のためにCookieが使われる場合があります。広告用Cookieの使用に同意しますか？',yes:'同意する',no:'拒否する',more:'プライバシーポリシー',privacy:'プライバシーポリシー'},
 zh:{label:'广告',msg:'本网站展示Google AdSense广告，广告投放可能会使用Cookie。您是否同意使用广告Cookie？',yes:'同意',no:'拒绝',more:'隐私政策',privacy:'隐私政策'}
};
const L=()=>TX[(window.I18N&&I18N.lang)||'ko']||TX.ko;
const active=/^ca-pub-\d{10,20}$/.test(ADS.client);
function getConsent(){try{return localStorage.getItem(KEY);}catch(e){return null;}}
function setConsent(v){try{localStorage.setItem(KEY,v);}catch(e){}}

/* 푸터에 개인정보 처리방침 링크 */
function footerLink(){
  const col=document.querySelector('.footer .footgrid > div:nth-child(2)');if(!col)return;
  let a=col.querySelector('a[data-privacy]');
  if(!a){a=document.createElement('a');a.setAttribute('data-privacy','1');a.href='privacy.html';col.appendChild(a);}
  a.textContent=L().privacy;
}

/* 광고 영역 */
let loaded=false;
function renderSlots(){
  document.querySelectorAll('.ad-wrap').forEach(w=>{
    const lab=w.querySelector('.ad-label');if(lab)lab.textContent=L().label;
  });
}
function loadAds(){
  if(loaded||!active)return;loaded=true;
  const s=document.createElement('script');s.async=true;s.crossOrigin='anonymous';
  s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+encodeURIComponent(ADS.client);
  document.head.appendChild(s);
  if(ADS.slot){
    document.querySelectorAll('.ad-slot').forEach(el=>{
      const ins=document.createElement('ins');ins.className='adsbygoogle';ins.style.display='block';
      ins.setAttribute('data-ad-client',ADS.client);ins.setAttribute('data-ad-slot',ADS.slot);
      ins.setAttribute('data-ad-format','auto');ins.setAttribute('data-full-width-responsive','true');
      el.appendChild(ins);
      try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){}
    });
    document.querySelectorAll('.ad-wrap').forEach(w=>w.hidden=false);
  }
}

/* 동의 배너 */
function banner(){
  if(!active||getConsent())return;
  const b=document.createElement('div');b.className='consent';b.setAttribute('role','dialog');b.setAttribute('aria-label','Cookie consent');
  function draw(){const t=L();b.innerHTML='<p>'+t.msg+' <a href="privacy.html">'+t.more+'</a></p><div class="consent-btns"><button type="button" class="btn btn-outline" data-v="no">'+t.no+'</button><button type="button" class="btn" data-v="yes">'+t.yes+'</button></div>';}
  draw();
  b.addEventListener('click',e=>{const v=e.target.getAttribute&&e.target.getAttribute('data-v');if(!v)return;setConsent(v);b.remove();if(v==='yes')loadAds();});
  document.body.appendChild(b);
  if(window.I18N)I18N.onChange(()=>{if(b.isConnected)draw();});
}

footerLink();renderSlots();
if(window.I18N)I18N.onChange(()=>{footerLink();renderSlots();});
if(active){if(getConsent()==='yes')loadAds();else banner();}
window.KT_ADS={active,reconsent(){try{localStorage.removeItem(KEY);}catch(e){}location.reload();}};
})();
