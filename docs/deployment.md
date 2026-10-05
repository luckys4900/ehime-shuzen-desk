# デプロイ手順（deployment）

## 構成

- 依存パッケージなしの静的サイト。`node build.mjs` で `src/` から `dist/` を生成します。
- ページ：トップ（案件相談フォームを含む）/ 協力事業者の募集 / 個人情報の取扱い / 写真クレジット。旧ページ（/kanri /kaitori /shop /contact）はトップ（/contact は `#form`）へ転送するページを出力します。
- 設定は `site.config.json`。未設定（null）の項目はサイトに出ません。

| キー | 内容 | 未設定のとき |
|---|---|---|
| `phone` / `phoneHours` | 電話番号・受付時間 | 電話CTAを表示しない |
| `formEndpoint` | フォームの送信先（Google Apps Script のウェブアプリURL） | デモ動作（送信せず、その旨と案件番号の表示例を出す） |
| `ga4MeasurementId` | GA4 の測定ID（G-XXXX） | 計測タグを読み込まない |
| `casePrefix` | 案件番号の接頭辞（デモ表示用。実際の採番はバックエンドの `CASE_PREFIX`） | MAT |

## 公開（GitHub Pages）

- 公開URL：https://luckys4900.github.io/ehime-shuzen-desk/
- ワークフロー：`.github/workflows/pages.yml`
  1. `deploy`：`main` または `main-9c3jqk` への push でビルドし、`gh-pages` ブランチへ公開。
  2. `verify`：公開URLが今回のビルドを返すまで待ち、`scripts/qa.mjs` を公開URLに対して実行（成果物 `live-qa`）。

## フォームの受け側（Google Apps Script）

手順の詳細は `backend/google-apps-script/README.md`。概要：

1. Google ドライブで Apps Script プロジェクトを作成し、`Code.gs` と `appsscript.json` を貼り付ける。
2. `setup()` を1回実行（スプレッドシート「案件」「協力事業者」シートと写真フォルダを作成）。
3. スクリプトプロパティ `NOTIFY_EMAIL`（通知先）を設定。
4. 「ウェブアプリ」としてデプロイ（実行ユーザー：自分、アクセス：全員）。
5. 発行されたURLを `site.config.json` の `formEndpoint` に設定して push。

受け取った案件は、スプレッドシートに1行追加、写真は案件番号のフォルダへ保存、通知メールを送信し、案件番号をフォームへ返します。

## ローカル確認

```bash
node build.mjs
node scripts/serve.mjs          # http://localhost:4173/ehime-shuzen-desk/
node scripts/qa.mjs             # ブラウザQA（全ルート×6幅、フォーム、バックエンド結合、電話設定ビルド）
node scripts/test-backend.mjs   # Code.gs を模擬環境で単体テスト
node scripts/make-images.mjs    # OGP画像を再生成
```

## 写真の差し替え

`.github/reference/photo-picks.txt` を書き換えて push すると、`photo-fetch.yml` が取得・最適化し、写真クレジットを自動更新します。自社の現場写真は同じファイル名で置き換え、`photos.json` の出典を更新してください。

## 本番運用に向けて

- `PRODUCTION=1 node build.mjs` で noindex と robots.txt の Disallow を外します（ワークフローに環境変数を追加）。
- 独自ドメインを使う場合は `build.mjs` の `SITE_URL` と 404 のパスを変更してください。
