// ローカル検証用：dist/ を /ehime-shuzen-desk/ 配下で配信（GitHub Pages と同じパス構成）
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
const DIST = new URL('../dist/', import.meta.url).pathname;
const BASE = '/ehime-shuzen-desk/';
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };
export function serve(port = 4173) {
  return new Promise((resolve) => {
    const srv = createServer(async (req, res) => {
      const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (url === '/' ) { res.writeHead(302, { location: BASE }); return res.end(); }
      if (!url.startsWith(BASE)) return notFound(res);
      let p = join(DIST, url.slice(BASE.length));
      try {
        const s = await stat(p);
        if (s.isDirectory()) {
          if (!url.endsWith('/')) { res.writeHead(301, { location: url + '/' }); return res.end(); }
          p = join(p, 'index.html');
        }
        const body = await readFile(p);
        res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' });
        res.end(body);
      } catch { notFound(res); }
    });
    async function notFound(res) { res.writeHead(404, { 'content-type': TYPES['.html'] }); res.end(await readFile(join(DIST, '404.html'))); }
    srv.listen(port, () => resolve(srv));
  });
}
if (process.argv[1] === new URL(import.meta.url).pathname) serve().then(() => console.log('http://localhost:4173/ehime-shuzen-desk/'));
