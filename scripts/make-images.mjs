// OGP画像・apple-touch-icon を HTML から生成（src/assets に保存）
import { chromium } from 'playwright';
import { routeFonts } from './pw.mjs';
const out = new URL('../src/assets/', import.meta.url).pathname;
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 } });
await routeFonts(ctx);
const page = await ctx.newPage();
const OG_PHOTO = 'washitsu';
const fsMod = await import('node:fs');
const heroB64 = fsMod.readFileSync(new URL(`../src/assets/photos/${OG_PHOTO}-l.jpg`, import.meta.url)).toString('base64');
const { createHash } = await import('node:crypto');
const sha1 = (u) => createHash('sha1').update(fsMod.readFileSync(u)).digest('hex');
await page.setContent(`<html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700&family=Shippori+Mincho+B1:wght@600;700&display=block"></head><body style="margin:0;width:1200px;height:630px;position:relative;overflow:hidden;font-family:'Noto Sans JP',sans-serif;color:#fff">
<img src="data:image/jpeg;base64,${heroB64}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
<div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(16,22,21,.86) 0%,rgba(16,22,21,.6) 55%,rgba(16,22,21,.2) 100%)"></div>
<div style="position:absolute;left:80px;top:72px;right:80px">
<div style="display:flex;align-items:center;gap:14px"><svg width="52" height="52" viewBox="0 0 40 40"><rect x="1" y="1" width="38" height="38" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M8 20 L20 9 L32 20" fill="none" stroke="#fff" stroke-width="2"/><path d="M12 18 V31 H28 V18" fill="none" stroke="#fff" stroke-width="2"/><rect x="17.5" y="23" width="5" height="8" fill="#e0874f"/></svg>
<div><div style="font-family:'Shippori Mincho B1',serif;font-size:30px;font-weight:700;letter-spacing:.1em">売却前おまかせデスク</div><div style="font-size:13px;letter-spacing:.14em;opacity:.85">松山市・近郊の不動産会社向け</div></div></div>
<div style="margin-top:70px;font-family:'Shippori Mincho B1',serif;font-size:62px;font-weight:600;line-height:1.5;letter-spacing:.06em">売る前の面倒ごと、<br>まとめて1つの窓口へ。</div>
<div style="margin-top:30px;font-size:22px;font-weight:500;letter-spacing:.08em;border-top:1px solid rgba(255,255,255,.5);padding-top:18px;display:inline-block">残置物・空室清掃・草刈り・小修繕　｜　いつもの業者がいてもOK</div>
</div></body></html>`);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
await page.screenshot({ path: out + 'og.png' });
fsMod.writeFileSync(new URL('../src/assets/og.json', import.meta.url), JSON.stringify({ photo: OG_PHOTO, source: sha1(new URL(`../src/assets/photos/${OG_PHOTO}-l.jpg`, import.meta.url)), og: sha1(new URL('../src/assets/og.png', import.meta.url)) }) + '\n');
await page.setViewportSize({ width: 180, height: 180 });
await page.setContent(`<html><body style="margin:0"><svg width="180" height="180" viewBox="0 0 40 40"><rect width="40" height="40" fill="#1f3a36"/><path d="M8 20 L20 9 L32 20" fill="none" stroke="#fff" stroke-width="3"/><path d="M12 18 V31 H28 V18" fill="none" stroke="#fff" stroke-width="3"/><rect x="17.5" y="23" width="5" height="8" fill="#e0773a"/></svg></body></html>`);
await page.screenshot({ path: out + 'apple-touch-icon.png' });
await browser.close();
console.log('images written');
