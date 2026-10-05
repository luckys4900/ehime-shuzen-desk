# 売却前おまかせデスク（営業提案用モックアップ）

松山市周辺の小規模な不動産会社向けに、売却前の残置物・空室清掃・草刈り・小修繕を「写真を送って」まとめて相談できる外部窓口のサイトです。いつもの業者を置き換えるものではなく、2番手・3番手の相談先という位置づけです。

- 公開URL：https://luckys4900.github.io/ehime-shuzen-desk/
- ページ：トップ（案件相談フォームを含む）/ 協力事業者の募集 / 個人情報の取扱い / 写真クレジット
- 依存パッケージなしの静的サイト。`node build.mjs` で `dist/` を生成し、GitHub Actions で GitHub Pages に公開します。
- 設定：`site.config.json`（電話番号・フォーム送信先・GA4 は未設定。未設定の項目はサイトに出ません）
- フォームの受け側：`backend/google-apps-script/`（スプレッドシート保存・写真保存・通知メール・案件番号の採番）

## ドキュメント

| ファイル | 内容 |
|---|---|
| `docs/business-assumptions.md` | 事業者に確認が必要な前提・文言 |
| `docs/deployment.md` | 設定・公開・フォーム受け側の手順 |
| `docs/known-limitations.md` | 既知の制約と本番化の作業 |
| `docs/harness.md` | 評価ハーネスと検証方法 |
| `backend/google-apps-script/README.md` | Apps Script の設定手順 |
| `docs/screenshots/` | 主要ページのスクリーンショット |
| `docs/gpt-review/` | 外部AI（ChatGPT 等）でレビューするための依頼文とバンドル |
| `docs/reference-*.md` / `docs/audit-*.md` | v2（愛媛修繕デスク）制作時の参照分析と監査記録 |

## よく使うコマンド

```bash
node build.mjs                 # dist/ を生成（デモ：noindex）
node scripts/serve.mjs         # http://localhost:4173/ehime-shuzen-desk/
node scripts/qa.mjs            # ブラウザQA
node scripts/test-backend.mjs  # バックエンドの単体テスト
node scripts/make-review-bundle.mjs  # GPTレビュー用バンドルを再生成
```
