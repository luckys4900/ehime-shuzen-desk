// Playwright 補助：Google Fonts をプロキシ経由の curl で取得してブラウザへ渡す（検証環境用）
import { execFileSync } from 'node:child_process';
const cache = new Map();
export async function routeFonts(context) {
  await context.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, async (route) => {
    const url = route.request().url();
    try {
      if (!cache.has(url)) {
        const ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36';
        cache.set(url, execFileSync('curl', ['-sS', '--max-time', '20', '-A', ua, url], { maxBuffer: 1 << 26 }));
      }
      const body = cache.get(url);
      const ct = url.includes('googleapis') ? 'text/css' : 'font/woff2';
      await route.fulfill({ status: 200, body, headers: { 'content-type': ct, 'access-control-allow-origin': '*' } });
    } catch { await route.abort(); }
  });
}
