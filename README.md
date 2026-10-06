# 愛媛修繕デスク／売却前おまかせデスク（営業提案用サイト）

営業目的の異なる2つのサービスサイトを、1つの技術基盤（ビルド・フォーム・受け側・計測）で運営する構成です。どちらの事業モデルが案件化しやすいかを、営業現場で比較するためのものです。

| URL | サービス | 対象 |
|---|---|---|
| https://luckys4900.github.io/ehime-shuzen-desk/repair/ | 愛媛修繕デスク（第二施工店） | 管理会社・買取再販・店舗/施設運営など法人の建物修繕 |
| https://luckys4900.github.io/ehime-shuzen-desk/sale-support/ | 売却前おまかせデスク（第二の手配先） | 売却前の手配に困る小規模の不動産仲介会社 |
| https://luckys4900.github.io/ehime-shuzen-desk/ | 分岐ページ | 2つの窓口の案内のみ（営業では上の URL を直接送る） |

- 依存パッケージなしの静的サイト。`node build.mjs` で `dist/` を生成し、GitHub Actions で GitHub Pages に公開します。
- 設定：`site.config.json`（運営者情報・電話番号・フォーム送信先・GA4。未設定の項目はサイトに出ません）
- フォームの受け側：`backend/google-apps-script/`（2サイト共通。台帳の「サービス」列で判別）

## ソースの構成

| 場所 | 内容 |
|---|---|
| `build.mjs` | 2サイトの定義（名前・色・CTA・ナビ）と共通の組み立て |
| `src/sites/repair/` | 愛媛修繕デスクのページ（トップ・業種別3ページ）と個別部品（流れ・相談案内・フォームの質問） |
| `src/sites/sale/` | 売却前おまかせデスクのページと個別部品 |
| `src/partials/` | 共通部品（案件相談フォームの枠・本文中の相談導線） |
| `src/pages/` | 分岐ページ・協力事業者の募集・個人情報・写真クレジット・404 |
| `src/assets/main.js` / `style.css` | 共通のフォームエンジン・計測・UI／共通デザインシステム（色はサイトごとに切替） |

## ドキュメント

| ファイル | 内容 |
|---|---|
| `docs/sales-test.md` | 営業での URL の使い分け、流入元の付け方、比較する指標 |
| `docs/deployment.md` | 設定・公開・フォーム受け側の手順 |
| `docs/business-assumptions.md` | 事業者に確認が必要な前提・文言 |
| `docs/known-limitations.md` | 既知の制約と本番化の作業 |
| `docs/harness.md` | 評価ハーネスと検証方法 |
| `backend/google-apps-script/README.md` | Apps Script の設定手順と台帳の列 |
| `docs/screenshots/` | 主要ページのスクリーンショットと、旧v2・直前のv3・今回の2サイトの比較画像 |
| `docs/gpt-review/` | 外部AI（ChatGPT 等）でレビューするための依頼文とバンドル |

## よく使うコマンド

```bash
node build.mjs                 # dist/ を生成（デモ：noindex）
node scripts/serve.mjs         # http://localhost:4173/ehime-shuzen-desk/
node scripts/qa.mjs            # ブラウザQA
node scripts/test-backend.mjs  # バックエンドの単体テスト
node scripts/make-images.mjs   # OGP画像（サイトごと）を再生成
node scripts/make-review-bundle.mjs  # GPTレビュー用バンドルを再生成
```
