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

## 写真の差し替え

1. `.github/reference/photo-picks.txt` に `用途名|出典|元ページURL|画像URL|撮影者|ライセンス|ライセンスURL|トリミング位置` を記載して push します。
2. ワークフロー `photo-fetch.yml` が写真を取得し、4:3 の大小2サイズ（最大1600px / 800px）に最適化して `src/assets/photos/` にコミットします。
3. 出典は `photos.json` に保存され、ビルド時に写真クレジットページ（/credits/）が自動生成されます。
4. 自社の現場写真を使う場合は、同じファイル名（`hero-l.jpg` など）で置き換え、`photos.json` の出典欄を更新してください。

## 本番運用に向けて

- `PRODUCTION=1 node build.mjs` でビルドすると、noindex と robots.txt の Disallow が外れ、sitemap が有効になります（ワークフローの `node build.mjs` に環境変数を追加）。

- フォーム送信：`src/assets/main.js` の `ENDPOINT` に送信先（フォームサービスや自社API）を設定し、`submitInquiry` を実装します。現在は `ENDPOINT = null` のため送信されず、「本番接続前」の案内を表示します。
- 独自ドメインを使う場合は、`build.mjs` の `SITE_URL` と 404 のパス書き換え（`/ehime-shuzen-desk/`）を変更してください。
