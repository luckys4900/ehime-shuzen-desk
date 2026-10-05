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

const routes = ['', 'partner/', 'privacy/', 'credits/'];
const widths = [390, 430, 768, 1024, 1240, 1440];
const shots = { '': ['desktop', 'mobile'], 'partner/': ['mobile'] };
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
    const m = await page.evaluate(async () => {
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
        orphanLines: [...document.querySelectorAll('h1, h2, h3, main p, main li, main dd, main th, main td, main small, main figcaption, .faq summary, .prep__list span, .facts__v')].filter((h) => h.offsetParent !== null).map((h) => {
          const counts = [];
          const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
          let node;
          while ((node = walker.nextNode())) {
            // 同じブロックの文字だけを数える（子ブロックの文字は別に評価する）
            if (node.parentElement !== h && !node.parentElement.matches('a, .nw, .mark, strong, em, small')) continue;
            if (node.parentElement !== h && node.parentElement.matches('small') && getComputedStyle(node.parentElement).display === 'block') continue;
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
          counts.sort((x, y) => x.top - y.top);
          return counts.length > 1 && counts.some((c, i) => c.n <= (i === counts.length - 1 ? 2 : 1)) ? h.textContent.trim().slice(0, 14) : null;
        }).filter(Boolean),
        areaStrongLines: [...document.querySelectorAll('.area__table td strong')].map((el) => Math.round(el.getBoundingClientRect().height / ((v) => Number.isFinite(v) ? v : parseFloat(getComputedStyle(el).fontSize) * 1.5)(parseFloat(getComputedStyle(el).lineHeight)))).filter((n) => n > 2).length,
        stickyCovers: await (async () => {
          const bar = document.querySelector('.mobile-cta');
          if (!bar || getComputedStyle(bar).display === 'none') return false;
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
          await new Promise((r) => setTimeout(r, 120));
          const last = document.querySelector('.site-footer__note');
          const covers = !bar.classList.contains('is-hidden') && last.getBoundingClientRect().bottom > bar.getBoundingClientRect().top + 1;
          window.scrollTo({ top: 0, behavior: 'instant' });
          return covers;
        })(),
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
    if (m.orphanLines.length) fail(`${r || '/'} @${w}: last line with <=2 chars: ${m.orphanLines.join(' / ')}`);
    if (m.areaStrongLines) fail(`${r || '/'} @${w}: area table place list wraps over 2 lines`);
    if (m.stickyCovers) fail(`${r || '/'} @${w}: sticky CTA covers the end of the page`);
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
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
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
{
  const pr = await ctx.newPage();
  await pr.goto(BASE + '#flow', { waitUntil: 'networkidle' });
  await pr.waitForTimeout(300);
  await pr.mouse.wheel(0, 2500); await pr.waitForTimeout(400);
  const y1 = await pr.evaluate(() => scrollY);
  await pr.reload({ waitUntil: 'networkidle' }); await pr.waitForTimeout(600);
  const y2 = await pr.evaluate(() => scrollY);
  await pr.close();
  if (Math.abs(y2 - y1) > 40) fail(`reload with #hash jumps: ${y1} -> ${y2}`); else ok('reload keeps scroll position with #hash');
}
if (/href="#(?!main")/.test(nfBody)) fail('404 has in-page anchors that do not exist there'); else ok('404 links are all absolute');
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
await page.click('#gnav a[href$="#faq"]');
await page.waitForTimeout(500);
const navOk = await page.evaluate(() => location.hash === '#faq' && !document.getElementById('gnav').classList.contains('is-open') && Math.abs(document.getElementById('faq').getBoundingClientRect().top) < 140);
if (!navOk) fail('mobile nav anchor link'); else ok('mobile nav anchor jumps to section and closes menu');

{ const robots = await (await req.get(BASE + 'robots.txt')).text(); if (!/Disallow: \//.test(robots)) fail('demo robots.txt should disallow'); else ok('demo robots.txt disallows indexing'); }

// ---- 旧URLは新しいページへ転送される ----
for (const [from, hash] of [['kanri/', ''], ['kaitori/', ''], ['shop/', ''], ['contact/', '#form']]) {
  const p2 = await ctx.newPage();
  await p2.goto(BASE + from, { waitUntil: 'networkidle' });
  const u = new URL(p2.url());
  if (u.pathname !== new URL(BASE).pathname || u.hash !== hash) fail(`redirect ${from} -> ${p2.url()}`); else ok(`old URL ${from} redirects to top${hash}`);
  await p2.close();
}

// ---- 文言：一般消費者向け・根拠のない表現・架空情報がないこと ----
{
  const text = await page.evaluate(() => document.body.innerText);
  const banned = ['地域最安', '最安', 'どんな工事でも', '何でもできます', '安心施工', '自社職人', '自社施工します', 'ご自宅の修繕でお困り', '施工実績', 'お客様の声', '24時間', '即日対応', '満足度', '000-0000'];
  const hits = banned.filter((w) => text.includes(w));
  if (hits.length) fail('banned wording: ' + hits.join(',')); else ok('no banned / unsupported wording');
  const must = ['松山周辺の不動産会社様向け', 'いつもの業者は', '売却前だけ、', 'もう一つの手配先を。', '写真を送って案件相談', '相談無料 ｜ 既存業者との併用OK ｜ 松山市・近郊対応', 'いつもの業者は、そのままで大丈夫です。', '第二の手配先', 'ご相談例', '必要な許可を有する事業者', '自社で作業を行う会社ではありません'];
  const miss = must.filter((w) => !text.includes(w));
  if (miss.length) fail('required copy missing: ' + miss.join(',')); else ok('required positioning copy present');
  const ctas = await page.locator('main a[href="#form"], .site-footer__cta a[href$="#form"]').count();
  if (ctas < 6) fail('CTA count to #form ' + ctas); else ok(`CTAs to the form (hero, concept, services, flow, band, footer): ${ctas}`);
  if (await page.locator('a[href^="tel:"]').count()) fail('phone link shown without a configured number'); else ok('no phone CTA while phone is not configured');
}

// ---- 案件相談フォーム（デモモード）：3ステップ・入力チェック・写真・下書き・計測 ----
const events = [];
await page.exposeFunction('__qaEvent', (n) => events.push(n));
await page.addInitScript(() => document.addEventListener('osd:track', (e) => window.__qaEvent(e.detail.name)));
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
await page.reload({ waitUntil: 'networkidle' });
await page.click('.hero a[href="#form"]');
await page.waitForTimeout(400);
const formTop = await page.evaluate(() => document.getElementById('form').getBoundingClientRect().top);
if (Math.abs(formTop) > 120) fail('hero CTA does not scroll to form: ' + formTop); else ok('hero CTA scrolls to the form');
const stickyHidden = await page.evaluate(() => document.querySelector('.mobile-cta').classList.contains('is-hidden'));
if (!stickyHidden) fail('sticky CTA still shown over the form'); else ok('sticky CTA hides while the form is on screen');
await page.click('[data-next="2"]');
if (!(await page.isVisible('[data-step="1"]')) || !(await page.textContent('#services-err'))) fail('step 1 not validated'); else ok('step 1 requires a service, error under field');
await page.locator('label.choice:has(input[value="残置物・片付け"])').click();
await page.locator('label.choice:has(input[value="草刈り・外回り"])').click();
if (await page.textContent('#services-err')) fail('service error not cleared');
await page.click('[data-next="2"]');
if (!(await page.isVisible('[data-step="2"]'))) fail('did not move to step 2'); else ok('moves to step 2 on the same page');
const realJpg = (await import('node:fs')).readFileSync(new URL('../src/assets/photos/akiya_kitchen-l.jpg', import.meta.url));
await page.setInputFiles('#photos', [1, 2, 3, 4, 5, 6].map((i) => ({ name: `p${i}.jpg`, mimeType: 'image/jpeg', buffer: realJpg })).concat([{ name: 'doc.pdf', mimeType: 'application/pdf', buffer: Buffer.from('x') }]));
await page.waitForFunction(() => document.querySelectorAll('.js-thumbs li').length === 6, null, { timeout: 8000 }).catch(() => {});
const nThumb = await page.locator('.js-thumbs li img').count();
if (nThumb !== 6) fail('photo previews ' + nThumb); else ok('6 photos previewed (multi-select), non-photo rejected');
await page.setInputFiles('#photos', [7, 8, 9, 10, 11].map((i) => ({ name: `q${i}.jpg`, mimeType: 'image/jpeg', buffer: realJpg })));
await page.waitForTimeout(1500);
const nThumb2 = await page.locator('.js-thumbs li').count();
const capMsg = await page.textContent('#photos-err');
if (nThumb2 !== 10 || !/上限/.test(capMsg)) fail(`photo cap: ${nThumb2} ${capMsg}`); else ok('photo cap of 10 enforced with message');
await page.click('[data-next="3"]');
if (!(await page.textContent('#area-err'))) fail('area required not enforced'); else ok('step 2 requires area');
await page.selectOption('#area', '松山市');
await page.locator('label.choice:has(input[name="ptype"][value="戸建"])').click();
await page.click('[data-next="3"]');
await page.fill('#company', 'テスト不動産');
// 途中で再読み込みしても入力が残る
await page.reload({ waitUntil: 'networkidle' });
const restored = await page.evaluate(() => ({ step: [...document.querySelectorAll('.cstep')].find((f) => !f.hidden)?.dataset.step, company: document.getElementById('company').value, svc: [...document.querySelectorAll('[name=services]:checked')].map((x) => x.value).join(','), area: document.getElementById('area').value, note: !document.getElementById('draft-note').hidden }));
if (restored.step !== '3' || restored.company !== 'テスト不動産' || restored.svc !== '残置物・片付け,草刈り・外回り' || restored.area !== '松山市' || !restored.note) fail('draft not restored: ' + JSON.stringify(restored)); else ok('draft restored after reload (step, text, checkboxes, select)');
await page.fill('#name', '山田');
await page.click('#case-form button[type="submit"]');
if (!/どちらか/.test(await page.textContent('#contact-err'))) fail('tel-or-email rule not enforced'); else ok('either phone or email is required');
await page.fill('#email', 'bad');
await page.click('#case-form button[type="submit"]');
if (!/形式/.test(await page.textContent('#contact-err'))) fail('email format'); else ok('email format checked');
await page.fill('#email', 'info@example.co.jp');
await page.click('#case-form button[type="submit"]');
await page.waitForTimeout(300);
const demo = await page.evaluate(() => ({ shown: !document.getElementById('case-done').hidden, id: document.getElementById('case-id').textContent, text: document.getElementById('case-text').textContent, stepper: document.querySelector('.stepper').offsetParent !== null }));
if (!demo.shown || !/^MAT-\d{8}-001$/.test(demo.id) || !/デモ|送信されていません/.test(demo.text) || demo.stepper) fail('demo done panel: ' + JSON.stringify(demo)); else ok('demo mode: honest not-sent message with case number format example');
for (const ev of ['hero_cta_click', 'form_start', 'service_select', 'photo_upload', 'form_submit']) {
  if (!events.includes(ev)) fail('event not fired: ' + ev); else ok('event fired: ' + ev);
}
{
  const p3 = await ctx.newPage();
  const ev2 = [];
  await p3.exposeFunction('__qaEvent', (n) => ev2.push(n));
  await p3.addInitScript(() => document.addEventListener('osd:track', (e) => window.__qaEvent(e.detail.name)));
  await p3.goto(BASE, { waitUntil: 'networkidle' });
  await p3.click('.mobile-cta a[href$="#form"]');
  if (!ev2.includes('sticky_cta_click')) fail('sticky_cta_click not fired'); else ok('event fired: sticky_cta_click');
  await p3.close();
}

// ---- 本番接続（送信先を差し替え）：保存先へ届く内容・案件番号・失敗時の扱い ----
async function caseSend(handler) {
  const p2 = await ctx.newPage();
  await p2.addInitScript((u) => { window.EHIME_FORM_ENDPOINT = u; try { localStorage.clear(); } catch (e) {} }, BASE + '__qa_endpoint');
  const bodies = [];
  await p2.route('**/__qa_endpoint', async (route) => { bodies.push(route.request().postData() || ''); await handler(route); });
  await p2.goto(BASE + '#form', { waitUntil: 'networkidle' });
  await p2.locator('label.choice:has(input[value="空室清掃"])').click();
  await p2.locator('label.choice:has(input[value="小修繕"])').click();
  await p2.locator('label.choice:has(input[name="timing"][value="急ぎ"])').click();
  await p2.fill('#note', '内覧前に清掃したい');
  await p2.click('[data-next="2"]');
  await p2.setInputFiles('#photos', [1, 2].map((i) => ({ name: `room${i}.jpg`, mimeType: 'image/jpeg', buffer: realJpg })));
  await p2.waitForFunction(() => document.querySelectorAll('.js-thumbs li').length === 2, null, { timeout: 8000 }).catch(() => {});
  await p2.selectOption('#area', '伊予市');
  await p2.fill('#address', '伊予市米湊');
  await p2.locator('label.choice:has(input[name="status"][value="媒介中"])').click();
  await p2.click('[data-next="3"]');
  await p2.fill('#company', '伊予不動産'); await p2.fill('#name', '佐藤'); await p2.fill('#tel', '（089）912−3456');
  const btn = p2.locator('#case-form button[type="submit"]');
  await btn.click(); await btn.click({ force: true }).catch(() => {});
  await p2.waitForTimeout(900);
  const out = await p2.evaluate(() => ({ done: !document.getElementById('case-done').hidden, id: document.getElementById('case-id').textContent, err: document.querySelector('[data-status-for="case-form"]').hidden ? '' : document.querySelector('[data-status-for="case-form"]').textContent, draft: (() => { try { return localStorage.getItem('osd-case-draft-v1'); } catch (e) { return 'x'; } })(), thumbs: document.querySelectorAll('.js-thumbs li').length, disabled: document.querySelector('#case-form button[type="submit"]').disabled }));
  await p2.close();
  return { out, bodies };
}
const live = await caseSend((route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, caseId: 'MAT-20261005-007' }) }));
if (live.bodies.length !== 1) fail('live send count ' + live.bodies.length); else ok('one request per submit (double submit guarded)');
{
  let j = {};
  try { j = JSON.parse(live.bodies[0] || '{}'); } catch (e) { fail('payload is not JSON'); }
  const okPayload = j.formType === 'case' && j.company === '伊予不動産' && j.name === '佐藤' && j.tel === '0899123456' && j.area === '伊予市' && j.address === '伊予市米湊' && j.status === '媒介中' && j.timing === '急ぎ' && j.note === '内覧前に清掃したい'
    && Array.isArray(j.services) && j.services.join() === '空室清掃,小修繕' && Array.isArray(j.photos) && j.photos.length === 2 && /^data:image\/jpeg;base64,/.test(j.photos[0].dataUrl) && !('website' in j);
  if (!okPayload) fail('payload content: ' + JSON.stringify({ ...j, photos: (j.photos || []).length })); else ok('payload carries all fields, services array, 2 compressed JPEG photos, normalized phone');
  const kb = Math.round((j.photos?.[0]?.dataUrl.length || 0) / 1024);
  if (kb > 900) fail('photo not compressed: ' + kb + 'KB'); else ok(`photo compressed before sending (~${kb}KB base64)`);
}
if (!live.out.done || live.out.id !== 'MAT-20261005-007') fail('case number not shown: ' + JSON.stringify(live.out)); else ok('case number from backend shown after submit');
if (live.out.draft) fail('draft not cleared after successful send'); else ok('draft cleared after successful send');
const l500 = await caseSend((route) => route.fulfill({ status: 500, body: 'x' }));
if (l500.out.done || !/送信できませんでした/.test(l500.out.err) || l500.out.thumbs !== 2 || l500.out.disabled) fail('server error handling: ' + JSON.stringify(l500.out)); else ok('server error: message shown, photos kept, button re-enabled');
const lbad = await caseSend((route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: false, error: 'invalid' }) }));
if (lbad.out.done) fail('backend rejection treated as success'); else ok('backend {ok:false} is not treated as success');
const lnet = await caseSend((route) => route.abort('failed'));
if (!/通信に失敗/.test(lnet.out.err)) fail('network failure message: ' + lnet.out.err); else ok('network failure message shown');

// ---- 結合：フォームの送信内容を実際のバックエンド（Code.gs を模擬環境で実行）へ渡す ----
{
  const { makeEnv } = await import('./test-backend.mjs');
  const be = makeEnv();
  const today = be.env.Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyyMMdd');
  const r = await caseSend((route) => route.fulfill({ status: 200, contentType: 'application/json', body: be.env.doPost({ postData: { contents: route.request().postData() } }).text }));
  const row = be.rows['案件'][0] || [];
  const okRow = be.rows['案件'].length === 1 && row[2] === '伊予不動産' && row[6] === '伊予市' && row[11] === '空室清掃、小修繕' && row[13] === 2;
  if (!okRow) fail('backend sheet row: ' + JSON.stringify(row.slice(0, 16))); else ok('contract: case saved to sheet (company, area, services, photo count)');
  if (be.files.length !== 2 || !be.files.every((f) => f.type === 'image/jpeg' && f.folder === `MAT-${today}-001`)) fail('backend drive files: ' + JSON.stringify(be.files.map((f) => [f.folder, f.type]))); else ok('contract: 2 photos saved to the case folder in Drive');
  const mail = be.mails[0] || {};
  if (be.mails.length !== 1 || mail.to !== 'desk@example.com' || !String(mail.subject).includes(`MAT-${today}-001`) || !String(mail.body).includes('伊予不動産')) fail('backend mail: ' + JSON.stringify(be.mails)); else ok('contract: notification mail sent with case number and company');
  if (!r.out.done || r.out.id !== `MAT-${today}-001`) fail('contract case id on page: ' + JSON.stringify(r.out)); else ok('contract: case number issued by backend is shown to the sender');
}

// ---- 電話番号を設定したビルド：電話CTAの表示と phone_click（ローカル実行時のみ） ----
if (!arg) {
  const { execFileSync } = await import('node:child_process');
  const { mkdtempSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const dir = mkdtempSync(tmpdir() + '/osd-phone-');
  execFileSync(process.execPath, [new URL('../build.mjs', import.meta.url).pathname], { env: { ...process.env, OUT_DIR: dir, SITE_CONFIG_OVERRIDE: JSON.stringify({ phone: '089-912-3456', phoneHours: '平日 9:00〜18:00' }) }, stdio: 'ignore' });
  const srv2 = await serve(4174, dir + '/');
  const p4 = await ctx.newPage();
  const ev4 = [];
  await p4.exposeFunction('__qaEv', (n) => ev4.push(n));
  await p4.addInitScript(() => document.addEventListener('osd:track', (e) => window.__qaEv(e.detail.name)));
  await p4.goto('http://localhost:4174/ehime-shuzen-desk/', { waitUntil: 'networkidle' });
  const tel = await p4.evaluate(() => ({ n: document.querySelectorAll('a[href="tel:0899123456"]').length, sticky: [...document.querySelectorAll('.mobile-cta a')].map((a) => a.textContent.trim()).join('|'), two: document.querySelector('.mobile-cta').classList.contains('mobile-cta--two') }));
  if (tel.n < 3 || tel.sticky !== '電話で相談|写真を送って相談' || !tel.two) fail('phone build: ' + JSON.stringify(tel)); else ok(`phone build: tel links shown (${tel.n}) incl. sticky 電話で相談`);
  await p4.evaluate(() => document.addEventListener('click', (e) => { if (e.target.closest('a[href^="tel:"]')) e.preventDefault(); }));
  await p4.click('.mobile-cta a[href^="tel:"]');
  if (!ev4.includes('phone_click')) fail('phone_click not fired'); else ok('event fired: phone_click');
  await p4.close(); srv2.close(); rmSync(dir, { recursive: true, force: true });
}

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
