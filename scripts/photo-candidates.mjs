// Unsplash の検索結果（無料ライセンスのみ）から候補サムネイルと出典情報を取得（CI上で実行）
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const qs = readFileSync('.github/reference/photo-queries.txt', 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
mkdirSync('cand', { recursive: true });
const meta = [];
for (const [qi, q] of qs.entries()) {
  const r = await fetch(`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(q)}&per_page=20&orientation=landscape`, { headers: { 'user-agent': 'Mozilla/5.0', accept: 'application/json' } });
  if (!r.ok) { console.log('search failed', q, r.status); continue; }
  const j = await r.json();
  let n = 0;
  for (const p of j.results || []) {
    if (p.premium || p.plus || p.sponsorship) continue;
    if (n >= 12) break;
    const id = p.id;
    const img = await fetch(p.urls.raw + '&w=420&q=60&fm=jpg&fit=max');
    if (!img.ok) continue;
    const file = `cand/q${String(qi).padStart(2, '0')}_${String(n).padStart(2, '0')}_${id}.jpg`;
    writeFileSync(file, Buffer.from(await img.arrayBuffer()));
    meta.push({ q, file, id, slug: p.slug, w: p.width, h: p.height, alt: p.alt_description, user: p.user?.name, userUrl: p.user?.links?.html, page: p.links?.html, color: p.color });
    n++;
  }
  console.log(q, n);
}
writeFileSync('cand/meta.json', JSON.stringify(meta, null, 1));
