// OGP画像・apple-touch-icon を HTML から生成（src/assets に保存）
import { chromium } from 'playwright';
import { routeFonts } from './pw.mjs';
const out = new URL('../src/assets/', import.meta.url).pathname;
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 } });
await routeFonts(ctx);
const page = await ctx.newPage();
await page.setContent(`<html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=block"></head><body style="margin:0;width:1200px;height:630px;background:#f6f4ef;font-family:'Noto Sans JP',sans-serif;position:relative;overflow:hidden">
<div style="position:absolute;inset:0;opacity:.6;background-image:linear-gradient(#e8e5de 1px,transparent 1px),linear-gradient(90deg,#e8e5de 1px,transparent 1px);background-size:32px 32px"></div>
<div style="position:absolute;left:80px;top:80px;right:80px">
<div style="display:flex;align-items:center;gap:16px"><svg width="64" height="64" viewBox="0 0 40 40"><rect x="1" y="1" width="38" height="38" fill="none" stroke="#1f3a36" stroke-width="2"/><path d="M8 20 L20 9 L32 20" fill="none" stroke="#1f3a36" stroke-width="2.4"/><path d="M12 18 V31 H28 V18" fill="none" stroke="#1f3a36" stroke-width="2.4"/><rect x="17.5" y="23" width="5" height="8" fill="#c25a22"/></svg>
<div><div style="font-size:34px;font-weight:900;letter-spacing:.06em;color:#1b2422">愛媛修繕デスク</div><div style="font-size:14px;letter-spacing:.2em;color:#5f6a66">EHIME SHUZEN DESK</div></div></div>
<div style="margin-top:56px;font-size:64px;font-weight:900;line-height:1.35;color:#1b2422;letter-spacing:.03em">いつもの施工会社を<br>変える必要はありません。</div>
<div style="margin-top:36px;display:inline-block;background:#1f3a36;color:#fff;font-size:24px;font-weight:700;padding:12px 24px">松山周辺の法人・事業者様向け　建物修繕の相談窓口</div>
</div><div style="position:absolute;left:0;right:0;bottom:0;height:14px;background:#c25a22"></div></body></html>`);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
await page.screenshot({ path: out + 'og.png' });
await page.setViewportSize({ width: 180, height: 180 });
await page.setContent(`<html><body style="margin:0"><svg width="180" height="180" viewBox="0 0 40 40"><rect width="40" height="40" fill="#1f3a36"/><path d="M8 20 L20 9 L32 20" fill="none" stroke="#fff" stroke-width="3"/><path d="M12 18 V31 H28 V18" fill="none" stroke="#fff" stroke-width="3"/><rect x="17.5" y="23" width="5" height="8" fill="#e0773a"/></svg></body></html>`);
await page.screenshot({ path: out + 'apple-touch-icon.png' });
await browser.close();
console.log('images written');
