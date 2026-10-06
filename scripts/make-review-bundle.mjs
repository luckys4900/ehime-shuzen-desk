// 外部AI（ChatGPT 等）でレビューするための1ファイルのバンドルを生成する。
// 出力：docs/gpt-review/review-bundle.md（ドキュメント・ソース・QA結果をまとめたもの）
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const RAW = 'https://raw.githubusercontent.com/luckys4900/ehime-shuzen-desk/main/';
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

const sections = [
  ['概要', ['README.md']],
  ['評価基準と自動QAの結果', ['docs/harness.md', 'harness/qa-result.json']],
  ['事業前提・制約', ['docs/business-assumptions.md', 'docs/known-limitations.md']],
  ['営業テストと構成', ['docs/sales-test.md']],
  ['愛媛修繕デスク（src/sites/repair）', [...readdirSync(join(ROOT, 'src/sites/repair/pages')).map((f) => `src/sites/repair/pages/${f}`), ...readdirSync(join(ROOT, 'src/sites/repair/partials')).map((f) => `src/sites/repair/partials/${f}`)]],
  ['売却前おまかせデスク（src/sites/sale）', [...readdirSync(join(ROOT, 'src/sites/sale/pages')).map((f) => `src/sites/sale/pages/${f}`), ...readdirSync(join(ROOT, 'src/sites/sale/partials')).map((f) => `src/sites/sale/partials/${f}`)]],
  ['共通ページ・共通部品（src/pages, src/partials）', [...readdirSync(join(ROOT, 'src/pages')).map((f) => `src/pages/${f}`), ...readdirSync(join(ROOT, 'src/partials')).map((f) => `src/partials/${f}`)]],
  ['ビルド・設定・スクリプト', ['site.config.json', 'build.mjs', 'src/assets/main.js', 'scripts/qa.mjs']],
  ['フォームの受け側（Google Apps Script）', ['backend/google-apps-script/README.md', 'backend/google-apps-script/Code.gs', 'scripts/test-backend.mjs']],
  ['スタイル', ['src/assets/style.css']],
  ['写真の出典データ', ['src/assets/photos/photos.json']],
];
const fence = (p) => (p.endsWith('.md') ? null : p.split('.').pop().replace('mjs', 'js'));
let out = `# 愛媛修繕デスク／売却前おまかせデスク レビュー用バンドル\n\n生成日：${new Date().toISOString().slice(0, 10)}\n\n- 公開サイト：愛媛修繕デスク https://luckys4900.github.io/ehime-shuzen-desk/repair/ ／ 売却前おまかせデスク https://luckys4900.github.io/ehime-shuzen-desk/sale-support/\n- リポジトリ：https://github.com/luckys4900/ehime-shuzen-desk\n- このファイルは \`node scripts/make-review-bundle.mjs\` で生成しています。レビュー依頼文は \`docs/gpt-review/REVIEW_PROMPT.md\` です。\n\n## 目次\n`;
for (const [title, files] of sections) out += `- ${title}：${files.filter((f) => existsSync(join(ROOT, f))).join('、')}\n`;
out += `\n## スクリーンショット（画像URL）\n`;
for (const f of readdirSync(join(ROOT, 'docs/screenshots')).sort()) out += `- ${f}：${RAW}docs/screenshots/${f}\n`;
for (const [title, files] of sections) {
  out += `\n\n---\n\n# ${title}\n`;
  for (const f of files) {
    if (!existsSync(join(ROOT, f))) continue;
    const body = read(f);
    const lang = fence(f);
    out += `\n## ファイル：${f}\n\n`;
    out += lang ? '```' + lang + '\n' + body.replace(/```/g, '`​``') + '\n```\n' : body.replace(/^#/gm, '##') + '\n';
  }
}
writeFileSync(join(ROOT, 'docs/gpt-review/review-bundle.md'), out);
console.log('review bundle:', Math.round(out.length / 1024), 'KB');
