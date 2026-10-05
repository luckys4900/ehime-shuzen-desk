# デプロイ手順（deployment）

## 構成

- 依存パッケージなしの静的サイト。`node build.mjs` で `src/` から `dist/` を生成します。
- 各ルートは `dist/<route>/index.html`。リンクは相対パスのため、GitHub Pages のサブパス `/ehime-shuzen-desk/` でも動作します。
- `404.html` のみ、任意の階層で表示されるよう `/ehime-shuzen-desk/` からの絶対パスで出力します。
- `sitemap.xml`・`robots.txt`・`.nojekyll` もビルド時に生成します。

## 公開（GitHub Pages）

- 公開URL：https://luckys4900.github.io/ehime-shuzen-desk/
- ワークフロー：`.github/workflows/pages.yml`
  1. `deploy`：`main` または `main-9c3jqk` への push でビルドし、`dist/` を `gh-pages` ブランチへ公開します（peaceiris/actions-gh-pages）。
  2. `verify`：公開URLが今回のビルド（`<meta name="build">` のコミットSHA）を返すまで待ち、Playwright で全ルート×5ブレークポイントのQA（`scripts/qa.mjs`）を公開URLに対して実行します。スクリーンショットと結果は Actions の成果物 `live-qa` に保存されます。
- GitHub の Settings > Pages で、Source が「Deploy from a branch / gh-pages / (root)」になっていることを確認してください（初回のみ）。

## ローカル確認

```bash
node build.mjs
node scripts/serve.mjs          # http://localhost:4173/ehime-shuzen-desk/
node scripts/qa.mjs             # ローカルでQA（Playwright が必要）
node scripts/qa.mjs https://luckys4900.github.io/ehime-shuzen-desk/   # 公開URLでQA
node scripts/make-images.mjs    # OGP画像・apple-touch-icon を再生成
```

## 本番運用に向けて

- フォーム送信：`src/assets/main.js` の `ENDPOINT` に送信先（フォームサービスや自社API）を設定し、`submitInquiry` を実装します。現在は `ENDPOINT = null` のため送信されず、「本番接続前」の案内を表示します。
- 独自ドメインを使う場合は、`build.mjs` の `SITE_URL` と 404 のパス書き換え（`/ehime-shuzen-desk/`）を変更してください。
