// 愛媛修繕デスク／売却前おまかせデスク 静的サイトビルド
// 営業目的の異なる2つのサービスサイトを、共通の部品（ヘッダー・フッター・フォーム・計測・写真）から生成する。
//   /repair/        愛媛修繕デスク（法人向け 建物修繕の第二施工店）       src/sites/repair/
//   /sale-support/  売却前おまかせデスク（不動産会社向け 売却前の手配窓口） src/sites/sale/
//   /               2つの窓口への分岐ページと共通ページ（協力事業者・個人情報・写真クレジット） src/pages/
// GitHub Pages のサブパス配信に対応するため、全リンクは相対パスで生成する。
// 本番公開時は PRODUCTION=1 でビルドすると、検索エンジン向けの noindex を外す。
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
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
const CONFIG = Object.assign(JSON.parse(readFileSync(join(ROOT, 'site.config.json'), 'utf8')), process.env.SITE_CONFIG_OVERRIDE ? JSON.parse(process.env.SITE_CONFIG_OVERRIDE) : {});
const BUILD_ID = (process.env.GITHUB_SHA || 'local').slice(0, 12);
const PRODUCTION = process.env.PRODUCTION === '1';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// 運営者情報：設定されている項目だけを表示する（未設定の項目を架空の値で埋めない）
const OP = Object.fromEntries(Object.entries(CONFIG.operator || {}).filter(([k, v]) => !k.startsWith('_') && v !== null && String(v).trim() !== '').map(([k, v]) => [k, String(v).trim()]));
const PHONE = OP.phone || '';
const PHONE_HREF = PHONE ? 'tel:' + PHONE.replace(/[^\d+]/g, '') : '';

// 区切りの位置でだけ改行させる
const subHtml = (t) => t.split(' ｜ ').map((x) => `<span class="nw">${x}</span>`).join('<span class="sub-sep"> ｜ </span>');

/* ---------- 2つのサービス（表側の文言・色・導線はここで分ける） ---------- */
const SITES = {
  repair: {
    dir: 'repair', slug: 'repair', name: '愛媛修繕デスク', sub: 'EHIME SHUZEN DESK', subJa: false,
    theme: 'theme-repair', siteType: 'repair', businessLine: 'repair_desk', themeColor: '#17283f', og: 'og-repair.png',
    cta: '今ある1件を見積相談', sticky: '今ある1件を見積相談', stickyShort: '1件を見積相談',
    ctaSub: '法人・事業者様専用 ｜ いつもの施工会社との併用OK ｜ 松山市・近郊',
    ctaline: { concept: '普段の工事はそのままで。手が回らない案件だけ、ご相談ください。', services: '写真と物件情報から、対応できる施工パートナーを確認します。', flow: '写真と物件情報だけで、ご相談いただけます。' },
    nav: [{ href: 'kanri/', label: '管理会社様' }, { href: 'kaitori/', label: '買取再販事業者様' }, { href: 'shop/', label: '店舗・施設運営者様' }, { href: '#flow', label: 'ご相談の流れ' }],
    footerText: '松山周辺の法人・事業者様向け<br>建物修繕の相談窓口',
    step1: '修繕内容', step2: '写真・物件情報', partnerWord: '施工パートナー', workWord: '施工',
    cta2: '写真で対応可否を確認',
    photoHint: '修繕箇所に近づいた写真と、部屋や場所の全体が分かる写真があると判断しやすくなります。',
    services: '工事内容を1つ以上選んでください。',
  },
  sale: {
    dir: 'sale', slug: 'sale-support', name: '売却前おまかせデスク', sub: '不動産会社向け 売却前の現地対応窓口', subJa: true,
    theme: 'theme-sale', siteType: 'sale_support', businessLine: 'sale_support', themeColor: '#1e3d38', og: 'og-sale.png',
    cta: '今ある1件を見積相談', sticky: '今ある1件を見積相談', stickyShort: '1件を見積相談',
    ctaSub: '不動産会社様向け ｜ 1案件から ｜ 既存業者との併用OK',
    ctaline: { keep: 'いつもの業者はそのままで。まず1物件、見積をご相談ください。', services: '物件の所在地・写真・希望時期だけで、相談を始められます。', deliverables: '書類の形式は、ご依頼前のご相談でも確認いただけます。' },
    nav: [{ href: '#services', label: '担当範囲' }, { href: '#flow', label: 'ご相談後の流れ' }, { href: '#deliverables', label: 'お渡しする書類' }, { href: '#faq', label: 'よくある質問' }],
    footerText: '不動産会社様向け<br>売却前の現地対応・物件整備窓口',
    // ヒーロー直下の取引方針（site.config.json の salePolicies で true のものだけ表示）
    policies: [['oneJob', '1案件から'], ['freeConsultation', '相談無料'], ['competitiveQuotesWelcome', '相見積歓迎'], ['existingVendorsOk', '既存業者との併用OK'], ['noRetainer', '顧問契約不要']],
    step1: '物件と作業', step2: '写真・物件情報', partnerWord: '協力事業者', workWord: '作業',
    cta2: '写真で対応可否を確認',
    photoHint: '全体が分かる写真と、気になる箇所の写真があると整理しやすくなります。',
    services: '必要な作業を1つ以上選んでください（決まっていなければ「内容から相談したい」）。',
  },
  // 分岐ページと共通ページ（協力事業者の募集・個人情報・写真クレジット）
  hub: {
    dir: null, slug: '', name: '愛媛修繕デスク・売却前おまかせデスク', sub: '松山周辺の事業者様向け 相談窓口', subJa: true,
    theme: 'theme-hub', siteType: 'hub', businessLine: '', themeColor: '#1e3d38', og: 'og.png',
    nav: [{ href: 'repair/', label: '愛媛修繕デスク', root: true }, { href: 'sale-support/', label: '売却前おまかせデスク', root: true }],
    footerText: '松山周辺の法人・事業者様、不動産会社様向けの相談窓口',
  },
};

const pages = [
  { site: 'hub', slug: '', file: 'pages/hub.html', title: '愛媛の不動産・建物事業者向け 2つの相談窓口｜愛媛修繕デスク・売却前おまかせデスク', description: '建物修繕の第二施工店「愛媛修繕デスク」と、不動産会社向けの売却前の手配窓口「売却前おまかせデスク」のご案内です。' },
  { site: 'repair', slug: 'repair', home: true, file: 'sites/repair/pages/index.html', label: '愛媛修繕デスク トップ', title: '愛媛修繕デスク｜松山周辺の法人向け 建物修繕の相談窓口', description: '松山市・松前町・伊予市・東温市・砥部町の管理会社様、買取再販事業者様、店舗・施設運営者様向けの建物修繕の相談窓口。いつもの施工会社が手いっぱいの時に、写真と物件情報から修繕のご相談を受け付けます。' },
  { site: 'repair', slug: 'repair/kanri', file: 'sites/repair/pages/kanri.html', label: '愛媛修繕デスク 管理会社様', title: '管理会社様へ｜愛媛修繕デスク', description: '退去後の原状回復、入居中の小修繕など、賃貸管理の修繕手配を写真から相談できる、もう一つの修繕窓口。いつもの施工会社との取引はそのままにご利用いただけます。' },
  { site: 'repair', slug: 'repair/kaitori', file: 'sites/repair/pages/kaitori.html', label: '愛媛修繕デスク 買取再販事業者様', title: '買取再販事業者様へ｜愛媛修繕デスク', description: '仕入れ後の内装補修や販売前の手直しなど、買取再販物件の修繕を写真から相談できる窓口。工事範囲ごとに内訳の分かる見積をご案内します。' },
  { site: 'repair', slug: 'repair/shop', file: 'sites/repair/pages/shop.html', label: '愛媛修繕デスク 店舗・施設運営者様', title: '店舗・施設運営者様へ｜愛媛修繕デスク', description: '店舗・事務所・施設の床や壁の補修、退店時の原状回復など。営業への影響を確認しながら、作業日時を含めてご相談いただけます。' },
  { site: 'sale', slug: 'sale-support', home: true, file: 'sites/sale/pages/index.html', label: '売却前おまかせデスク トップ', title: '不動産会社向け｜売却前の現地対応・物件整備窓口｜売却前おまかせデスク（松山）', description: '松山周辺の不動産会社様向け、売却前の現地対応・物件整備の外部窓口。現地確認・必要作業の整理・見積・協力事業者の手配・完了確認・写真報告までを当デスクが窓口となって進めます。1案件から、いつもの業者はそのままでご相談いただけます。' },
  { site: 'hub', slug: 'partner', file: 'pages/partner.html', label: '協力事業者の募集', title: '協力事業者の募集｜愛媛修繕デスク・売却前おまかせデスク', description: '松山市・近郊で、建物の修繕や、売却前の残置物整理・清掃・草刈りなどに対応いただける事業者様を募集しています。許可や資格が必要な業務は、該当する許可・資格をお持ちの方にのみご依頼します。' },
  { site: 'hub', slug: 'credits', file: 'pages/credits.html', label: '写真クレジット', title: '写真クレジット｜愛媛修繕デスク・売却前おまかせデスク', description: '愛媛修繕デスク・売却前おまかせデスクのサイトで使用している写真の出典とライセンス。' },
  { site: 'hub', slug: 'privacy', file: 'pages/privacy.html', label: '個人情報の取扱い', title: '個人情報の取扱い｜愛媛修繕デスク・売却前おまかせデスク', description: '愛媛修繕デスク・売却前おまかせデスクの相談フォーム等でお預かりする個人情報・写真の取扱いについて。' },
];
// 旧URL：前バージョンの業種別ページ・問い合わせページは愛媛修繕デスクへ転送する（リンク切れを防ぐ）
// 旧トップのページ内リンク（#form など）は、分岐ページで売却前おまかせデスクへ転送する（src/pages/hub.html）
const redirects = [
  { slug: 'kanri', to: 'repair/kanri/' },
  { slug: 'kaitori', to: 'repair/kaitori/' },
  { slug: 'shop', to: 'repair/shop/' },
  { slug: 'contact', to: 'repair/#form', keepType: true },
];

const read = (p) => readFileSync(join(SRC, p), 'utf8');
const partial = (site, name) => {
  const own = site.dir && join(SRC, 'sites', site.dir, 'partials', name);
  return own && existsSync(own) ? readFileSync(own, 'utf8') : read(join('partials', name));
};
const OG = JSON.parse(read('assets/og.json'));
const PHOTOS = existsSync(join(SRC, 'assets', 'photos', 'photos.json')) ? JSON.parse(read('assets/photos/photos.json')) : {};

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

/* ---------- 写真クレジット（実際に使っている写真だけを、使用箇所つきで掲載） ---------- */
function photoUsage() {
  const used = {};
  const add = (src, label) => { for (const m of src.matchAll(/\{\{(?:photo|img):(\w+)/g)) (used[m[1]] ||= new Set()).add(label); };
  for (const p of pages) add(read(p.file), p.label || 'トップページ');
  for (const key of ['repair', 'sale']) add(partial(SITES[key], 'cta.html'), `${SITES[key].name} 末尾のご相談案内（背景）`);
  return used;
}
function creditsHtml(base) {
  const used = photoUsage();
  const ogs = Object.values(OG);
  const rows = Object.entries(PHOTOS).filter(([name]) => used[name] || ogs.some((o) => o.photo === name)).map(([name, p]) => {
    const isPexels = p.source === 'pexels';
    const id = isPexels ? (p.page.match(/photo\/(\d+)/) || [])[1] : '';
    const where = [...(used[name] || [])];
    if (ogs.some((o) => o.photo === name)) where.push('SNS共有用画像（OGP）');
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
  return `<ul class="credits">${rows}</ul><p class="credits-note">いずれの写真も、本サイトの表示に合わせて縦横比 4:3 にトリミングし、縮小・圧縮しています（改変あり）。愛媛修繕デスク・売却前おまかせデスクの施工・作業事例ではありません。</p>`;
}

/* ---------- 共通部品：ロゴ・ヘッダー・フッター ---------- */
const logo = (site, href) => `<a class="logo${site.siteType === 'hub' ? ' logo--hub' : ''}" href="${href || './'}" aria-label="${site.name} トップページ">
  <svg class="logo__mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect x="1" y="1" width="38" height="38" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 20 L20 9 L32 20" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 18 V31 H28 V18" fill="none" stroke="currentColor" stroke-width="2"/><rect x="17.5" y="23" width="5" height="8" class="logo__door"/></svg>
  <span class="logo__text"><span class="logo__name">${site.name}</span><span class="logo__sub${site.subJa ? '' : ' logo__sub--en'}">${site.sub}</span></span>
</a>`;

const phoneLink = (cls, track) => PHONE ? `<a class="${cls}" href="${PHONE_HREF}" data-track="phone_click" data-track-pos="${track}">電話で相談</a>` : '';

function header(site, root, siteBase) {
  const items = site.nav.map((n) => `<li><a href="${n.root ? root : siteBase}${n.href}">${n.label}</a></li>`).join('');
  const cta = site.cta ? `${phoneLink('gnav__tel', 'header')}
      <a class="btn btn--primary gnav__cta" href="${siteBase}#form" data-intent="quote" data-track="cta_click" data-track-pos="header">${site.cta}</a>` : '';
  return `<a class="skip" href="#main">本文へスキップ</a>
<header class="site-header">
  <div class="site-header__inner">
    ${logo(site, siteBase || './')}
    <nav class="gnav" id="gnav" aria-label="メインメニュー">
      <ul class="gnav__list">${items}</ul>
      ${cta}
    </nav>
    <button class="menu-btn" type="button" aria-controls="gnav" aria-expanded="false"><span class="menu-btn__bars" aria-hidden="true"></span><span class="menu-btn__label">メニュー</span></button>
  </div>
</header>`;
}

function operatorHtml() {
  if (!Object.keys(OP).length) return '';
  const rows = [
    OP.name && `<dt>運営</dt><dd>${esc(OP.name)}</dd>`,
    OP.address && `<dt>所在地</dt><dd>${esc(OP.address)}</dd>`,
    OP.phone && `<dt>電話</dt><dd><a href="${PHONE_HREF}" data-track="phone_click" data-track-pos="footer">${esc(OP.phone)}</a>${OP.phoneHours ? `（${esc(OP.phoneHours)}）` : ''}</dd>`,
    OP.email && `<dt>メール</dt><dd><a href="mailto:${esc(OP.email)}" data-track="mail_click" data-track-pos="footer">${esc(OP.email)}</a></dd>`,
    OP.invoiceNumber && `<dt>適格請求書発行事業者</dt><dd>登録番号 ${esc(OP.invoiceNumber)}</dd>`,
  ].filter(Boolean).join('');
  return rows ? `<dl class="site-footer__op">${rows}</dl>` : '';
}

function footer(site, root, siteBase, page) {
  const isPartner = page.slug === 'partner';
  const items = (site.siteType === 'hub'
    ? [{ href: 'repair/', label: '愛媛修繕デスク' }, { href: 'sale-support/', label: '売却前おまかせデスク' }, { href: 'partner/', label: '協力事業者の募集' }, { href: 'privacy/', label: '個人情報の取扱い' }, { href: 'credits/', label: '写真クレジット' }].map((n) => ({ ...n, href: root + n.href }))
    : [{ href: siteBase, label: 'トップページ' }, ...(site.siteType === 'repair' ? site.nav.slice(0, 3).map((n) => ({ href: siteBase + n.href, label: n.label })) : []), { href: siteBase + '#form', label: '案件相談フォーム' }, { href: root + 'partner/', label: '協力事業者の募集' }, { href: root + 'privacy/', label: '個人情報の取扱い' }, { href: root + 'credits/', label: '写真クレジット' }])
    .map((n) => `<li><a href="${n.href || './'}">${n.label}</a></li>`).join('');
  let mobile = '';
  if (isPartner) mobile = `<a class="btn btn--primary" href="#entry">協力事業者として登録を相談する</a>`;
  else if (site.cta) mobile = `${PHONE ? `<a class="btn btn--tel" href="${PHONE_HREF}" data-track="phone_click" data-track-pos="sticky">電話で相談</a>` : ''}<a class="btn btn--primary" href="${siteBase}#form" data-intent="quote" data-track="sticky_cta_click">${PHONE ? site.stickyShort : site.sticky}</a>`;
  return `<footer class="site-footer">
  <div class="container site-footer__inner">
    <div class="site-footer__brand">
      ${logo(site, siteBase || './')}
      <p>${site.footerText}</p>
      <p class="site-footer__area">対応エリア：<span class="nw">松山市</span>・<span class="nw">松前町</span>・<span class="nw">伊予市</span>・<span class="nw">東温市</span>・<span class="nw">砥部町</span>ほか近郊（案件によりご相談）</p>
      ${site.cta && !isPartner ? `<div class="site-footer__cta"><a class="btn btn--primary" href="${siteBase}#form" data-intent="quote" data-track="cta_click" data-track-pos="footer">${site.cta}</a><p>${subHtml(site.ctaSub)}</p></div>` : ''}
      ${operatorHtml()}
    </div>
    <nav aria-label="フッターメニュー"><ul class="site-footer__nav">${items}</ul></nav>
  </div>
  <div class="container site-footer__note">
    <p>${OP.name ? '' : '本サイトは営業提案用のデモサイトです。運営者情報・連絡先・各種条件は、事業内容の確認を経て本番公開時に掲載します。'}</p>
    <p><small>&copy; 2026 ${OP.name ? esc(OP.name) : site.name}</small></p>
  </div>
</footer>
${mobile ? `<div class="mobile-cta${PHONE && !isPartner ? ' mobile-cta--two' : ''}">${mobile}</div>` : ''}`;
}

/* ---------- 取引方針・連絡方法・会社情報（設定された項目だけを表示） ---------- */
const POLICIES = CONFIG.salePolicies || {};
function policyChips(site) {
  const on = (site.policies || []).filter(([k]) => POLICIES[k] === true);
  return on.length ? `<ul class="policy-chips" aria-label="ご利用の条件">${on.map(([, label]) => `<li>${label}</li>`).join('')}</ul>` : '';
}
function contactMethods(site) {
  const items = [`<li><span class="cm__k">フォーム</span><a href="#form" data-track="cta_click" data-track-pos="methods">このページの相談フォーム</a><small>写真を添付できます</small></li>`];
  if (OP.phone) items.push(`<li><span class="cm__k">電話</span><a href="${PHONE_HREF}" data-track="phone_click" data-track-pos="methods">${esc(OP.phone)}</a>${OP.phoneHours ? `<small>${esc(OP.phoneHours)}</small>` : ''}</li>`);
  if (OP.email) items.push(`<li><span class="cm__k">メール</span><a href="mailto:${esc(OP.email)}" data-track="mail_click" data-track-pos="methods">${esc(OP.email)}</a><small>写真の添付も可能です</small></li>`);
  return `<ul class="contact-methods">${items.join('')}</ul>`;
}
// 法人のご担当者が確認したい運用情報（site.config.json の operations。確定した項目だけを表示）
const OPS = Object.fromEntries(Object.entries(CONFIG.operations || {}).filter(([k, v]) => !k.startsWith('_') && v !== null && String(v).trim() !== ''));
const OPS_LABELS = { siteSurvey: '現地調査の方法', quoteMethod: '見積の方法', changeOrderRule: '追加作業の承認ルール', paymentTerms: '支払条件', keyHandling: '鍵の受け渡し・入室', reportFormat: '報告の方法' };
function opsRows() {
  return Object.entries(OPS_LABELS).filter(([k]) => OPS[k]).map(([k, label]) => `<tr><th scope="row">${label}</th><td>${esc(OPS[k])}</td></tr>`).join('');
}
function companyInfo() {
  const rows = [
    OP.name && ['運営者', esc(OP.name)], OP.address && ['所在地', esc(OP.address)],
    OP.phone && ['電話', `${esc(OP.phone)}${OP.phoneHours ? `（${esc(OP.phoneHours)}）` : ''}`], OP.email && ['メール', esc(OP.email)],
    OP.invoiceNumber && ['適格請求書発行事業者', `登録番号 ${esc(OP.invoiceNumber)}`], OP.insurance && ['保険', esc(OP.insurance)],
    OP.licensePolicy && ['許可・資格の確認', esc(OP.licensePolicy)],
  ].filter(Boolean);
  // 未設定の間も欄は表示し、何を正式公開時に掲載するかを明示する（ダミーの値は置かない）
  if (!rows.length) return `<div class="company-info"><h3>会社・取引情報</h3><p class="company-info__pending">運営者名・所在地・電話番号・メールアドレス・受付時間・適格請求書発行事業者の登録番号・加入保険は、正式公開時にこの欄に掲載します。現在は営業提案用のデモサイトです。</p></div>`;
  return `<div class="company-info"><h3>会社・取引情報</h3><table class="terms-table"><tbody>${rows.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('')}</tbody></table></div>`;
}

/* ---------- 案件相談フォーム：共通のエンジンと枠に、サービスごとの質問を差し込む ---------- */
function caseForm(site) {
  return partial(site, 'case-form.html')
    .replaceAll('{{step1_label}}', site.step1)
    .replaceAll('{{step2_label}}', site.step2)
    .replace('{{form_step1}}', partial(site, 'form-step1.html'))
    .replace('{{form_step2}}', partial(site, 'form-step2.html'))
    .replace('{{form_step3}}', existsSync(join(SRC, 'sites', site.dir, 'partials', 'form-step3.html')) ? partial(site, 'form-step3.html') : '')
    .replaceAll('{{photo_hint}}', site.photoHint)
    .replaceAll('{{services_msg}}', site.services);
}

// GA4 は測定IDが設定されている場合のみ読み込む（IDを自動生成しない）
const GA = CONFIG.ga4MeasurementId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${CONFIG.ga4MeasurementId}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${CONFIG.ga4MeasurementId}');</script>
` : '';
const RUNTIME_CONFIG = `<script>window.OSD_CONFIG=${JSON.stringify({ formEndpoint: CONFIG.formEndpoint || null, casePrefix: CONFIG.casePrefix || 'MAT' })};</script>`;

function layout(page, body) {
  const site = SITES[page.site];
  const depth = page.slug ? page.slug.split('/').length : 0;
  const root = '../'.repeat(depth);
  const siteDepth = site.slug ? site.slug.split('/').length : 0;
  const siteBase = '../'.repeat(depth - siteDepth);
  const canonical = SITE_URL + (page.slug ? page.slug + '/' : '');
  let html = body
    .replace('{{case_form}}', () => caseForm(site))
    .replace(/\{\{ctaline(?::(\w+))?\}\}/g, (_, pos) => partial(site, 'ctaline.html').replace('{{pos}}', pos || 'inline').replace('{{ctaline_text}}', (site.ctaline || {})[pos] || '写真と簡単な内容だけで相談できます。'))
    .replace(/\{\{(cta|flow)\}\}/g, (_, k) => partial(site, k + '.html'))
    .replaceAll('{{ladder}}', () => partial(site, 'ladder.html').replaceAll('{{p_partner}}', site.partnerWord).replaceAll('{{p_work}}', site.workWord));
  html = html
    .replace(/\{\{photo:([^}]+)\}\}/g, (_, spec) => photo(root, spec))
    .replace(/\{\{img:([^}]+)\}\}/g, (_, spec) => img(root, spec))
    .replace('{{credits}}', () => creditsHtml(root))
    .replaceAll('{{base}}', root)
    .replaceAll('{{site}}', siteBase || './')
    .replaceAll('{{cta_label}}', site.cta || '')
    .replaceAll('{{cta2_label}}', site.cta2 || '')
    .replaceAll('{{cta_sub}}', subHtml(site.heroSub || site.ctaSub || ''))
    .replaceAll('{{cta_sub2}}', subHtml(site.ctaSub || ''))
    .replaceAll('{{operator_name}}', OP.name ? esc(OP.name) : '本サイトの運営者')
    .replace('{{policy_chips}}', () => policyChips(site))
    .replace('{{contact_methods}}', () => contactMethods(site))
    .replace('{{company_info}}', () => companyInfo())
    .replace('{{ops_rows}}', () => opsRows())
    .replaceAll('{{phone_cta}}', PHONE ? `<a class="btn btn--line" href="${PHONE_HREF}" data-track="phone_click" data-track-pos="inline">電話で相談（${esc(PHONE)}）</a>` : '');
  const bodyClass = [page.home ? 'page-home' : `page-${(page.slug.split('/').pop()) || 'hub'}`, site.theme].join(' ');
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title}</title>
<meta name="description" content="${page.description}">
${PRODUCTION ? '' : '<meta name="robots" content="noindex, nofollow">\n'}<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${page.title}">
<meta property="og:description" content="${page.description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE_URL}assets/${site.og}">
<meta property="og:locale" content="ja_JP">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="${site.themeColor}">
${RUNTIME_CONFIG}
${GA}
<meta name="build" content="${BUILD_ID}">
<link rel="icon" href="${root}assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${root}assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Shippori+Mincho+B1:wght@500;600;700&display=swap">
<link rel="stylesheet" href="${root}assets/style.css">
<script src="${root}assets/main.js" defer></script>
</head>
<body class="${bodyClass}" data-site-type="${site.siteType}"${site.businessLine ? ` data-business-line="${site.businessLine}"` : ''}>
${header(site, root, siteBase)}
<main id="main">
${html}
</main>
${footer(site, root, siteBase, page)}
</body>
</html>
`;
}

// OGP 画像が現在の写真から作られているか確認（写真を差し替えたら node scripts/make-images.mjs を再実行）
for (const [file, o] of Object.entries(OG)) {
  if (sha1(join(SRC, 'assets', 'photos', `${o.photo}-l.jpg`)) !== o.source || sha1(join(SRC, 'assets', file)) !== o.og) {
    throw new Error(`${file} is stale: run \`node scripts/make-images.mjs\` after changing photos or OGP text`);
  }
}

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(join(SRC, 'assets'), join(DIST, 'assets'), { recursive: true, filter: (p) => !/(photos|og)\.json$/.test(p) });

for (const page of pages) {
  const outDir = page.slug ? join(DIST, page.slug) : DIST;
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), layout(page, read(page.file)));
}
for (const r of redirects) {
  mkdirSync(join(DIST, r.slug), { recursive: true });
  const to = `../${r.to}`;
  // 旧問い合わせページの ?type=kanri 等は、愛媛修繕デスクのフォームの業種の初期選択（?seg=）に引き継ぐ
  const js = r.keepType
    ? `var q=new URLSearchParams(location.search),t=q.get('type');q.delete('type');if(t)q.set('seg',t);var s=q.toString();location.replace(${JSON.stringify(to)}.replace('#form','')+(s?'?'+s:'')+(location.hash||'#form'));`
    : `location.replace(${JSON.stringify(to)}+location.search+location.hash);`;
  writeFileSync(join(DIST, r.slug, 'index.html'), `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<title>このページは移動しました</title><link rel="canonical" href="${SITE_URL}${r.to}">
<script>${js}</script>
<noscript><meta http-equiv="refresh" content="0; url=${to}"></noscript>
</head><body><p>このページは移動しました。<a href="${to}">移動先のページへ</a></p></body></html>
`);
}

// 404（GitHub Pages はルート直下の 404.html を任意パスで返すため、サイトのベースパスからの絶対パスで参照）
const nf = layout({ site: 'hub', slug: '', title: 'ページが見つかりません｜愛媛修繕デスク・売却前おまかせデスク', description: 'お探しのページは見つかりませんでした。' }, read('pages/404.html'))
  .replace(/(href|src)="(?!https?:|\/|#|mailto:|tel:)([^"]*)"/g, `$1="${BASE_PATH}$2"`)
  .replaceAll(`${BASE_PATH}./`, BASE_PATH)
  .replace('<body class="page-hub ', '<body class="page-404 ')
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

console.log(`built ${pages.length} pages + ${redirects.length} redirects + 404 -> dist/ (${PRODUCTION ? 'production' : 'demo: noindex'})`);
