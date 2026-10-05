// photo-picks.txt で指定した写真を取得し、大小2サイズの JPEG（4:3）に変換して src/assets/photos/ に保存する（CI上で実行）。
// 出典・ライセンスは photos.json に記録し、ビルド時に写真クレジットページを生成する。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const lines = readFileSync('.github/reference/photo-picks.txt', 'utf8').split('\n').map((s) => s.trim()).filter((s) => s && !s.startsWith('#'));
mkdirSync('src/assets/photos', { recursive: true });
const manifest = {};
for (const line of lines) {
  const [name, source, page, url, creator, license, licenseUrl, gravity = 'center'] = line.split('|');
  const fetchUrl = source === 'pexels' ? url + '?auto=compress&cs=tinysrgb&w=2000' : url;
  const r = await fetch(fetchUrl, { headers: { 'user-agent': 'Mozilla/5.0 (ehime-shuzen-desk mockup)' } });
  if (!r.ok) { console.log('FAILED', name, r.status); process.exitCode = 1; continue; }
  const orig = `/tmp/${name}.orig`;
  writeFileSync(orig, Buffer.from(await r.arrayBuffer()));
  const ow = Number(execFileSync('identify', ['-format', '%w', orig + '[0]']).toString());
  const lw = Math.min(1600, ow);
  const sw = Math.min(800, lw);
  for (const [suffix, w] of [['l', lw], ['s', sw]]) {
    const h = Math.round(w * 0.75);
    execFileSync('convert', [orig + '[0]', '-auto-orient', '-strip', '-resize', `${w}x${h}^`, '-gravity', gravity, '-extent', `${w}x${h}`, '-interlace', 'Plane', '-sampling-factor', '4:2:0', '-quality', '76', `src/assets/photos/${name}-${suffix}.jpg`]);
  }
  manifest[name] = { lw, lh: Math.round(lw * 0.75), sw, source, page, creator, license, licenseUrl };
  console.log('ok', name, ow, '->', lw, sw);
}
writeFileSync('src/assets/photos/photos.json', JSON.stringify(manifest, null, 1) + '\n');
