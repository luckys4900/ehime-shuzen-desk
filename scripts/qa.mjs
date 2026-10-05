// ブラウザ QA：全ルート × ブレークポイントで横スクロール・コンソールエラー・リンク・フォーム等を検証し、スクリーンショットを保存
// 使い方: node scripts/qa.mjs [baseURL]   （省略時はローカルサーバーを起動）
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { serve } from './serve.mjs';
import { routeFonts } from './pw.mjs';

const arg = process.argv[2];
let srv;
const BASE = arg || 'http://localhost:4173/ehime-shuzen-desk/';
if (!arg) srv = await serve(4173);
const WRITE = process.env.QA_WRITE === '1'; // 1 のときだけ docs/screenshots と harness/qa-result.json を更新する
const SHOT_DIR = new URL('../docs/screenshots/', import.meta.url).pathname;
mkdirSync(SHOT_DIR, { recursive: true });

const routes = ['', 'kanri/', 'kaitori/', 'shop/', 'partner/', 'contact/', 'privacy/'];
const widths = [390, 430, 768, 1024, 1440];
const shots = { '': ['desktop', 'mobile'], 'kanri/': ['desktop', 'mobile'], 'kaitori/': ['mobile'], 'shop/': ['mobile'], 'partner/': ['mobile'], 'contact/': ['mobile'] };
const results = { base: BASE, date: new Date().toISOString(), checks: [], failures: [] };
const fail = (m) => { results.failures.push(m); };
const ok = (m) => { results.checks.push(m); };

const browser = await chromium.launch();
const linkSet = new Set();

for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 844 : 900 }, deviceScaleFactor: 1 });
  await routeFonts(ctx);
  for (const r of routes) {
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('requestfailed', (req) => { if (!/fonts\.g/.test(req.url())) errors.push('requestfailed ' + req.url()); });
    const res = await page.goto(BASE + r, { waitUntil: 'networkidle' });
    if (res.status() !== 200) fail(`${r || '/'} @${w}: status ${res.status()}`);
    await page.evaluate(() => document.fonts.ready);
    const m = await page.evaluate(() => {
      const de = document.documentElement;
      const over = [];
      document.querySelectorAll('body *').forEach((el) => {
        const rc = el.getBoundingClientRect();
        if (rc.width && (rc.right > de.clientWidth + 1 || rc.left < -1) && getComputedStyle(el).position !== 'fixed' && !el.closest('.gnav') && !el.closest('.skip')) over.push(el.tagName + '.' + el.className);
      });
      return {
        sw: de.scrollWidth, cw: de.clientWidth, over: over.slice(0, 5),
        imgsNoAlt: [...document.querySelectorAll('img:not([alt])')].length,
        svgNoLabel: [...document.querySelectorAll('svg[role="img"]')].filter((s) => !s.getAttribute('aria-labelledby') && !s.getAttribute('aria-label')).length,
        h1: document.querySelectorAll('h1').length,
        title: document.title, desc: document.querySelector('meta[name="description"]')?.content,
        og: document.querySelector('meta[property="og:image"]')?.content,
        icon: document.querySelector('link[rel="icon"]')?.href,
        links: [...document.querySelectorAll('a[href]')].map((a) => a.href),
        unlabeled: [...document.querySelectorAll('input:not([type=hidden]), select, textarea')].filter((el) => !(el.labels && el.labels.length) && !el.getAttribute('aria-labelledby') && !el.getAttribute('aria-label')).map((el) => el.name),
        smallTap: [...document.querySelectorAll('a.btn, button')].filter((el) => { const b = el.getBoundingClientRect(); return b.width && b.height < 40; }).length,
        narrowHeads: innerWidth < 768 ? [...document.querySelectorAll('h1, h2')].filter((h) => h.getBoundingClientRect().width && h.getBoundingClientRect().width < de.clientWidth * 0.7 && !h.closest('.cta__box, .rel')).map((h) => h.textContent.trim().slice(0, 12)) : [],
        orphanLines: [...document.querySelectorAll('h1, h2, h3, main p, main li, main dd, main th, main td, main figcaption, .faq summary, .prep__list span, .facts__v')].filter((h) => h.offsetParent !== null).map((h) => {
          const counts = [];
          const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
          let node;
          while ((node = walker.nextNode())) {
            // 同じブロックの文字だけを数える（子ブロックの文字は別に評価する）
            if (node.parentElement !== h && !node.parentElement.matches('a, .nw, .mark, strong, em, small')) continue;
            if (node.parentElement.matches('small') && getComputedStyle(node.parentElement).display === 'block') continue;
            for (let i = 0; i < node.length; i++) {
              if (/\s/.test(node.data[i])) continue;
              const r = document.createRange(); r.setStart(node, i); r.setEnd(node, i + 1);
              const rect = r.getClientRects()[0];
              if (!rect) continue;
              const top = Math.round(rect.top);
              const line = counts.find((c) => Math.abs(c.top - top) < 6);
              if (line) line.n++; else counts.push({ top, n: 1 });
            }
          }
          return counts.length > 1 && counts.some((c) => c.n <= 2) ? h.textContent.trim().slice(0, 14) : null;
        }).filter(Boolean),
        areaStrongLines: [...document.querySelectorAll('.area__table td strong')].map((el) => Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight || 30))).filter((n) => n > 2).length,
        mobileCtaAtTop: innerWidth < 768 && !!document.querySelector('.hero__actions, .phero .btn-row') && document.querySelector('.mobile-cta') && !document.querySelector('.mobile-cta').classList.contains('is-hidden') && getComputedStyle(document.querySelector('.mobile-cta')).display !== 'none',
        placeholderText: /(lorem|ipsum|ダミー|TODO|XXX|000-0000|○○)/i.test(document.body.innerText),
      };
    });
    if (m.sw > m.cw) fail(`${r || '/'} @${w}: horizontal scroll ${m.sw}>${m.cw} ${m.over.join(',')}`);
    else ok(`${r || '/'} @${w}: no horizontal overflow`);
    if (m.over.length) fail(`${r || '/'} @${w}: elements outside viewport ${m.over.join(',')}`);
    if (m.imgsNoAlt || m.svgNoLabel) fail(`${r || '/'}: missing alt/labels`);
    if (m.h1 !== 1) fail(`${r || '/'}: h1 count ${m.h1}`);
    if (!m.title || !m.desc || !m.og || !m.icon) fail(`${r || '/'}: meta missing`);
    if (m.unlabeled.length) fail(`${r || '/'}: unlabeled inputs ${m.unlabeled}`);
    if (m.smallTap) fail(`${r || '/'} @${w}: ${m.smallTap} tap targets < 40px`);
    if (m.narrowHeads.length) fail(`${r || '/'} @${w}: headings squeezed ${m.narrowHeads.join(',')}`);
    if (m.orphanLines.length) fail(`${r || '/'} @${w}: line with <=2 chars: ${m.orphanLines.join(' / ')}`);
    if (m.areaStrongLines) fail(`${r || '/'} @${w}: area table place list wraps over 2 lines`);
    if (m.mobileCtaAtTop) fail(`${r || '/'} @${w}: mobile fixed CTA visible while hero CTA is on screen`);
    if (m.placeholderText) fail(`${r || '/'}: placeholder-like text found`);
    if (errors.length) fail(`${r || '/'} @${w}: console errors ${errors.join(' | ')}`);
    m.links.forEach((l) => linkSet.add(l.split('#')[0]));

    const kind = w === 1440 ? 'desktop' : w === 390 ? 'mobile' : null;
    if (WRITE && kind && shots[r]?.includes(kind)) {
      const name = (r.replace('/', '') || 'top') + '-' + kind + '.png';
      await page.screenshot({ path: SHOT_DIR + name, fullPage: true });
    }
    await page.close();
  }
  await ctx.close();
}

// internal links
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
await routeFonts(ctx);
const req = ctx.request;
for (const l of linkSet) {
  if (!l.startsWith(BASE.replace(/\/$/, ''))) continue;
  const r = await req.get(l);
  if (r.status() !== 200) fail(`broken link ${l} -> ${r.status()}`);
}
ok(`internal links checked: ${[...linkSet].filter((l) => l.startsWith(BASE.replace(/\/$/, ''))).length}`);
for (const p of ['sitemap.xml', 'robots.txt', 'assets/og.png', 'assets/favicon.svg', 'assets/apple-touch-icon.png']) {
  const r = await req.get(BASE + p);
  if (r.status() !== 200) fail(`${p} -> ${r.status()}`); else ok(`${p} 200`);
}
const nf = await req.get(BASE + 'no-such-page/');
if (nf.status() !== 404) fail(`404 status ${nf.status()}`); else ok('404 returns 404');
const nfBody = await nf.text();
if (!nfBody.includes('お探しのページが見つかりませんでした')) fail('404 body');

// mobile nav + form behaviour
const page = await ctx.newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(String(e)));
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.click('.menu-btn');
if (!(await page.isVisible('#gnav'))) fail('mobile nav does not open'); else ok('mobile nav opens');
if ((await page.getAttribute('.menu-btn', 'aria-expanded')) !== 'true') fail('aria-expanded not updated');
await page.keyboard.press('Escape');
if (await page.isVisible('#gnav')) fail('mobile nav does not close with Escape'); else ok('mobile nav closes with Escape');
await page.click('.menu-btn');
await page.click('#gnav a[href*="kanri"]');
await page.waitForURL(/kanri/);
ok('mobile nav link navigates');

await page.goto(BASE + 'contact/?type=shop', { waitUntil: 'networkidle' });
if (!(await page.isChecked('input[name="segment"][value="shop"]'))) fail('?type preset not applied'); else ok('?type preset works');
await page.click('#contact-form button[type="submit"]');
const errCount = await page.locator('#contact-form .is-invalid').count();
if (errCount < 9) fail(`empty submit invalid fields = ${errCount}`); else ok(`empty submit shows ${errCount} invalid fields`);
const focused = await page.evaluate(() => document.activeElement?.getAttribute('data-status-for'));
if (focused !== 'contact-form') fail('focus not moved to error summary'); else ok('focus moved to error summary');
const links = await page.locator('[data-status-for="contact-form"] a[data-goto]').count();
if (links < 10) fail('error summary links ' + links); else ok('error summary has ' + links + ' links');
await page.locator('[data-status-for="contact-form"] a[data-goto]').first().click();
const jumped = await page.evaluate(() => document.activeElement?.name);
if (!jumped) fail('error summary link does not focus field'); else ok('error summary link focuses ' + jumped);
await page.fill('#company', 'テスト株式会社');
await page.fill('#name', '山田');
await page.fill('#tel', '089-000-12');
await page.fill('#email', 'bad');
await page.click('#contact-form button[type="submit"]');
const telErr = await page.textContent('#tel-err');
const mailErr = await page.textContent('#email-err');
if (!telErr || !mailErr) fail('tel/email format validation'); else ok('tel/email format validation');
await page.fill('#tel', '０８９－９１２－３４５６');
await page.fill('#email', 'info@example.co.jp');
await page.selectOption('#city', '松山市');
await page.fill('#address', '一番町1丁目');
await page.selectOption('#ptype', { index: 1 });
await page.check('input[name="occupancy"][value="空室"]', { force: true });
await page.fill('#detail', '壁紙の剥がれ');
await page.selectOption('#timing', { index: 1 });
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
await page.setInputFiles('#photos', [{ name: 'room.png', mimeType: 'image/png', buffer: png }, { name: 'bad.exe', mimeType: 'application/x-msdownload', buffer: Buffer.from('x') }]);
const thumbs = await page.locator('.js-thumbs li').count();
if (thumbs !== 1) fail(`upload preview count ${thumbs}`); else ok('upload preview + type rejection');
await page.check('#agree', { force: true });
await page.click('#contact-form button[type="submit"]');
const status = await page.textContent('[data-status-for="contact-form"]');
if (!/本番接続前/.test(status)) fail('valid submit status: ' + status); else ok('valid submit shows not-connected status');
const robots = await (await req.get(BASE + 'robots.txt')).text();
if (!/Disallow: \//.test(robots)) fail('demo robots.txt should disallow'); else ok('demo robots.txt disallows indexing');

await page.goto(BASE + 'partner/', { waitUntil: 'networkidle' });
await page.click('#partner-form button[type="submit"]');
const pErr = await page.locator('#partner-form .is-invalid').count();
if (pErr < 6) fail('partner empty submit invalid ' + pErr); else ok('partner form validation ' + pErr);

// home header transparency over hero, solid after scroll
await page.goto(BASE, { waitUntil: 'networkidle' });
const over = await page.evaluate(() => document.querySelector('.site-header').classList.contains('is-over'));
await page.evaluate(() => window.scrollTo(0, 800));
await page.waitForTimeout(200);
const solid = await page.evaluate(() => !document.querySelector('.site-header').classList.contains('is-over'));
if (!over || !solid) fail('header over-hero state'); else ok('header transparent on hero, solid after scroll');
// partner mobile CTA
await page.goto(BASE + 'partner/', { waitUntil: 'networkidle' });
const pm = await page.getAttribute('.mobile-cta a', 'href');
if (pm !== '#entry') fail('partner mobile cta ' + pm); else ok('partner mobile CTA goes to #entry');

// keyboard focus visibility
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.keyboard.press('Tab');
const skipVisible = await page.evaluate(() => document.activeElement.classList.contains('skip') && document.activeElement.getBoundingClientRect().left >= 0);
if (!skipVisible) fail('skip link not focusable/visible'); else ok('skip link visible on focus');
if (errs.length) fail('page errors ' + errs.join(' | '));

await browser.close();
if (srv) srv.close();
if (WRITE) writeFileSync(new URL('../harness/qa-result.json', import.meta.url), JSON.stringify(results, null, 2));
results.failures.forEach((f) => console.log('FAIL', f));
console.log(`checks ok: ${results.checks.length}, failures: ${results.failures.length}`);
process.exit(results.failures.length ? 1 : 0);
