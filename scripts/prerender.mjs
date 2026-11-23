// 장소·지역 상세 정보를 검색엔진이 읽을 수 있는 정적 HTML 페이지로 만듭니다.
// 데이터 원본: places.js, tips.js, regions.js, guide-data.js, i18n-places.js, i18n-data.js (모두 4개 언어)
// 결과: /places/<id>, /places/, /regions/<key>  (+ /en/, /ja/, /zh/ 같은 구조), sitemap.xml 갱신
// 사용법: node scripts/prerender.mjs   (데이터 파일을 고친 뒤 다시 실행)
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://korea-easytrip.com';
const TODAY = new Date().toISOString().slice(0, 10);
const LANGS = ['ko', 'en', 'ja', 'zh'];
const HREFLANG = { ko: 'ko', en: 'en', ja: 'ja', zh: 'zh-CN' };
const LANGNAME = { ko: '한국어', en: 'English', ja: '日本語', zh: '中文' };
const pre = l => (l === 'ko' ? '' : '/' + l);

// ---- 데이터 불러오기 (브라우저 전역 window.* 를 vm 안에서 재현)
const ctx = { console, document: { querySelectorAll: () => [], addEventListener() {} }, location: { search: '' }, navigator: {}, localStorage: { getItem() { return null; } } };
ctx.window = ctx; vm.createContext(ctx);
for (const f of ['places.js', 'tips.js', 'regions.js', 'guide-data.js', 'i18n-places.js', 'i18n-data.js'])
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
const { PLACES: P, PLACE_TIPS: TIPS, TIPS_LABEL: TL, REGIONS: R, GUIDE: G, PLACE_I18N: PI, I18N_DATA: ID, THEMES } = ctx;

// ---- 이 스크립트에서만 쓰는 문구 (4개 언어)
const T = {
  ko: { site: '코리아 이지트립', home: '홈', places: '서울 여행지', regions: '지역 여행', hubTitle: '서울 여행지 30곳 상세 가이드: 맛집·가는 법·현지인 팁', hubDesc: '궁궐과 한옥마을, 전통시장, K-뷰티 쇼핑 거리, 야경 명소, 지하철로 가는 산까지. 장소마다 가는 길, 추천 동선, 주변 맛집과 가격대, 계절별 풍경을 직접 정리했습니다.', hubLead: '코리아 이지트립이 직접 조사해 정리한 서울과 근교 여행지 30곳입니다. 각 장소 페이지에서 가는 길과 추천 코스, 현지인이 자주 찾는 식당·카페, 대표 메뉴와 가격대, 드라마·영화 촬영 정보, 계절별 풍경을 확인할 수 있습니다.', beyond: '서울 밖 여행', placeTitle: n => `${n} 여행 가이드: 가는 법·주변 맛집·현지인 팁`, regionTitle: n => `${n} 여행 가이드: 2박 3일 코스·대표 음식·주요 명소`, about: '어떤 곳인가요', tipsH: '현지인 팁', map: '구글 지도에서 위치 보기', related: '같은 테마의 다른 장소', updated: d => `최종 수정일 ${d.replace(/(\d+)-(\d+)-(\d+)/, (m, y, mo, da) => `${y}년 ${+mo}월 ${+da}일`)}`, check: '운영 시간, 요금, 휴무일은 바뀔 수 있습니다. 방문 전 공식 사이트나 지도 앱에서 최신 정보를 확인하세요.', theme: '테마', spotsH: n => `${n}의 주요 명소`, foodH: '꼭 먹어 볼 음식', picks: '추천 식당', routeH: '추천 일정', tipsR: '여행 팁', links: '공식 정보 바로가기', other: '다른 지역', facts: '한눈에 보기', guides: '여행 가이드', tip: '방문 팁', planner: '내 여행 일정 만들기 →' },
  en: { site: 'Korea Easy Trip', home: 'Home', places: 'Seoul places', regions: 'Regions', hubTitle: '30 Seoul Places in Detail: Food, Getting There and Local Tips', hubDesc: 'Palaces and hanok villages, traditional markets, K-beauty streets, night views and mountains you can reach by subway — with directions, routes, nearby food, prices and seasonal views for each.', hubLead: 'These are 30 places in and around Seoul that Korea Easy Trip researched and wrote up. Each page covers how to get there, a suggested route, restaurants and cafes locals use, signature dishes and price ranges, K-drama and film connections, and how the place looks through the seasons.', beyond: 'Beyond Seoul', placeTitle: n => `${n} Travel Guide: Getting There, Where to Eat and Local Tips`, regionTitle: n => `${n} Travel Guide: 3-Day Route, Local Food and Top Sights`, about: 'About this place', tipsH: 'Local tips', map: 'See it on Google Maps', related: 'More places in this theme', updated: d => `Last updated: ${new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}`, check: 'Hours, fees and closing days can change. Check the official site or a map app before you go.', theme: 'Theme', spotsH: n => `Top sights in ${n}`, foodH: 'Food to try', picks: 'Where to eat', routeH: 'Suggested itinerary', tipsR: 'Travel tips', links: 'Official information', other: 'Other regions', facts: 'At a glance', guides: 'Travel guides', tip: 'Visiting tip', planner: 'Build my itinerary →' },
  ja: { site: 'Korea Easy Trip', home: 'ホーム', places: 'ソウルの観光スポット', regions: '地域ガイド', hubTitle: 'ソウルの観光スポット30か所 詳細ガイド：グルメ・アクセス・地元の人のヒント', hubDesc: '王宮や韓屋村、伝統市場、K-ビューティーの街、夜景スポット、地下鉄で行ける山まで。スポットごとにアクセス、おすすめルート、周辺の店と価格帯、四季の風景をまとめました。', hubLead: 'Korea Easy Trip が自ら調べてまとめた、ソウルと近郊の観光スポット30か所です。各ページでアクセスとおすすめコース、地元の人が通う店やカフェ、看板メニューと価格帯、ドラマ・映画のロケ情報、四季の風景を確認できます。', beyond: 'ソウルの外へ', placeTitle: n => `${n} 旅行ガイド：アクセス・周辺グルメ・地元の人のヒント`, regionTitle: n => `${n} 旅行ガイド：2泊3日コース・名物料理・主な見どころ`, about: 'どんな場所？', tipsH: '地元の人のヒント', map: 'Googleマップで場所を見る', related: '同じテーマのほかのスポット', updated: d => `最終更新日：${d.replace(/(\d+)-(\d+)-(\d+)/, (m, y, mo, da) => `${y}年${+mo}月${+da}日`)}`, check: '営業時間・料金・休業日は変わることがあります。訪問前に公式サイトや地図アプリで最新情報をご確認ください。', theme: 'テーマ', spotsH: n => `${n}の主な見どころ`, foodH: 'ぜひ食べたい料理', picks: 'おすすめの店', routeH: 'おすすめ日程', tipsR: '旅のヒント', links: '公式情報', other: 'ほかの地域', facts: 'ひと目でわかる', guides: '旅行ガイド', tip: '訪問のヒント', planner: '旅行日程を作る →' },
  zh: { site: 'Korea Easy Trip', home: '首页', places: '首尔景点', regions: '地区指南', hubTitle: '首尔30个景点详细指南：美食、交通与本地人小贴士', hubDesc: '宫殿与韩屋村、传统市场、K-美妆街区、夜景胜地，以及坐地铁就能到的山。每个景点都整理了交通、推荐路线、周边美食与价位、四季风景。', hubLead: '以下是 Korea Easy Trip 亲自调查整理的首尔及近郊30个景点。每个页面介绍交通方式与推荐路线、本地人常去的餐厅和咖啡馆、招牌菜与价位、韩剧和电影拍摄信息，以及四季风景。', beyond: '首尔以外的旅行', placeTitle: n => `${n}旅行指南：交通、周边美食与本地人小贴士`, regionTitle: n => `${n}旅行指南：三天两夜路线、特色美食与主要景点`, about: '这是什么地方', tipsH: '本地人小贴士', map: '在谷歌地图上查看位置', related: '同一主题的其他景点', updated: d => `最后更新：${d.replace(/(\d+)-(\d+)-(\d+)/, (m, y, mo, da) => `${y}年${+mo}月${+da}日`)}`, check: '营业时间、费用和休息日可能变动，出发前请在官方网站或地图应用上确认最新信息。', theme: '主题', spotsH: n => `${n}的主要景点`, foodH: '必吃美食', picks: '推荐餐厅', routeH: '推荐行程', tipsR: '旅行小贴士', links: '官方信息', other: '其他地区', facts: '一览', guides: '旅行指南', tip: '参观小贴士', planner: '制作我的行程 →' }
};

// ---- 공통 도우미
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const L = (x, l) => (!x ? '' : typeof x === 'string' ? x : x[l] || x.ko);
const GL = (k, l) => L(G.label[k], l);
const mapUrl = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
const ext = ' target="_blank" rel="noopener noreferrer"';
const cred = c => (c ? `<a class="photo-src" href="${esc(c[2])}"${ext} translate="no">© ${esc(c[0])} · ${esc(c[1])}</a>` : '');
const placeName = (id, l) => (l === 'ko' ? P[id].name : (PI[id] && PI[id][l] && PI[id][l][0]) || P[id].name);
const placeIntro = (id, l) => (l === 'ko' ? P[id].intro : (PI[id] && PI[id][l] && PI[id][l][1]) || P[id].intro);
const regionData = (k, l) => (l === 'ko' ? R[k] : { ...R[k], ...((ID.regions[k] || {})[l] || {}) });
const themeOf = id => Object.keys(THEMES).find(k => THEMES[k].ids.includes(id));
const themeText = (k, l, i) => (l === 'ko' ? (i ? THEMES[k].desc : THEMES[k].label) : ((ID.themes[k] || {})[l] || [])[i] || (i ? THEMES[k].desc : THEMES[k].label));
const themeLabel = (k, l) => themeText(k, l, 0);
const cut = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

// 헤더·푸터는 이미 있는 언어별 가이드 페이지에서 그대로 가져옵니다.
const chrome = {};
for (const l of LANGS) {
  const src = fs.readFileSync(path.join(ROOT, (l === 'ko' ? '' : l + '/') + 'guides/airport-to-seoul.html'), 'utf8');
  const head = src.slice(0, src.indexOf('<meta charset'));
  const header = src.slice(src.indexOf('<body>') + 6, src.indexOf('<main>'));
  const footer = src.slice(src.indexOf('</main>') + 7, src.indexOf('<script>window.I18N_PAGE_LANG'));
  const redirect = (src.match(/<script>\(function\(\)\{var h=location\.hostname[\s\S]*?<\/script>/) || [''])[0];
  chrome[l] = { head, header, footer, redirect };
}

function page({ l, url, alt, title, desc, img, body, depth, jsonld }) {
  const up = '/', c = chrome[l];
  const alts = LANGS.map(x => `  <link rel="alternate" hreflang="${HREFLANG[x]}" href="${SITE}${alt[x]}"/>`).join('\n');
  const nav = JSON.stringify(Object.fromEntries(LANGS.map(x => [x, alt[x]])));
  return `<!doctype html>
<html lang="${HREFLANG[l]}" data-lang="${l}">
${c.head.replace(/^<!doctype html>\s*<html[^>]*>\s*/i, '')}  <meta charset="UTF-8"/>
  ${c.redirect}
  <meta name="google-adsense-account" content="ca-pub-5580189283913928"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <meta name="description" content="${esc(desc)}"/>
  <title>${esc(title)} | ${esc(T[l].site)}</title>
  <link rel="canonical" href="${SITE}${url}"/>
  <meta property="og:title" content="${esc(title)}"/>
  <meta property="og:description" content="${esc(desc)}"/>
  <meta property="og:type" content="article"/>
  <meta property="og:url" content="${SITE}${url}"/>
  <meta property="og:image" content="${SITE}/${img || 'images/hero.jpg'}"/>
  <meta name="twitter:card" content="summary_large_image"/>
${alts}
  <link rel="alternate" hreflang="x-default" href="${SITE}${alt.ko}"/>
  <link rel="stylesheet" href="${up}styles.css?v=20261123"/>
  <script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>
</head>
<body>
${c.header}<main><article class="section"><div class="wrap narrow article">
${body}
</div></article></main>
${c.footer}<script>window.I18N_PAGE_LANG='${l}';window.I18N_NAV=${nav};</script>
<script src="${up}i18n-dict.js?v=20261117"></script>
<script src="${up}i18n.js?v=20261117"></script>
<script>
(function(){'use strict';
const $=s=>document.querySelector(s);
$('#menuButton').addEventListener('click',()=>{const o=$('#navigation').classList.toggle('open');$('#menuButton').setAttribute('aria-expanded',String(o));});
I18N.start();
})();
</script>
<script src="${up}ads.js?v=20261117"></script>
</body></html>
`;
}

const altLinks = (l, alt) => `<p class="mini altlangs">${LANGS.map(x => (x === l ? `<span>${LANGNAME[x]}</span>` : `<a href="${alt[x]}" hreflang="${HREFLANG[x]}" lang="${HREFLANG[x]}">${LANGNAME[x]}</a>`)).join(' · ')}</p>`;
const figure = (src, alt, credit) => `<figure class="dlg-photo" style="margin:0 0 18px"><div class="season-img" style="aspect-ratio:16/9"><img src="/${esc(src)}" alt="${esc(alt)}" loading="eager"/>${cred(credit)}</div></figure>`;
const adSlot = l => `<div class="ad-wrap" hidden><span class="ad-label">${l === 'ko' ? '광고' : l === 'en' ? 'Advertisement' : l === 'ja' ? '広告' : '广告'}</span><div class="ad-slot"></div></div>`;
const tipsBlock = (id, l) => {
  const x = TIPS[id]; if (!x) return '';
  const v = x[l] || x.ko, lb = TL[l];
  return `<h2>${esc(T[l].tipsH)}</h2>
<h3 class="gd-h">🚇 ${esc(lb.s)}</h3><p>${esc(v[0])}</p>
<h3 class="gd-h">🗺️ ${esc(lb.c)}</h3><p>${esc(v[1])}</p>
<h3 class="gd-h">${x.food ? '🍽️ ' + esc(lb.r) : '☕ ' + esc(lb.f)}</h3><p><strong>${esc(x.cafe)}</strong> — ${esc(v[2])} <a href="${mapUrl(x.q)}"${ext}>${esc(lb.m)} ↗</a></p>
<p class="mini muted">${esc(lb.n)}</p>`;
};
const heroOf = (id) => {
  const p = P[id], d = G.spots[id] || {};
  if (p.img) return [p.img, p.credit];
  const g = (d.gallery || [])[0] || (d.seasons || []).find(s => s.img);
  return g ? [g.img, g.credit] : [null, null];
};

const written = [];
function write(rel, html) {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
  written.push(rel);
}

// ---- 1) 장소 상세 페이지: guide-data.js 에 상세 정보가 있는 30곳
const spotIds = Object.keys(G.spots).filter(id => P[id]);
for (const id of spotIds) {
  const d = G.spots[id], th = themeOf(id);
  const alt = Object.fromEntries(LANGS.map(x => [x, `${pre(x)}/places/${id}`]));
  for (const l of LANGS) {
    const t = T[l], name = placeName(id, l), intro = placeIntro(id, l);
    const [img, credit] = heroOf(id);
    let b = `  <p class="crumb"><a href="${pre(l)}/places/">${esc(t.places)}</a>${th ? ` › ${esc(themeLabel(th, l))}` : ''} › ${esc(name)}</p>
  <h1>${esc(t.placeTitle(name))}</h1>
  <p class="muted meta-line">${esc(t.updated(TODAY))}</p>
  ${altLinks(l, alt)}
  ${img ? figure(img, name, credit) : ''}
  <h2>${esc(t.about)}</h2>
  <p class="lead">${esc(intro)}</p>`;
    if (d.tip) b += `\n  <div class="tips" style="margin-top:18px"><h3>💡 ${esc(t.tip)}</h3><p style="margin:0">${esc(L(d.tip, l))}</p></div>`;
    b += '\n' + tipsBlock(id, l);
    if (d.eats) b += `\n<h2>${esc(GL('eats', l))}</h2><ul class="eat-list">${d.eats.map(e => `<li><a class="eat-name" href="${mapUrl(e.q)}"${ext}><b>${esc(L(e.n, l))}</b>${l !== 'ko' && e.n.ko ? ` <span class="ko-name" lang="ko" translate="no">${esc(e.n.ko)}</span>` : ''} <span class="map-ico" aria-hidden="true">↗</span></a><div class="eat-meta"><span><em>${esc(GL('menu', l))}</em>${esc(L(e.menu, l))}</span><span><em>${esc(GL('price', l))}</em>${esc(L(e.price, l))}</span></div><p>${esc(L(e.d, l))}</p></li>`).join('')}</ul><p class="mini muted">${esc(GL('priceNote', l))}</p>`;
    if (d.how) b += `\n<h2>${esc(GL('how', l))}</h2><div class="how-list">${d.how.map(x => `<div class="how"><h3 style="margin:0;font-size:16px">${esc(L(x.h, l))}</h3><p>${esc(L(x.d, l))}</p></div>`).join('')}</div>`;
    b += '\n' + adSlot(l);
    if (d.works) b += `\n<h2>${esc(GL('works', l))}</h2><ul class="work-list">${d.works.map(w => `<li><span class="work-k">${esc(GL(w.k, l))}</span><b>${esc(L(w.t, l))}</b><p>${esc(L(w.d, l))}</p></li>`).join('')}</ul>`;
    if (d.seasons) b += `\n<h2>${esc(GL('seasons', l))}</h2><div class="season-grid">${d.seasons.map(s => `<figure class="season"><div class="season-img${s.img ? '' : ' empty'}">${s.img ? `<img src="/${esc(s.img)}" alt="${esc(name + ' · ' + GL(s.s, l))}" loading="lazy"/>${cred(s.credit)}` : `<span>${esc(GL('noPhoto', l))}</span>`}</div><figcaption><b>${esc(GL(s.s, l))}</b>${esc(L(s.d, l))}</figcaption></figure>`).join('')}</div>`;
    if (d.gallery) b += `\n<h2>${esc(GL('gallery', l))}</h2><div class="gallery">${d.gallery.map(g => `<figure><div class="season-img"><img src="/${esc(g.img)}" alt="${esc(L(g.cap, l))}" loading="lazy"/>${cred(g.credit)}</div><figcaption>${esc(L(g.cap, l))}</figcaption></figure>`).join('')}</div>`;
    b += `\n<p style="margin-top:22px"><a class="btn btn-outline" href="${mapUrl(P[id].map)}"${ext}>${esc(t.map)} ↗</a></p>
<p class="mini muted">${esc(t.check)}</p>`;
    if (th) b += `\n<h2>${esc(t.related)}</h2>\n<ul class="rel">${THEMES[th].ids.filter(x => x !== id && G.spots[x]).map(x => `<li><a href="${pre(l)}/places/${x}">${esc(placeName(x, l))}</a> — ${esc(cut(placeIntro(x, l), 70))}</li>`).join('')}</ul>`;
    const title = t.placeTitle(name);
    write(`${l === 'ko' ? '' : l + '/'}places/${id}.html`, page({
      l, url: alt[l], alt, title, desc: cut(intro, 150), img, body: b, depth: l === 'ko' ? 1 : 2,
      jsonld: { '@context': 'https://schema.org', '@type': 'Article', headline: title, description: cut(intro, 150), inLanguage: HREFLANG[l], dateModified: TODAY, author: { '@type': 'Organization', name: T[l].site, url: SITE + '/about' }, publisher: { '@type': 'Organization', name: T[l].site }, mainEntityOfPage: SITE + alt[l], about: { '@type': 'TouristAttraction', name } }
    }));
  }
}

// ---- 2) 지역 페이지: 부산·제주·설악 (주요 명소의 소개와 현지인 팁까지 포함)
const regionKeys = Object.keys(R);
for (const k of regionKeys) {
  const alt = Object.fromEntries(LANGS.map(x => [x, `${pre(x)}/regions/${k}`]));
  for (const l of LANGS) {
    const t = T[l], r = regionData(k, l), raw = R[k];
    let b = `  <p class="crumb"><a href="${pre(l)}/places/">${esc(t.regions)}</a> › ${esc(r.name)}</p>
  <h1>${esc(t.regionTitle(r.name))}</h1>
  <p class="muted meta-line">${esc(t.updated(TODAY))}</p>
  ${altLinks(l, alt)}
  ${figure(raw.hero, r.name, null)}<p class="mini muted" style="margin-top:-10px">${esc(r.credit)}</p>
  <p class="lead"><b>${esc(r.tagline)}</b></p>
  <p>${esc(r.intro)}</p>
  <h2>${esc(t.facts)}</h2><ul>${r.facts.map(f => `<li><b>${esc(f[0])}</b>: ${esc(f[1])}</li>`).join('')}</ul>
  <h2>${esc(t.spotsH(r.name))}</h2>`;
    for (const id of raw.spots) {
      if (!P[id]) continue;
      const x = TIPS[id], v = x && (x[l] || x.ko), lb = TL[l];
      b += `\n<h3 class="gd-h" style="font-size:19px">${esc(placeName(id, l))}</h3><p>${esc(placeIntro(id, l))}</p>`;
      if (v) b += `<ul><li><b>${esc(lb.s)}</b>: ${esc(v[0])}</li><li><b>${esc(lb.c)}</b>: ${esc(v[1])}</li><li><b>${esc(x.food ? lb.r : lb.f)}</b>: ${esc(x.cafe)} — ${esc(v[2])} <a href="${mapUrl(x.q)}"${ext}>${esc(lb.m)} ↗</a></li></ul>`;
    }
    b += '\n' + adSlot(l);
    b += `\n<h2>${esc(r.foodTitle || t.foodH)}</h2>`;
    r.food.forEach((f, i) => {
      b += `\n<h3 class="gd-h" style="font-size:18px">${esc(f[0])}</h3><p>${esc(f[1])}</p>`;
      const picks = raw.eats && raw.eats[i];
      if (picks && picks.length) b += `<ul>${picks.map(p => `<li><a href="${mapUrl(p.q)}"${ext}><b>${esc(L(p.n, l))}</b></a>${l !== 'ko' && p.n.ko ? ` <span class="ko-name" lang="ko" translate="no">${esc(p.n.ko)}</span>` : ''}${p.d ? ' — ' + esc(L(p.d, l)) : ''}</li>`).join('')}</ul>`;
    });
    b += `\n<h2>${esc(t.routeH)}</h2><ol>${r.route.map(x => `<li><b>${esc(x[0])}</b>: ${esc(x[1])}</li>`).join('')}</ol>`;
    b += `\n<div class="tips"><h3>${esc(t.tipsR)}</h3><ul>${r.tips.map(x => `<li>${esc(x)}</li>`).join('')}</ul><p class="mini muted" style="margin:12px 0 0">${esc(t.check)}</p></div>`;
    b += `\n<div class="tips"><h3>${esc(t.links)}</h3><div class="dlg-links">${raw.links.map(x => `<a class="dlg-link" href="${esc(x[1])}"${ext}><span>${esc(x[0])}</span><span aria-hidden="true">↗</span></a>`).join('')}</div></div>`;
    if (raw.preset) b += `\n<p style="margin-top:22px"><a class="btn" href="/?preset=${encodeURIComponent(raw.preset)}#plan">${esc(t.planner)}</a></p>`;
    b += `\n<h2>${esc(t.other)}</h2><ul class="rel">${regionKeys.filter(x => x !== k).map(x => `<li><a href="${pre(l)}/regions/${x}">${esc(regionData(x, l).name)}</a> — ${esc(regionData(x, l).tagline)}</li>`).join('')}</ul>`;
    const title = t.regionTitle(r.name);
    write(`${l === 'ko' ? '' : l + '/'}regions/${k}.html`, page({
      l, url: alt[l], alt, title, desc: cut(r.intro, 150), img: raw.hero, body: b, depth: l === 'ko' ? 1 : 2,
      jsonld: { '@context': 'https://schema.org', '@type': 'Article', headline: title, description: cut(r.intro, 150), inLanguage: HREFLANG[l], dateModified: TODAY, author: { '@type': 'Organization', name: T[l].site, url: SITE + '/about' }, mainEntityOfPage: SITE + alt[l] }
    }));
  }
}

// ---- 3) 목록 페이지 /places/
{
  const alt = Object.fromEntries(LANGS.map(x => [x, `${pre(x)}/places/`]));
  for (const l of LANGS) {
    const t = T[l];
    let b = `  <p class="crumb"><a href="${l === 'en' ? '/en/' : '/'}">${esc(t.home)}</a> › ${esc(t.places)}</p>
  <h1>${esc(t.hubTitle)}</h1>
  <p class="muted meta-line">${esc(t.updated(TODAY))}</p>
  ${altLinks(l, alt)}
  <p class="lead">${esc(t.hubLead)}</p>`;
    for (const th of Object.keys(THEMES)) {
      const ids = THEMES[th].ids.filter(x => G.spots[x]);
      if (!ids.length) continue;
      b += `\n<h2>${esc(themeLabel(th, l))}</h2><p>${esc(themeText(th, l, 1))}</p><ul class="rel">${ids.map(x => `<li><a href="${pre(l)}/places/${x}">${esc(placeName(x, l))}</a> — ${esc(cut(placeIntro(x, l), 80))}</li>`).join('')}</ul>`;
      // 테마별 안내(guide-data.js GUIDE.themes): 사진을 누르라는 화면 안내 문구는 정적 페이지에 맞지 않아 뺍니다.
      for (const sec of (G.themes[th] || [])) {
        const items = sec.items.filter(it => !/사진을 눌러|Tap a photo/.test(L(it.n, 'ko') + L(it.n, 'en')));
        if (items.length) b += `\n<h3 class="gd-h">${esc(L(sec.h, l))}</h3><ul>${items.map(it => `<li><b>${esc(L(it.n, l))}</b>: ${esc(L(it.d, l))}</li>`).join('')}</ul>`;
      }
    }
    b += `\n<h2>${esc(t.beyond)}</h2><ul class="rel">${regionKeys.map(x => `<li><a href="${pre(l)}/regions/${x}">${esc(regionData(x, l).name)}</a> — ${esc(regionData(x, l).tagline)}</li>`).join('')}</ul>`;
    b += `\n<p style="margin-top:22px"><a class="btn btn-outline" href="${pre(l)}/guides/">${esc(t.guides)} →</a></p>`;
    write(`${l === 'ko' ? '' : l + '/'}places/index.html`, page({
      l, url: alt[l], alt, title: t.hubTitle, desc: t.hubDesc, img: 'images/hero.jpg', body: b, depth: l === 'ko' ? 1 : 2,
      jsonld: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: t.hubTitle, description: t.hubDesc, inLanguage: HREFLANG[l], url: SITE + alt[l] }
    }));
  }
}

// ---- 4) sitemap.xml: 예전 region?r= 주소를 빼고 새 페이지를 넣습니다.
{
  const sm = path.join(ROOT, 'sitemap.xml');
  let xml = fs.readFileSync(sm, 'utf8').replace(/\r\n/g, '\n');
  const lines = xml.split('\n').filter(x => !/region\?r=|\/places\/|\/regions\//.test(x));
  const urls = written.map(f => '/' + f.replace(/\\/g, '/').replace(/index\.html$/, '').replace(/\.html$/, ''));
  const add = urls.map(u => `  <url><loc>${SITE}${u}</loc><lastmod>${TODAY}</lastmod></url>`);
  const end = lines.findIndex(x => x.includes('</urlset>'));
  lines.splice(end, 0, ...add);
  fs.writeFileSync(sm, lines.join('\n'));
}
console.log(`생성 ${written.length}개 페이지 (장소 ${spotIds.length}곳 × 4개 언어, 지역 ${regionKeys.length}곳 × 4, 목록 4)`);

// ---- 5) news.html: 뉴스 목록을 HTML에 미리 채워 둡니다(화면에서는 스크립트가 같은 자리를 다시 그림).
{
  const nctx = { console }; nctx.window = nctx; vm.createContext(nctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'news-data.js'), 'utf8'), nctx);
  const f = path.join(ROOT, 'news.html');
  let h = fs.readFileSync(f, 'utf8');
  const list = nctx.NEWS.map((n, i) => `<article class="news" id="n${i}"><div class="meta"><span class="cat ${esc(n.catClass)}">${esc(n.cat)}</span><span>${esc(n.date)}</span></div><h3>${esc(n.title)}</h3><p>${esc(n.summary)}</p><div class="src">출처: ${n.sources.map(s => `<a href="${esc(s[1])}"${ext}>${esc(s[0])}</a>`).join(' · ')}</div></article>`).join('');
  h = h.replace(/<div class="news-grid" id="newsList">[\s\S]*?<\/div>\s*<div id="empty"/, `<div class="news-grid" id="newsList">${list}</div>\n    <div id="empty"`);
  fs.writeFileSync(f, h);
}
