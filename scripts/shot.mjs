import { chromium } from 'playwright';
import { serve } from './serve.mjs';
import { routeFonts } from './pw.mjs';
const [,, route, w, ys, out] = process.argv;
const srv = await serve(4174);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: +w, height: +w < 768 ? 844 : 900 } });
await routeFonts(ctx);
const p = await ctx.newPage();
await p.goto('http://localhost:4174/ehime-shuzen-desk/' + route, { waitUntil: 'networkidle' });
let i = 0;
for (const y of ys.split(',')) { await p.evaluate((y) => window.scrollTo({ top: +y, behavior: 'instant' }), y); await p.waitForTimeout(150); await p.screenshot({ path: `${out}-${i++}.png` }); }
await b.close(); srv.close();
