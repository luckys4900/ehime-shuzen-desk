// リファレンスサイトの構造・デザイン指標を取得（CI上で実行。分析用途のみ・成果物はリポジトリに含めない）
import { chromium } from 'playwright';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const urls = readFileSync('.github/reference/targets.txt', 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
const OUT = 'ref-captures/';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const summary = [];
for (const [i, url] of urls.entries()) {
  const id = String(i + 1).padStart(2, '0') + '-' + url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '_').slice(0, 50);
  for (const vp of [{ w: 1440, h: 900, k: 'd' }, { w: 390, h: 844, k: 'm' }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1, locale: 'ja-JP', userAgent: vp.k === 'm' ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' : undefined });
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    } catch (e) { try { await page.waitForTimeout(3000); } catch {} }
    await page.waitForTimeout(1500);
    // lazy-load
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(800);
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    const maxShots = vp.k === 'd' ? 8 : 10;
    for (let s = 0, y = 0; s < maxShots && y < total; s++, y += vp.h) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
      await page.waitForTimeout(250);
      await page.screenshot({ path: `${OUT}${id}-${vp.k}-${String(s).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 60 });
    }
    if (vp.k === 'd') {
      const info = await page.evaluate(() => {
        const cs = (el) => { const c = getComputedStyle(el); return { fs: c.fontSize, fw: c.fontWeight, ff: c.fontFamily.slice(0, 60), color: c.color, bg: c.backgroundColor, lh: c.lineHeight, ls: c.letterSpacing }; };
        const header = document.querySelector('header') || document.body.firstElementChild;
        const heads = [...document.querySelectorAll('h1,h2,h3')].slice(0, 60).map((h) => ({ tag: h.tagName, text: h.innerText.replace(/\s+/g, ' ').slice(0, 60), ...cs(h), align: getComputedStyle(h).textAlign }));
        const navs = [...document.querySelectorAll('header a, nav a')].map((a) => a.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 40);
        const btns = [...document.querySelectorAll('a,button')].filter((a) => { const c = getComputedStyle(a); return c.backgroundColor !== 'rgba(0, 0, 0, 0)' && a.innerText.trim().length > 1 && a.offsetHeight > 30; }).slice(0, 25).map((a) => { const c = getComputedStyle(a); return { text: a.innerText.replace(/\s+/g, ' ').slice(0, 40), bg: c.backgroundColor, color: c.color, radius: c.borderRadius, pad: c.padding, h: a.offsetHeight, fs: c.fontSize }; });
        const sections = [...document.querySelectorAll('section, main > div, .section')].slice(0, 40).map((s) => ({ h: s.offsetHeight, bg: getComputedStyle(s).backgroundColor, firstHead: (s.querySelector('h1,h2,h3')?.innerText || '').replace(/\s+/g, ' ').slice(0, 40) }));
        const forms = [...document.querySelectorAll('form')].map((f) => [...f.querySelectorAll('input,select,textarea')].map((el) => ({ type: el.type, name: el.name, req: el.required, label: (el.labels?.[0]?.innerText || el.closest('tr,dl,div')?.innerText || '').replace(/\s+/g, ' ').slice(0, 40) })));
        const widths = [...document.querySelectorAll('body *')].filter((e) => e.offsetWidth > 900 && e.offsetWidth < 1440).map((e) => e.offsetWidth);
        const imgs = document.images.length;
        const tel = [...document.querySelectorAll('a[href^="tel:"]')].length;
        return { title: document.title, body: cs(document.body), headerH: header?.offsetHeight, headerPos: header ? getComputedStyle(header).position : null, heads, navs, btns, sections, forms, containerWidths: [...new Set(widths)].sort((a, b) => b - a).slice(0, 6), imgs, tel, pageH: document.documentElement.scrollHeight };
      });
      summary.push({ id, url, ...info });
    }
    await ctx.close();
  }
  console.log('captured', id);
}
writeFileSync(OUT + 'summary.json', JSON.stringify(summary, null, 1));
await browser.close();
