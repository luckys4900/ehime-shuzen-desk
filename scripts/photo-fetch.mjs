// photo-picks.txt で指定した写真を取得し、大小2サイズの JPEG（4:3）に変換して src/assets/photos/ に保存する（CI上で実行）。
// 出典・ライセンスは photos.json に記録し、ビルド時に写真クレジットページを生成する。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const lines = readFileSync('.github/reference/photo-picks.txt', 'utf8').split('\n').map((s) => s.trim()).filter((s) => s && !s.startsWith('#'));
import { rmSync } from 'node:fs';
rmSync('src/assets/photos', { recursive: true, force: true });
mkdirSync('src/assets/photos', { recursive: true });
const manifest = {};
for (const line of lines) {
  const [name, source, page, url, creator, license, licenseUrl, gravity = 'center', title = ''] = line.split('|');
  let fetchUrl = source === 'pexels' ? url + '?auto=compress&cs=tinysrgb&w=2000' : url;
  if (source === 'flickr') {
    // Flickr の写真ページから、より大きいサイズ（_k / _h）の画像URLを探す。見つからなければ _b（1024px）を使う
    try {
      const html = await (await fetch(page, { headers: { 'user-agent': 'Mozilla/5.0 (ehime-shuzen-desk mockup)' } })).text();
      const id = page.split('/').filter(Boolean).pop();
      const found = [...html.matchAll(new RegExp(`live\\.staticflickr\\.com\\\\?/\\d+\\\\?/${id}_[0-9a-f]+_(k|h)\\.jpg`, 'g'))].map((m) => m[0].replace(/\\\//g, '/'));
      const best = found.find((u) => u.endsWith('_k.jpg')) || found.find((u) => u.endsWith('_h.jpg'));
      if (best) fetchUrl = 'https://' + best;
      console.log(name, 'size candidates', found.length, best || '(none)');
    } catch (e) { console.log(name, 'page lookup failed', String(e).slice(0, 80)); }
  }
  const r = await fetch(fetchUrl, { headers: { 'user-agent': 'Mozilla/5.0 (ehime-shuzen-desk mockup)' } });
  if (!r.ok) { console.log('FAILED', name, r.status); process.exitCode = 1; continue; }
  const orig = `/tmp/${name}.orig`;
  writeFileSync(orig, Buffer.from(await r.arrayBuffer()));
  const [ow, oh] = execFileSync('identify', ['-format', '%w %h', orig + '[0]']).toString().trim().split(' ').map(Number);
  // 4:3 に切り抜いたときの幅を上限にし、元画像より拡大しない
  const lw = Math.min(1600, ow, Math.floor((oh * 4) / 3));
  const sw = Math.min(800, lw);
  for (const [suffix, w] of [['l', lw], ['s', sw]]) {
    const h = Math.round(w * 0.75);
    execFileSync('convert', [orig + '[0]', '-auto-orient', '-strip', '-resize', `${w}x${h}^`, '-gravity', gravity, '-extent', `${w}x${h}`, '-interlace', 'Plane', '-sampling-factor', '4:2:0', '-quality', '76', `src/assets/photos/${name}-${suffix}.jpg`]);
  }
  manifest[name] = { lw, lh: Math.round(lw * 0.75), sw, source, page, creator, license, licenseUrl, title };
  console.log('ok', name, ow, '->', lw, sw);
}
writeFileSync('src/assets/photos/photos.json', JSON.stringify(manifest, null, 1) + '\n');
