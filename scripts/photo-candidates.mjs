// 写真候補の取得（CI上で実行）。Unsplash（無料ライセンスのみ）と Openverse（商用利用可のCCライセンス）から
// サムネイルと出典情報を集める。採用写真は photo-picks.txt で指定し、出典を docs/photo-credits.md に記録する。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
const qs = readFileSync('.github/reference/photo-queries.txt', 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
mkdirSync('cand', { recursive: true });
const meta = [];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1400, height: 1000 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36' });
const page = await ctx.newPage();
async function save(prefix, n, url, info) {
  try {
    const r = await fetch(url);
    if (!r.ok) return false;
    const file = `cand/${prefix}_${String(n).padStart(2, '0')}.jpg`;
    writeFileSync(file, Buffer.from(await r.arrayBuffer()));
    meta.push({ file, ...info });
    return true;
  } catch { return false; }
}
for (const [qi, q] of qs.entries()) {
  const prefix = 'q' + String(qi).padStart(2, '0');
  let n = 0;
  try {
    await page.goto(`https://unsplash.com/s/photos/${encodeURIComponent(q.replace(/ /g, '-'))}?license=free&orientation=landscape`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2500);
    for (let i = 0; i < 3; i++) { await page.mouse.wheel(0, 1200); await page.waitForTimeout(600); }
    const items = await page.evaluate(() => [...document.querySelectorAll('a[href*="/photos/"]')].map((a) => {
      const img = a.querySelector('img[src*="images.unsplash.com/photo-"]');
      return img ? { href: a.href, src: img.src, alt: img.alt } : null;
    }).filter(Boolean));
    const seen = new Set();
    for (const it of items) {
      if (n >= 8) break;
      const base = it.src.split('?')[0];
      if (seen.has(base) || /plus\.unsplash/.test(it.src)) continue;
      seen.add(base);
      if (await save(prefix, n, base + '?w=420&q=60&fm=jpg', { q, source: 'unsplash', page: it.href.split('?')[0], raw: base, alt: it.alt })) n++;
    }
  } catch (e) { console.log('unsplash fail', q, String(e).slice(0, 80)); }
  try {
    const r = await fetch(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license_type=commercial&page_size=12&aspect_ratio=wide&mature=false`, { headers: { 'user-agent': 'ehime-shuzen-desk-mockup/1.0' } });
    if (r.ok) {
      const j = await r.json();
      for (const it of j.results || []) {
        if (n >= 14) break;
        if (!['cc0', 'pdm', 'by'].includes(it.license)) continue;
        const thumb = it.thumbnail || it.url;
        if (await save(prefix, n, thumb, { q, source: 'openverse:' + it.source, page: it.foreign_landing_url, raw: it.url, alt: it.title, creator: it.creator, creatorUrl: it.creator_url, license: it.license, licenseVersion: it.license_version, licenseUrl: it.license_url, w: it.width, h: it.height })) n++;
      }
    } else console.log('openverse', q, r.status);
  } catch (e) { console.log('openverse fail', q, String(e).slice(0, 80)); }
  console.log(q, n);
}
await browser.close();
writeFileSync('cand/meta.json', JSON.stringify(meta, null, 1));
