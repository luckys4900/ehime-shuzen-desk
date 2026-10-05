// 愛媛修繕デスク 静的サイトビルド
// src/pages/*.html（本文）に共通 header/footer を合成し dist/ へ出力する。
// GitHub Pages のサブパス配信に対応するため、全リンクは相対パスで生成する。
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');
const SITE_URL = 'https://luckys4900.github.io/ehime-shuzen-desk/';
const SITE_NAME = '愛媛修繕デスク';
const BUILD_ID = (process.env.GITHUB_SHA || 'local').slice(0, 12);

const pages = [
  { slug: '', file: 'index.html', title: '愛媛修繕デスク｜松山周辺の法人向け 建物修繕の相談窓口', description: '松山市・松前町・伊予市・東温市・砥部町の管理会社様、買取再販事業者様、店舗・施設運営者様向けの建物修繕相談窓口。写真を送るだけで、原状回復や小修繕のご相談を受け付けます。' },
  { slug: 'kanri', file: 'kanri.html', title: '管理会社様へ｜愛媛修繕デスク', description: '退去後の原状回復、入居中の小修繕など、賃貸管理の修繕手配を写真から相談できる第二の施工窓口。既存の施工会社との取引はそのままにご利用いただけます。' },
  { slug: 'kaitori', file: 'kaitori.html', title: '買取再販事業者様へ｜愛媛修繕デスク', description: '仕入れ後の内装補修、販売前のリフレッシュ工事など、買取再販物件の修繕を写真から相談できる窓口。工事範囲と見積内訳を確認しながら進めます。' },
  { slug: 'shop', file: 'shop.html', title: '店舗・施設運営者様へ｜愛媛修繕デスク', description: '店舗・事務所・施設の床や壁の補修、退店時の原状回復など。営業への影響を確認しながら、作業日時を含めてご相談いただけます。' },
  { slug: 'partner', file: 'partner.html', title: '協力施工会社の募集｜愛媛修繕デスク', description: '松山周辺で内装・原状回復・小修繕に対応いただける施工会社様、職人様を募集しています。資格が必要な工事は、有資格の方にのみご依頼します。' },
  { slug: 'contact', file: 'contact.html', title: '写真で相談する｜愛媛修繕デスク', description: '物件の所在地、修繕内容、写真をお送りください。内容を確認のうえ、担当者からご連絡します。' },
];

const CTA = readFileSync(join(SRC, 'partials', 'cta.html'), 'utf8');

const nav = [
  { slug: 'kanri', label: '管理会社様' },
  { slug: 'kaitori', label: '買取再販事業者様' },
  { slug: 'shop', label: '店舗・施設様' },
  { slug: 'partner', label: '協力会社募集' },
];

const logo = (base) => `<a class="logo" href="${base || './'}" aria-label="${SITE_NAME} トップページ">
  <svg class="logo__mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect x="1" y="1" width="38" height="38" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 20 L20 9 L32 20" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 18 V31 H28 V18" fill="none" stroke="currentColor" stroke-width="2.4"/><rect x="17.5" y="23" width="5" height="8" fill="var(--accent)"/></svg>
  <span class="logo__text"><span class="logo__name">愛媛修繕デスク</span><span class="logo__sub">EHIME SHUZEN DESK</span></span>
</a>`;

function header(base, current) {
  const items = nav.map((n) => `<li><a href="${base}${n.slug}/"${current === n.slug ? ' aria-current="page"' : ''}>${n.label}</a></li>`).join('');
  return `<a class="skip" href="#main">本文へスキップ</a>
<header class="site-header">
  <div class="site-header__inner">
    ${logo(base)}
    <nav class="gnav" id="gnav" aria-label="メインメニュー">
      <ul class="gnav__list">${items}<li class="gnav__flow"><a href="${base}#flow">ご相談の流れ</a></li></ul>
      <a class="btn btn--primary gnav__cta" href="${base}contact/">写真で相談する</a>
    </nav>
    <button class="menu-btn" type="button" aria-controls="gnav" aria-expanded="false"><span class="menu-btn__bars" aria-hidden="true"></span><span class="menu-btn__label">メニュー</span></button>
  </div>
</header>`;
}

function footer(base) {
  const items = [{ slug: '', label: 'トップページ' }, ...nav, { slug: 'contact', label: '写真で相談する' }]
    .map((n) => `<li><a href="${base}${n.slug ? n.slug + '/' : ''}">${n.label}</a></li>`).join('');
  return `<footer class="site-footer">
  <div class="container site-footer__inner">
    <div class="site-footer__brand">
      ${logo(base)}
      <p>松山周辺の法人・事業者様向け<br>建物修繕の相談窓口</p>
      <p class="site-footer__area">主な対応エリア：松山市・松前町・伊予市・東温市・砥部町<br>今治市は案件内容・工事規模により対応</p>
    </div>
    <nav aria-label="フッターメニュー"><ul class="site-footer__nav">${items}</ul></nav>
  </div>
  <div class="container site-footer__note">
    <p>本サイトは営業提案用のデモサイトです。運営者情報・連絡先・各種条件は、本番公開時に事業内容の確認を経て掲載します。</p>
    <p><small>&copy; 2026 愛媛修繕デスク</small></p>
  </div>
</footer>
<div class="mobile-cta" aria-hidden="false"><a class="btn btn--primary" href="${base}contact/">写真を送って相談する</a></div>`;
}

function layout(page, body) {
  const depth = page.slug ? 1 : 0;
  const base = depth ? '../' : '';
  const canonical = SITE_URL + (page.slug ? page.slug + '/' : '');
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title}</title>
<meta name="description" content="${page.description}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${page.title}">
<meta property="og:description" content="${page.description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE_URL}assets/og.png">
<meta property="og:locale" content="ja_JP">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#1f3a36">
<meta name="build" content="${BUILD_ID}">
<link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${base}assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Zen+Kaku+Gothic+New:wght@700;900&display=swap">
<link rel="stylesheet" href="${base}assets/style.css">
<script src="${base}assets/main.js" defer></script>
</head>
<body class="page-${page.slug || 'home'}">
${header(base, page.slug)}
<main id="main">
${body.replaceAll('{{cta}}', CTA).replaceAll('{{base}}', base)}
</main>
${footer(base)}
</body>
</html>
`;
}

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(join(SRC, 'assets'), join(DIST, 'assets'), { recursive: true });

for (const page of pages) {
  const body = readFileSync(join(SRC, 'pages', page.file), 'utf8');
  const outDir = page.slug ? join(DIST, page.slug) : DIST;
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), layout(page, body));
}

// 404（GitHub Pages はルート直下の 404.html を任意パスで返すため、絶対パスで参照）
const notFoundBody = readFileSync(join(SRC, 'pages', '404.html'), 'utf8');
const nf = layout({ slug: '', title: 'ページが見つかりません｜愛媛修繕デスク', description: 'お探しのページは見つかりませんでした。' }, notFoundBody)
  .replaceAll('href="assets/', 'href="/ehime-shuzen-desk/assets/')
  .replaceAll('src="assets/', 'src="/ehime-shuzen-desk/assets/')
  .replace(/href="(?!https?:|\/|#|mailto:)([^"]*)"/g, 'href="/ehime-shuzen-desk/$1"')
  .replace('<head>', '<head>\n<meta name="robots" content="noindex">');
writeFileSync(join(DIST, '404.html'), nf);

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${SITE_URL}${p.slug ? p.slug + '/' : ''}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`);
writeFileSync(join(DIST, '.nojekyll'), '');

console.log(`built ${pages.length} pages + 404 -> dist/`);
