// OGP画像（サイトごと）・apple-touch-icon を HTML から生成（src/assets に保存）
//   og-repair.png 愛媛修繕デスク / og-sale.png 売却前おまかせデスク / og.png 分岐ページ・共通ページ
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { routeFonts } from './pw.mjs';
const out = new URL('../src/assets/', import.meta.url).pathname;
const photoPath = (name) => new URL(`../src/assets/photos/${name}-l.jpg`, import.meta.url);
const sha1 = (u) => createHash('sha1').update(readFileSync(u)).digest('hex');

const OGS = [
  { file: 'og-repair.png', photo: 'hero', shade: '13,22,36', door: '#6f9fd8', name: '愛媛修繕デスク', sub: 'EHIME SHUZEN DESK',
    title: 'いつもの施工会社を<br>変える必要はありません。', line: '松山周辺の法人・事業者様向け　｜　建物修繕の相談窓口' },
  { file: 'og-sale.png', photo: 'kitaroom', shade: '16,22,21', door: '#e0874f', name: '売却前おまかせデスク', sub: '松山周辺の不動産会社様向け',
    title: 'いつもの業者はそのまま。<br>売却前だけ、もう一つの手配先を。', line: '残置物・空室清掃・草刈り・小修繕の手配をまとめて相談' },
  { file: 'og.png', photo: 'cta', shade: '16,22,21', door: '#e0874f', name: '愛媛修繕デスク・売却前おまかせデスク', sub: '松山周辺の事業者様向け 相談窓口',
    title: '愛媛の不動産・建物事業者向け<br>2つの相談窓口', line: '建物修繕の第二施工店　｜　不動産会社様向け 売却前の手配窓口' },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 } });
await routeFonts(ctx);
const page = await ctx.newPage();
const manifest = {};
for (const o of OGS) {
  const b64 = readFileSync(photoPath(o.photo)).toString('base64');
  await page.setContent(`<html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700&family=Shippori+Mincho+B1:wght@600;700&display=block"></head><body style="margin:0;width:1200px;height:630px;position:relative;overflow:hidden;font-family:'Noto Sans JP',sans-serif;color:#fff">
<img src="data:image/jpeg;base64,${b64}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
<div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(${o.shade},.88) 0%,rgba(${o.shade},.62) 55%,rgba(${o.shade},.22) 100%)"></div>
<div style="position:absolute;left:80px;top:72px;right:80px">
<div style="display:flex;align-items:center;gap:14px"><svg width="52" height="52" viewBox="0 0 40 40"><rect x="1" y="1" width="38" height="38" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M8 20 L20 9 L32 20" fill="none" stroke="#fff" stroke-width="2"/><path d="M12 18 V31 H28 V18" fill="none" stroke="#fff" stroke-width="2"/><rect x="17.5" y="23" width="5" height="8" fill="${o.door}"/></svg>
<div><div style="font-family:'Shippori Mincho B1',serif;font-size:30px;font-weight:700;letter-spacing:.1em">${o.name}</div><div style="font-size:13px;letter-spacing:.14em;opacity:.85">${o.sub}</div></div></div>
<div style="margin-top:70px;font-family:'Shippori Mincho B1',serif;font-size:56px;font-weight:600;line-height:1.5;letter-spacing:.06em">${o.title}</div>
<div style="margin-top:30px;font-size:22px;font-weight:500;letter-spacing:.08em;border-top:1px solid rgba(255,255,255,.5);padding-top:18px;display:inline-block">${o.line}</div>
</div></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  await page.screenshot({ path: out + o.file });
  manifest[o.file] = { photo: o.photo, source: sha1(photoPath(o.photo)), og: sha1(out + o.file) };
}
writeFileSync(new URL('../src/assets/og.json', import.meta.url), JSON.stringify(manifest, null, 1) + '\n');
await page.setViewportSize({ width: 180, height: 180 });
await page.setContent(`<html><body style="margin:0"><svg width="180" height="180" viewBox="0 0 40 40"><rect width="40" height="40" fill="#1f3a36"/><path d="M8 20 L20 9 L32 20" fill="none" stroke="#fff" stroke-width="3"/><path d="M12 18 V31 H28 V18" fill="none" stroke="#fff" stroke-width="3"/><rect x="17.5" y="23" width="5" height="8" fill="#e0773a"/></svg></body></html>`);
await page.screenshot({ path: out + 'apple-touch-icon.png' });
await browser.close();
console.log('images written:', OGS.map((o) => o.file).join(', '));
