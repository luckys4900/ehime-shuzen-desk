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
  for (const site of ['unsplash', 'pexels']) {
    try {
      const url = site === 'unsplash'
        ? `https://unsplash.com/s/photos/${encodeURIComponent(q.replace(/ /g, '-'))}?license=free&orientation=landscape`
        : `https://www.pexels.com/search/${encodeURIComponent(q)}/?orientation=landscape`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      for (let w = 0; w < 30; w++) {
        const t = await page.title().catch(() => '');
        if (!/bot|moment|just a|checking|attention/i.test(t)) break;
        await page.waitForTimeout(2000);
      }
      await page.waitForTimeout(3500);
      for (let i = 0; i < 3; i++) { await page.mouse.wheel(0, 1400); await page.waitForTimeout(700); }
      const items = await page.evaluate((site) => {
        const pat = site === 'unsplash' ? /images\.unsplash\.com\/photo-/ : /images\.pexels\.com\/photos\//;
        return [...document.querySelectorAll('img')].filter((img) => pat.test(img.currentSrc || img.src)).map((img) => {
          const a = img.closest('a');
          return { href: a ? a.href : '', src: img.currentSrc || img.src, alt: img.alt };
        });
      }, site);
      console.log(site, q, 'title=', (await page.title()).slice(0, 60), 'imgs=', items.length);
      if (qi < 2) await page.screenshot({ path: `cand/_debug_${site}_${qi}.jpg`, type: 'jpeg', quality: 50 });
      const seen = new Set();
      let k = 0;
      for (const it of items) {
        if (k >= 10) break;
        if (/plus\.unsplash|premium/.test(it.src + it.href)) continue;
        const base = it.src.split('?')[0];
        if (seen.has(base)) continue;
        seen.add(base);
        const thumb = site === 'unsplash' ? base + '?w=420&q=60&fm=jpg' : base + '?auto=compress&w=420';
        if (await save(prefix, n, thumb, { q, source: site, page: it.href.split('?')[0], raw: base, alt: it.alt })) { n++; k++; }
      }
    } catch (e) { console.log(site, 'fail', q, String(e).slice(0, 120)); }
    await page.waitForTimeout(4000);
  }
  try {
    const r = await fetch(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license_type=commercial&page_size=6&aspect_ratio=wide&mature=false`, { headers: { 'user-agent': 'ehime-shuzen-desk-mockup/1.0' } });
    if (r.ok) {
      const j = await r.json();
      for (const it of j.results || []) {
        if (n >= 26) break;
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
