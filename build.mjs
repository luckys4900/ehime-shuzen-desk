// 売却前おまかせデスク（愛媛修繕デスク）静的サイトビルド
// src/pages/*.html（本文）に共通 header/footer を合成し dist/ へ出力する。
// GitHub Pages のサブパス配信に対応するため、全リンクは相対パスで生成する。
// 本番公開時は PRODUCTION=1 でビルドすると、検索エンジン向けの noindex を外す。
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const sha1 = (f) => createHash('sha1').update(readFileSync(f)).digest('hex');

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const DIST = process.env.OUT_DIR || join(ROOT, 'dist');
const SITE_URL = 'https://luckys4900.github.io/ehime-shuzen-desk/';
const BASE_PATH = new URL(SITE_URL).pathname;
// 検証用に SITE_CONFIG_OVERRIDE（JSON）で設定を一時的に上書きできる（本番ビルドでは使わない）
const CONFIG = Object.assign(JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'site.config.json'), 'utf8')), process.env.SITE_CONFIG_OVERRIDE ? JSON.parse(process.env.SITE_CONFIG_OVERRIDE) : {});
const SITE_NAME = CONFIG.serviceName || '売却前おまかせデスク';
const BUILD_ID = (process.env.GITHUB_SHA || 'local').slice(0, 12);
const PRODUCTION = process.env.PRODUCTION === '1';
const CTA_LABEL = '写真を送って案件相談';
const CTA_SUB = '相談無料 ｜ 既存業者との併用OK ｜ 松山市・近郊対応';
// 区切りの位置でだけ改行させる
const CTA_SUB_HTML = CTA_SUB.split(' ｜ ').map((t) => `<span class="nw">${t}</span>`).join('<span class="sub-sep"> ｜ </span>');
// 本文中の相談導線（{{ctaline:pos}}）の一文。位置ごとに文脈に合わせる
const CTALINE_TEXT = { keep: 'いつもの業者さんはそのままで。売却前の案件だけ、ご相談ください。', services: '1つだけでも、まとめてでも。写真から内容を整理します。', flow: '写真と物件エリアだけで、ご相談いただけます。' };
// 電話番号は設定されている場合のみ表示する（ダミー番号は入れない）
const PHONE = CONFIG.phone ? String(CONFIG.phone).trim() : '';
const PHONE_HREF = PHONE ? 'tel:' + PHONE.replace(/[^\d+]/g, '') : '';

const pages = [
  { slug: '', file: 'index.html', title: '松山の不動産会社向け｜売却前の残置物・清掃・小修繕をまとめて相談｜売却前おまかせデスク', description: '松山市周辺の不動産会社向け。売却前の残置物整理、空室清掃、草刈り、小修繕などをまとめて相談。いつもの業者さんがいてもOK。写真を送るだけでご相談いただけます。' },
  { slug: 'partner', file: 'partner.html', title: '協力事業者の募集｜売却前おまかせデスク', description: '松山市・近郊で、残置物整理・清掃・草刈り・小修繕などに対応いただける事業者様を募集しています。許可や資格が必要な業務は、該当する許可・資格をお持ちの方にのみご依頼します。' },
  { slug: 'credits', file: 'credits.html', title: '写真クレジット｜売却前おまかせデスク', description: '売却前おまかせデスクのサイトで使用している写真の出典とライセンス。' },
  { slug: 'privacy', file: 'privacy.html', title: '個人情報の取扱い｜売却前おまかせデスク', description: '売却前おまかせデスクの案件相談フォーム等でお預かりする個人情報・写真の取扱いについて。' },
];
// 旧ページ（前バージョンの業種別ページ・問い合わせページ）は、リンク切れを防ぐため新しいページへ転送する
const redirects = [
  { slug: 'kanri', to: '' },
  { slug: 'kaitori', to: '' },
  { slug: 'shop', to: '' },
  { slug: 'contact', to: '#form' },
];

const partial = (name) => readFileSync(join(SRC, 'partials', name), 'utf8');
const PARTIALS = { cta: partial('cta.html'), flow: partial('flow.html'), ctaline: partial('ctaline.html') };
const OG = JSON.parse(readFileSync(join(SRC, 'assets', 'og.json'), 'utf8'));
const PHOTOS = existsSync(join(SRC, 'assets', 'photos', 'photos.json')) ? JSON.parse(readFileSync(join(SRC, 'assets', 'photos', 'photos.json'), 'utf8')) : {};

// ページ内の主要セクションへの目次
const nav = [
  { href: '#services', label: '対応内容' },
  { href: '#examples', label: 'ご相談例' },
  { href: '#flow', label: '利用の流れ' },
  { href: '#faq', label: 'よくある質問' },
];

// 写真：{{photo:name|代替テキスト|追加クラス|キャプション|eager}} は <figure>、{{img:name|代替テキスト|sizes|eager}} は <img> に展開する
function imgTag(base, name, alt, sizes, eager) {
  const p = PHOTOS[name];
  if (!p) throw new Error(`photo not found: ${name}`);
  const f = (k) => `${base}assets/photos/${name}-${k}.jpg`;
  return `<img src="${f('l')}" srcset="${f('s')} ${p.sw}w, ${f('l')} ${p.lw}w" sizes="${sizes}" width="${p.lw}" height="${p.lh}" alt="${alt}"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}>`;
}
function photo(base, spec) {
  const [name, alt = '', cls = '', cap = '写真はイメージです', eager = ''] = spec.split('|');
  const sizes = /hero__bg/.test(cls) ? '(max-width: 767px) 270vw, 100vw' : /cta__bg/.test(cls) ? '(max-width: 767px) 200vw, 100vw' : '(max-width: 1023px) 100vw, 55vw';
  const capHtml = cap === '-' ? '' : `<figcaption class="photo__cap">${cap}</figcaption>`;
  return `<figure class="photo ${cls}">${imgTag(base, name, alt, sizes, eager)}${capHtml}</figure>`;
}
function img(base, spec) {
  const [name, alt = '', sizes = '100vw', eager = ''] = spec.split('|');
  return imgTag(base, name, alt, sizes, eager);
}
const PAGE_LABEL = { 'index.html': 'トップページ', 'partner.html': '協力事業者の募集ページ', 'cta.html': 'トップページ末尾のご相談案内（背景）' };
function photoUsage() {
  const used = {};
  const files = [...pages.map((p) => ['pages', p.file]), ['partials', 'cta.html'], ['partials', 'flow.html']];
  for (const [dir, file] of files) {
    const src = readFileSync(join(SRC, dir, file), 'utf8');
    for (const m of src.matchAll(/\{\{(?:photo|img):(\w+)/g)) {
      (used[m[1]] ||= new Set()).add(PAGE_LABEL[file] || file);
    }
  }
  return used;
}
function creditsHtml(base) {
  const used = photoUsage();
  const rows = Object.entries(PHOTOS).filter(([name]) => used[name] || OG.photo === name).map(([name, p]) => {
    const isPexels = p.source === 'pexels';
    const id = isPexels ? (p.page.match(/photo\/(\d+)/) || [])[1] : '';
    const where = [...(used[name] || [])];
    if (OG.photo === name) where.push('SNS共有用画像（OGP）');
    return `<li class="credit">
  <img src="${base}assets/photos/${name}-s.jpg" width="200" height="150" alt="" loading="lazy" decoding="async">
  <dl>
    <dt>使用箇所</dt><dd>${where.join('、')}</dd>
    <dt>作品名</dt><dd>${isPexels ? `Pexels 写真 ID ${id}（タイトルは出典ページを参照）` : p.title}</dd>
    <dt>撮影者・提供者</dt><dd>${isPexels ? 'Pexels 投稿者（Pexels License ではクレジット表示は任意）' : p.creator}</dd>
    <dt>出典</dt><dd><a href="${p.page}" rel="noopener">${isPexels ? 'Pexels' : 'Flickr'}</a></dd>
    <dt>ライセンス</dt><dd><a href="${p.licenseUrl}" rel="noopener">${p.license}</a></dd>
  </dl>
</li>`;
  }).join('\n');
  return `<ul class="credits">${rows}</ul><p class="credits-note">いずれの写真も、本サイトの表示に合わせて縦横比 4:3 にトリミングし、縮小・圧縮しています（改変あり）。売却前おまかせデスクの作業事例ではありません。</p>`;
}

const logo = (base) => `<a class="logo" href="${base || './'}" aria-label="${SITE_NAME} トップページ">
  <svg class="logo__mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect x="1" y="1" width="38" height="38" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 20 L20 9 L32 20" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 18 V31 H28 V18" fill="none" stroke="currentColor" stroke-width="2"/><rect x="17.5" y="23" width="5" height="8" fill="#c8662f"/></svg>
  <span class="logo__text"><span class="logo__name">${SITE_NAME}</span><span class="logo__sub">PRE-SALE SUPPORT DESK</span></span>
</a>`;

const phoneLink = (cls, track) => PHONE ? `<a class="${cls}" href="${PHONE_HREF}" data-track="phone_click" data-track-pos="${track}">電話で相談</a>` : '';

function header(base, current) {
  const items = nav.map((n) => `<li><a href="${base}${n.href}">${n.label}</a></li>`).join('');
  return `<a class="skip" href="#main">本文へスキップ</a>
<header class="site-header">
  <div class="site-header__inner">
    ${logo(base)}
    <nav class="gnav" id="gnav" aria-label="メインメニュー">
      <ul class="gnav__list">${items}</ul>
      ${phoneLink('gnav__tel', 'header')}
      <a class="btn btn--primary gnav__cta" href="${base}#form" data-track="cta_click" data-track-pos="header">${CTA_LABEL}</a>
    </nav>
    <button class="menu-btn" type="button" aria-controls="gnav" aria-expanded="false"><span class="menu-btn__bars" aria-hidden="true"></span><span class="menu-btn__label">メニュー</span></button>
  </div>
</header>`;
}

function footer(base, slug) {
  const items = [{ href: '', label: 'トップページ' }, { href: '#form', label: '案件相談フォーム' }, { href: 'partner/', label: '協力事業者の募集' }, { href: 'privacy/', label: '個人情報の取扱い' }, { href: 'credits/', label: '写真クレジット' }]
    .map((n) => `<li><a href="${base}${n.href}">${n.label}</a></li>`).join('');
  const mobile = slug === 'partner'
    ? `<a class="btn btn--primary" href="#entry">協力事業者として登録を相談する</a>`
    : `${PHONE ? `<a class="btn btn--tel" href="${PHONE_HREF}" data-track="phone_click" data-track-pos="sticky">電話で相談</a>` : ''}<a class="btn btn--primary" href="${base}#form" data-track="sticky_cta_click">写真を送って相談</a>`;
  return `<footer class="site-footer">
  <div class="container site-footer__inner">
    <div class="site-footer__brand">
      ${logo(base)}
      <p>松山周辺の不動産会社様向け<br>売却前の現場手配・調整の窓口</p>
      <p class="site-footer__area">対応エリア：<span class="nw">松山市</span>・<span class="nw">松前町</span>・<span class="nw">伊予市</span>・<span class="nw">東温市</span>・<span class="nw">砥部町</span>ほか近郊（案件によりご相談）</p>
      ${slug === 'partner' ? '' : `<div class="site-footer__cta"><a class="btn btn--primary" href="${base}#form" data-track="cta_click" data-track-pos="footer">${CTA_LABEL}</a><p>${CTA_SUB_HTML}</p></div>`}
      ${PHONE ? `<p class="site-footer__tel">電話：<a href="${PHONE_HREF}" data-track="phone_click" data-track-pos="footer">${PHONE}</a>${CONFIG.phoneHours ? `（${CONFIG.phoneHours}）` : ''}</p>` : ''}
    </div>
    <nav aria-label="フッターメニュー"><ul class="site-footer__nav">${items}</ul></nav>
  </div>
  <div class="container site-footer__note">
    <p>本サイトは営業提案用のデモサイトです。運営者情報・連絡先・各種条件は、事業内容の確認を経て本番公開時に掲載します。</p>
    <p><small>&copy; 2026 ${SITE_NAME}</small></p>
  </div>
</footer>
<div class="mobile-cta${PHONE && slug !== 'partner' ? ' mobile-cta--two' : ''}">${mobile}</div>`;
}

// GA4 は測定IDが設定されている場合のみ読み込む（IDを自動生成しない）
const GA = CONFIG.ga4MeasurementId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${CONFIG.ga4MeasurementId}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${CONFIG.ga4MeasurementId}');</script>
` : '';
const RUNTIME_CONFIG = `<script>window.OSD_CONFIG=${JSON.stringify({ formEndpoint: CONFIG.formEndpoint || null, casePrefix: CONFIG.casePrefix || 'MAT' })};</script>`;

function layout(page, body) {
  const base = page.slug ? '../' : '';
  const canonical = SITE_URL + (page.slug ? page.slug + '/' : '');
  const html = body
    .replace(/\{\{ctaline(?::(\w+))?\}\}/g, (_, pos) => PARTIALS.ctaline.replace('{{pos}}', pos || 'inline').replace('{{ctaline_text}}', CTALINE_TEXT[pos] || '写真と簡単な内容だけで相談できます。'))
    .replace(/\{\{(cta|flow)\}\}/g, (_, k) => PARTIALS[k])
    .replace(/\{\{photo:([^}]+)\}\}/g, (_, spec) => photo(base, spec))
    .replace(/\{\{img:([^}]+)\}\}/g, (_, spec) => img(base, spec))
    .replace('{{credits}}', creditsHtml(base))
    .replaceAll('{{base}}', base)
    .replaceAll('{{cta_label}}', CTA_LABEL)
    .replaceAll('{{cta_sub}}', CTA_SUB_HTML)
    .replaceAll('{{phone_cta}}', PHONE ? `<a class="btn btn--line" href="${PHONE_HREF}" data-track="phone_click" data-track-pos="inline">電話で相談（${PHONE}）</a>` : '');
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title}</title>
<meta name="description" content="${page.description}">
${PRODUCTION ? '' : '<meta name="robots" content="noindex, nofollow">\n'}<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${page.title}">
<meta property="og:description" content="${page.description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE_URL}assets/og.png">
<meta property="og:locale" content="ja_JP">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#1e3d38">
${RUNTIME_CONFIG}
${GA}
<meta name="build" content="${BUILD_ID}">
<link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${base}assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Shippori+Mincho+B1:wght@500;600;700&display=swap">
<link rel="stylesheet" href="${base}assets/style.css">
<script src="${base}assets/main.js" defer></script>
</head>
<body class="page-${page.slug || 'home'}">
${header(base, page.slug)}
<main id="main">
${html}
</main>
${footer(base, page.slug)}
</body>
</html>
`;
}

// OGP 画像が現在の写真から作られているか確認（写真を差し替えたら node scripts/make-images.mjs を再実行）
if (sha1(join(SRC, 'assets', 'photos', `${OG.photo}-l.jpg`)) !== OG.source || sha1(join(SRC, 'assets', 'og.png')) !== OG.og) {
  throw new Error('og.png is stale: run `node scripts/make-images.mjs` after changing photos');
}

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(join(SRC, 'assets'), join(DIST, 'assets'), { recursive: true, filter: (p) => !/(photos|og)\.json$/.test(p) });

for (const page of pages) {
  const body = readFileSync(join(SRC, 'pages', page.file), 'utf8');
  const outDir = page.slug ? join(DIST, page.slug) : DIST;
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), layout(page, body));
}
for (const r of redirects) {
  mkdirSync(join(DIST, r.slug), { recursive: true });
  const to = `../${r.to}`;
  writeFileSync(join(DIST, r.slug, 'index.html'), `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<title>${SITE_NAME}</title><link rel="canonical" href="${SITE_URL}${r.to}">
<meta http-equiv="refresh" content="0; url=${to}">
<script>location.replace(${JSON.stringify(to)});</script>
</head><body><p>このページは移動しました。<a href="${to}">${SITE_NAME}のページへ</a></p></body></html>
`);
}

// 404（GitHub Pages はルート直下の 404.html を任意パスで返すため、サイトのベースパスからの絶対パスで参照）
const notFoundBody = readFileSync(join(SRC, 'pages', '404.html'), 'utf8');
const nf = layout({ slug: '', title: 'ページが見つかりません｜売却前おまかせデスク', description: 'お探しのページは見つかりませんでした。' }, notFoundBody)
  .replace(/(href|src)="(?!https?:|\/|#|mailto:|tel:)([^"]*)"/g, `$1="${BASE_PATH}$2"`)
  .replace(/href="#(?!main")([^"]+)"/g, `href="${BASE_PATH}#$1"`)
  .replaceAll(`${BASE_PATH}./`, BASE_PATH)
  .replace('<body class="page-home">', '<body class="page-404">')
  .replace('<meta name="robots" content="noindex, nofollow">\n', '')
  .replace('<head>', '<head>\n<meta name="robots" content="noindex">');
writeFileSync(join(DIST, '404.html'), nf);

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${SITE_URL}${p.slug ? p.slug + '/' : ''}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(DIST, 'robots.txt'), PRODUCTION
  ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`
  : `# 営業提案用デモのため、検索エンジンへの掲載を拒否しています（本番は PRODUCTION=1 でビルド）\nUser-agent: *\nDisallow: /\n`);
writeFileSync(join(DIST, '.nojekyll'), '');

console.log(`built ${pages.length} pages + 404 -> dist/ (${PRODUCTION ? 'production' : 'demo: noindex'})`);
