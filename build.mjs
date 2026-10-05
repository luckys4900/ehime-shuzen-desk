// 愛媛修繕デスク 静的サイトビルド
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
const DIST = join(ROOT, 'dist');
const SITE_URL = 'https://luckys4900.github.io/ehime-shuzen-desk/';
const BASE_PATH = new URL(SITE_URL).pathname;
const SITE_NAME = '愛媛修繕デスク';
const BUILD_ID = (process.env.GITHUB_SHA || 'local').slice(0, 12);
const PRODUCTION = process.env.PRODUCTION === '1';
const CTA_LABEL = '写真を送って相談する';

const pages = [
  { slug: '', file: 'index.html', title: '愛媛修繕デスク｜松山周辺の法人向け 建物修繕の相談窓口', description: '松山市・松前町・伊予市・東温市・砥部町の管理会社様、買取再販事業者様、店舗・施設運営者様向けの建物修繕の相談窓口。写真と物件情報から、原状回復や小修繕のご相談を受け付けます。' },
  { slug: 'kanri', file: 'kanri.html', title: '管理会社様へ｜愛媛修繕デスク', description: '退去後の原状回復、入居中の小修繕など、賃貸管理の修繕手配を写真から相談できる、もう一つの修繕窓口。いつもの施工会社との取引はそのままにご利用いただけます。' },
  { slug: 'kaitori', file: 'kaitori.html', title: '買取再販事業者様へ｜愛媛修繕デスク', description: '仕入れ後の内装補修や販売前の手直しなど、買取再販物件の修繕を写真から相談できる窓口。工事範囲ごとに内訳の分かる見積をご案内します。' },
  { slug: 'shop', file: 'shop.html', title: '店舗・施設運営者様へ｜愛媛修繕デスク', description: '店舗・事務所・施設の床や壁の補修、退店時の原状回復など。営業への影響を確認しながら、作業日時を含めてご相談いただけます。' },
  { slug: 'partner', file: 'partner.html', title: '協力施工会社の募集｜愛媛修繕デスク', description: '松山周辺で内装・原状回復・小修繕に対応いただける施工会社様、職人様を募集しています。資格が必要な工事は、有資格の方にのみご依頼します。' },
  { slug: 'contact', file: 'contact.html', title: '写真を送って相談する｜愛媛修繕デスク', description: '物件の所在地、修繕内容、写真をお送りください。内容を確認のうえ、担当者からメールまたはお電話でご連絡します。' },
  { slug: 'credits', file: 'credits.html', title: '写真クレジット｜愛媛修繕デスク', description: '愛媛修繕デスクのサイトで使用している写真の出典とライセンス。' },
  { slug: 'privacy', file: 'privacy.html', title: '個人情報の取扱い｜愛媛修繕デスク', description: '愛媛修繕デスクにおける、ご相談フォーム等でお預かりする個人情報・写真の取扱いについて。' },
];

const partial = (name) => readFileSync(join(SRC, 'partials', name), 'utf8');
const PARTIALS = { cta: partial('cta.html'), flow: partial('flow.html') };
const OG = JSON.parse(readFileSync(join(SRC, 'assets', 'og.json'), 'utf8'));
const PHOTOS = existsSync(join(SRC, 'assets', 'photos', 'photos.json')) ? JSON.parse(readFileSync(join(SRC, 'assets', 'photos', 'photos.json'), 'utf8')) : {};

const nav = [
  { slug: 'kanri', label: '管理会社様' },
  { slug: 'kaitori', label: '買取再販事業者様' },
  { slug: 'shop', label: '店舗・施設運営者様' },
  { slug: 'partner', label: '協力会社募集' },
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
const PAGE_LABEL = { 'index.html': 'トップページ', 'kanri.html': '管理会社様ページ', 'kaitori.html': '買取再販事業者様ページ', 'shop.html': '店舗・施設運営者様ページ', 'partner.html': '協力会社募集ページ', 'cta.html': '各ページ末尾のご相談案内（背景）' };
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
  return `<ul class="credits">${rows}</ul><p class="credits-note">いずれの写真も、本サイトの表示に合わせて縦横比 4:3 にトリミングし、縮小・圧縮しています（改変あり）。愛媛修繕デスクの施工事例ではありません。</p>`;
}

const logo = (base) => `<a class="logo" href="${base || './'}" aria-label="${SITE_NAME} トップページ">
  <svg class="logo__mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect x="1" y="1" width="38" height="38" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 20 L20 9 L32 20" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 18 V31 H28 V18" fill="none" stroke="currentColor" stroke-width="2"/><rect x="17.5" y="23" width="5" height="8" fill="#c8662f"/></svg>
  <span class="logo__text"><span class="logo__name">愛媛修繕デスク</span><span class="logo__sub">EHIME SHUZEN DESK</span></span>
</a>`;

function header(base, current) {
  const items = nav.map((n) => `<li><a href="${base}${n.slug}/"${current === n.slug ? ' aria-current="page"' : ''}>${n.label}</a></li>`).join('');
  return `<a class="skip" href="#main">本文へスキップ</a>
<header class="site-header">
  <div class="site-header__inner">
    ${logo(base)}
    <nav class="gnav" id="gnav" aria-label="メインメニュー">
      <ul class="gnav__list">${items}<li><a href="${base}#flow">ご相談の流れ</a></li></ul>
      <a class="btn btn--primary gnav__cta" href="${base}contact/">${CTA_LABEL}</a>
    </nav>
    <button class="menu-btn" type="button" aria-controls="gnav" aria-expanded="false"><span class="menu-btn__bars" aria-hidden="true"></span><span class="menu-btn__label">メニュー</span></button>
  </div>
</header>`;
}

function footer(base, slug) {
  const items = [{ slug: '', label: 'トップページ' }, ...nav, { slug: 'contact', label: CTA_LABEL }, { slug: 'privacy', label: '個人情報の取扱い' }, { slug: 'credits', label: '写真クレジット' }]
    .map((n) => `<li><a href="${base}${n.slug ? n.slug + '/' : ''}">${n.label}</a></li>`).join('');
  const mobile = slug === 'partner'
    ? `<a class="btn btn--primary" href="#entry">協力会社として登録を相談する</a>`
    : `<a class="btn btn--primary" href="${base}contact/">${CTA_LABEL}</a>`;
  return `<footer class="site-footer">
  <div class="container site-footer__inner">
    <div class="site-footer__brand">
      ${logo(base)}
      <p>松山周辺の法人・事業者様向け<br>建物修繕の相談窓口</p>
      <p class="site-footer__area">主な対応エリア：<span class="nw">松山市</span>・<span class="nw">松前町</span>・<span class="nw">伊予市</span>・<span class="nw">東温市</span>・<span class="nw">砥部町</span><br><span class="nw">今治市</span>は案件内容・工事規模により対応</p>
    </div>
    <nav aria-label="フッターメニュー"><ul class="site-footer__nav">${items}</ul></nav>
  </div>
  <div class="container site-footer__note">
    <p>本サイトは営業提案用のデモサイトです。運営者情報・連絡先・各種条件は、事業内容の確認を経て本番公開時に掲載します。</p>
    <p><small>&copy; 2026 愛媛修繕デスク</small></p>
  </div>
</footer>
<div class="mobile-cta">${mobile}</div>`;
}

function layout(page, body) {
  const base = page.slug ? '../' : '';
  const canonical = SITE_URL + (page.slug ? page.slug + '/' : '');
  const html = body
    .replace(/\{\{(cta|flow)\}\}/g, (_, k) => PARTIALS[k])
    .replace(/\{\{photo:([^}]+)\}\}/g, (_, spec) => photo(base, spec))
    .replace(/\{\{img:([^}]+)\}\}/g, (_, spec) => img(base, spec))
    .replace('{{credits}}', creditsHtml(base))
    .replaceAll('{{base}}', base)
    .replaceAll('{{cta_label}}', CTA_LABEL);
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

// 404（GitHub Pages はルート直下の 404.html を任意パスで返すため、サイトのベースパスからの絶対パスで参照）
const notFoundBody = readFileSync(join(SRC, 'pages', '404.html'), 'utf8');
const nf = layout({ slug: '', title: 'ページが見つかりません｜愛媛修繕デスク', description: 'お探しのページは見つかりませんでした。' }, notFoundBody)
  .replace(/(href|src)="(?!https?:|\/|#|mailto:|tel:)([^"]*)"/g, `$1="${BASE_PATH}$2"`)
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
