# 愛媛修繕デスク／売却前おまかせデスク レビュー用バンドル

生成日：2026-10-05

- 公開サイト：愛媛修繕デスク https://luckys4900.github.io/ehime-shuzen-desk/repair/ ／ 売却前おまかせデスク https://luckys4900.github.io/ehime-shuzen-desk/sale-support/
- リポジトリ：https://github.com/luckys4900/ehime-shuzen-desk
- このファイルは `node scripts/make-review-bundle.mjs` で生成しています。レビュー依頼文は `docs/gpt-review/REVIEW_PROMPT.md` です。

## 目次
- 概要：README.md
- 評価基準と自動QAの結果：docs/harness.md、harness/qa-result.json
- 事業前提・制約：docs/business-assumptions.md、docs/known-limitations.md
- 営業テストと構成：docs/sales-test.md
- 愛媛修繕デスク（src/sites/repair）：src/sites/repair/pages/index.html、src/sites/repair/pages/kaitori.html、src/sites/repair/pages/kanri.html、src/sites/repair/pages/shop.html、src/sites/repair/partials/cta.html、src/sites/repair/partials/flow.html、src/sites/repair/partials/form-step1.html、src/sites/repair/partials/form-step2.html、src/sites/repair/partials/form-step3.html
- 売却前おまかせデスク（src/sites/sale）：src/sites/sale/pages/index.html、src/sites/sale/partials/cta.html、src/sites/sale/partials/flow.html、src/sites/sale/partials/form-step1.html、src/sites/sale/partials/form-step2.html
- 共通ページ・共通部品（src/pages, src/partials）：src/pages/404.html、src/pages/credits.html、src/pages/hub.html、src/pages/partner.html、src/pages/privacy.html、src/partials/case-form.html、src/partials/ctaline.html
- ビルド・設定・スクリプト：site.config.json、build.mjs、src/assets/main.js、scripts/qa.mjs
- フォームの受け側（Google Apps Script）：backend/google-apps-script/README.md、backend/google-apps-script/Code.gs、scripts/test-backend.mjs
- スタイル：src/assets/style.css
- 写真の出典データ：src/assets/photos/photos.json

## スクリーンショット（画像URL）
- compare-firstview-desktop.png：https://raw.githubusercontent.com/luckys4900/ehime-shuzen-desk/main/docs/screenshots/compare-firstview-desktop.png
- compare-firstview-mobile.png：https://raw.githubusercontent.com/luckys4900/ehime-shuzen-desk/main/docs/screenshots/compare-firstview-mobile.png
- partner-mobile.png：https://raw.githubusercontent.com/luckys4900/ehime-shuzen-desk/main/docs/screenshots/partner-mobile.png
- repair-desktop.png：https://raw.githubusercontent.com/luckys4900/ehime-shuzen-desk/main/docs/screenshots/repair-desktop.png
- repair-mobile.png：https://raw.githubusercontent.com/luckys4900/ehime-shuzen-desk/main/docs/screenshots/repair-mobile.png
- sale-support-desktop.png：https://raw.githubusercontent.com/luckys4900/ehime-shuzen-desk/main/docs/screenshots/sale-support-desktop.png
- sale-support-mobile.png：https://raw.githubusercontent.com/luckys4900/ehime-shuzen-desk/main/docs/screenshots/sale-support-mobile.png
- top-desktop.png：https://raw.githubusercontent.com/luckys4900/ehime-shuzen-desk/main/docs/screenshots/top-desktop.png
- top-mobile.png：https://raw.githubusercontent.com/luckys4900/ehime-shuzen-desk/main/docs/screenshots/top-mobile.png


---

# 概要

## ファイル：README.md

## 愛媛修繕デスク／売却前おまかせデスク（営業提案用サイト）

営業目的の異なる2つのサービスサイトを、1つの技術基盤（ビルド・フォーム・受け側・計測）で運営する構成です。どちらの事業モデルが案件化しやすいかを、営業現場で比較するためのものです。

| URL | サービス | 対象 |
|---|---|---|
| https://luckys4900.github.io/ehime-shuzen-desk/repair/ | 愛媛修繕デスク（第二施工店） | 管理会社・買取再販・店舗/施設運営など法人の建物修繕 |
| https://luckys4900.github.io/ehime-shuzen-desk/sale-support/ | 売却前おまかせデスク（第二の手配先） | 売却前の手配に困る小規模の不動産仲介会社 |
| https://luckys4900.github.io/ehime-shuzen-desk/ | 分岐ページ | 2つの窓口の案内のみ（営業では上の URL を直接送る） |

- 依存パッケージなしの静的サイト。`node build.mjs` で `dist/` を生成し、GitHub Actions で GitHub Pages に公開します。
- 設定：`site.config.json`（運営者情報・電話番号・フォーム送信先・GA4。未設定の項目はサイトに出ません）
- フォームの受け側：`backend/google-apps-script/`（2サイト共通。台帳の「サービス」列で判別）

### ソースの構成

| 場所 | 内容 |
|---|---|
| `build.mjs` | 2サイトの定義（名前・色・CTA・ナビ）と共通の組み立て |
| `src/sites/repair/` | 愛媛修繕デスクのページ（トップ・業種別3ページ）と個別部品（流れ・相談案内・フォームの質問） |
| `src/sites/sale/` | 売却前おまかせデスクのページと個別部品 |
| `src/partials/` | 共通部品（案件相談フォームの枠・本文中の相談導線） |
| `src/pages/` | 分岐ページ・協力事業者の募集・個人情報・写真クレジット・404 |
| `src/assets/main.js` / `style.css` | 共通のフォームエンジン・計測・UI／共通デザインシステム（色はサイトごとに切替） |

### ドキュメント

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

### よく使うコマンド

```bash
node build.mjs                 # dist/ を生成（デモ：noindex）
node scripts/serve.mjs         # http://localhost:4173/ehime-shuzen-desk/
node scripts/qa.mjs            # ブラウザQA
node scripts/test-backend.mjs  # バックエンドの単体テスト
node scripts/make-images.mjs   # OGP画像（サイトごと）を再生成
node scripts/make-review-bundle.mjs  # GPTレビュー用バンドルを再生成
```



---

# 評価基準と自動QAの結果

## ファイル：docs/harness.md

## 評価ハーネス（harness）

### 実装進捗（implementation_percent）

| 区分 | 配点 | 判定基準 |
|---|---|---|
| Routes | 20 | / /repair/ /repair/kanri/ /repair/kaitori/ /repair/shop/ /sale-support/ /partner/ /privacy/ /credits/ が200、旧ルートは転送 |
| Components | 10 | ヘッダー・フッター・CTA・FAQ・フロー等の共通部品 |
| Content | 15 | 要件の全セクション、捏造なしの本文 |
| Responsive | 15 | 390/430/768/1024/1440 で横スクロールなし |
| Nav-CTA | 10 | グローバルナビ・モバイルナビ・各CTAが機能 |
| Contact | 10 | 3段階フォーム・必須項目・写真・下書き保持・案件番号・受け側への到達 |
| Tech | 10 | meta/OGP/favicon/sitemap/robots/404/a11y |
| Deploy | 10 | 公開URLで表示・検証済み |

SITE_IMPLEMENTATION_70 = 上記合計 70 以上。

### 品質スコア（Harness Score）

| カテゴリ | 配点 | 最低ライン |
|---|---|---|
| Visual | 20 | 15 |
| Reference Fidelity | 15 | — |
| Conversion | 20 | 15 |
| Credibility | 15 | — |
| Mobile | 15 | 12 |
| Technical | 10 | 8 |
| Copy | 5 | — |

合格条件：合計 80 以上、各最低ラインを満たし、HARD_FAIL = 0。

### HARD_FAIL 条件

- 架空の実績・顧客・レビュー・件数・資格・許認可・沿革・スタッフ・拠点・対応スピード・保証・24時間対応の掲載
- 資格が必要な工事を、無資格でも受注・施工できると誤認させる記述
- プレースホルダ・ダミー情報（架空の電話番号等）
- 必須ルートの404、横スクロール、フォームが機能しない

### 検証方法

- 自動：`scripts/qa.mjs`（Playwright。全ルート×6幅の横はみ出し、コンソールエラー、リンク切れ、alt・ラベル、meta、h1、タップ領域、ダミー文字列、モバイルナビ、Escキー、フォーム検証、エラー要約のライブ更新、写真の形式チェック、送信分離、送信先を擬似的に接続した場合の成功・サーバーエラー・通信失敗・二重送信・写真の持ち越し、電話番号の正規化、スキップリンク、404とそのリンク、再読み込み時のスクロール位置、行末1〜2文字の泣き別れ）
- 自動（v3 追加）：3段階フォームの段階ごとの検証、下書きの復元、電話またはメールの必須、写真10枚上限、計測イベントの発火、モバイル固定CTAがフォームを覆わないこと、Code.gs を模擬環境で動かした結合テスト（スプレッドシート行・写真・通知メール・案件番号の表示）、電話番号を設定したビルドでの電話CTA表示。`scripts/test-backend.mjs` で Code.gs の単体テスト
- 自動（2サイト化で追加）：/repair/ と /sale-support/ それぞれのヒーローH1・CTA・必須の立ち位置の文言・相手サイトの文言が混ざっていないこと、両サイトからの送信が同じ受け側の台帳に「サービス」列付きで保存されること、計測イベントの `site_type`、分岐ページの2サイトへのリンク、旧URLの転送先。業種別ページは 390px と 1440px のみで表示崩れを確認
- 独立監査：制作に関与していない Claude subagent が REJECT 権限付きで採点（`audit-round*.md`、最終結果は `audit-final.md`）
- 公開URL：GitHub Actions の `verify` ジョブで同じQAを公開URLに対して実行


## ファイル：harness/qa-result.json

```json
{
  "base": "http://localhost:4173/ehime-shuzen-desk/",
  "date": "2026-10-05T23:44:23.180Z",
  "checks": [
    "/ @390: no horizontal overflow",
    "repair/ @390: no horizontal overflow",
    "sale-support/ @390: no horizontal overflow",
    "partner/ @390: no horizontal overflow",
    "privacy/ @390: no horizontal overflow",
    "credits/ @390: no horizontal overflow",
    "repair/kanri/ @390: no horizontal overflow",
    "repair/kaitori/ @390: no horizontal overflow",
    "repair/shop/ @390: no horizontal overflow",
    "/ @430: no horizontal overflow",
    "repair/ @430: no horizontal overflow",
    "sale-support/ @430: no horizontal overflow",
    "partner/ @430: no horizontal overflow",
    "privacy/ @430: no horizontal overflow",
    "credits/ @430: no horizontal overflow",
    "/ @768: no horizontal overflow",
    "repair/ @768: no horizontal overflow",
    "sale-support/ @768: no horizontal overflow",
    "partner/ @768: no horizontal overflow",
    "privacy/ @768: no horizontal overflow",
    "credits/ @768: no horizontal overflow",
    "/ @1024: no horizontal overflow",
    "repair/ @1024: no horizontal overflow",
    "sale-support/ @1024: no horizontal overflow",
    "partner/ @1024: no horizontal overflow",
    "privacy/ @1024: no horizontal overflow",
    "credits/ @1024: no horizontal overflow",
    "/ @1240: no horizontal overflow",
    "repair/ @1240: no horizontal overflow",
    "sale-support/ @1240: no horizontal overflow",
    "partner/ @1240: no horizontal overflow",
    "privacy/ @1240: no horizontal overflow",
    "credits/ @1240: no horizontal overflow",
    "/ @1440: no horizontal overflow",
    "repair/ @1440: no horizontal overflow",
    "sale-support/ @1440: no horizontal overflow",
    "partner/ @1440: no horizontal overflow",
    "privacy/ @1440: no horizontal overflow",
    "credits/ @1440: no horizontal overflow",
    "repair/kanri/ @1440: no horizontal overflow",
    "repair/kaitori/ @1440: no horizontal overflow",
    "repair/shop/ @1440: no horizontal overflow",
    "internal links checked: 12",
    "sitemap.xml 200",
    "robots.txt 200",
    "assets/og.png 200",
    "assets/og-repair.png 200",
    "assets/og-sale.png 200",
    "assets/favicon.svg 200",
    "assets/apple-touch-icon.png 200",
    "404 returns 404",
    "reload keeps scroll position with #hash",
    "404 links are all absolute",
    "mobile nav opens",
    "mobile nav closes with Escape",
    "mobile nav anchor jumps to section and closes menu",
    "demo robots.txt disallows indexing",
    "old URL kanri/ -> repair/kanri/",
    "old URL kaitori/ -> repair/kaitori/",
    "old URL shop/ -> repair/shop/",
    "old URL contact/ -> repair/#form",
    "old URL contact/?type=kanri -> repair/?seg=kanri#form",
    "old URL #form -> sale-support/#form",
    "hub page links to /repair/ and /sale-support/ (no form on the hub)",
    "repair: no banned / unsupported wording",
    "repair: hero H1 and CTA \"修繕案件を相談する\"",
    "repair: positioning copy present, other service's wording absent",
    "repair: CTAs to the form: 5",
    "repair: no phone CTA while phone is not configured",
    "sale: no banned / unsupported wording",
    "sale: hero H1 and CTA \"写真を送って案件相談\"",
    "sale: positioning copy present, other service's wording absent",
    "sale: CTAs to the form: 6",
    "sale: no phone CTA while phone is not configured",
    "hero CTA scrolls to the form",
    "sticky CTA hides while the form is on screen",
    "step 1 requires a service, error under field",
    "moves to step 2 on the same page",
    "6 photos previewed (multi-select), non-photo rejected",
    "photo cap of 10 enforced with message",
    "step 2 requires area",
    "draft restored after reload (step, text, checkboxes, select)",
    "either phone or email is required",
    "email format checked",
    "demo mode: honest not-sent message with case number format example",
    "event fired with site_type=sale_support: hero_cta_click",
    "event fired with site_type=sale_support: form_start",
    "event fired with site_type=sale_support: service_select",
    "event fired with site_type=sale_support: photo_upload",
    "event fired with site_type=sale_support: form_submit",
    "event fired: sticky_cta_click",
    "one request per submit (double submit guarded)",
    "sale payload: business_line=sale_support, entry (utm), all fields, services array, 2 compressed photos, normalized phone",
    "photo compressed before sending (~138KB base64)",
    "case number from backend shown after submit",
    "draft cleared after successful send",
    "server error: message shown, photos kept, button re-enabled",
    "backend {ok:false} is not treated as success",
    "network failure message shown",
    "contract: both sites land in the same sheet, told apart by サービス (sale_support / repair_desk); seg preset and utm entry saved",
    "contract: photos from both sites saved per case folder in Drive",
    "contract: notification mail subject names the service",
    "contract: case numbers issued by the shared backend are shown on each site",
    "event fired with site_type=repair: hero_cta_click",
    "event fired with site_type=repair: form_start",
    "event fired with site_type=repair: photo_upload",
    "event fired with site_type=repair: form_submit",
    "phone build: tel links shown (4) incl. sticky 電話で相談",
    "event fired with site_type=sale_support: phone_click",
    "event fired with site_type=repair: phone_click",
    "partner form validation 7",
    "header transparent on hero, solid after scroll",
    "partner mobile CTA goes to #entry",
    "skip link visible on focus"
  ],
  "failures": []
}
```


---

# 事業前提・制約

## ファイル：docs/business-assumptions.md

## 事業前提と要確認事項（business-assumptions）

対象：2つのサービスサイト（2026-10-05 に分離）
- 愛媛修繕デスク（`/repair/`）：法人・事業者向けの建物修繕の第二施工店。v2（9271f78）を復元
- 売却前おまかせデスク（`/sale-support/`）：不動産会社向けの売却前の手配窓口

下の「1〜4」は売却前おまかせデスク、末尾の節は愛媛修繕デスクの要確認事項です。運営者情報・電話番号・個人情報の取扱いは両サイト共通（`site.config.json` の `operator`）。

本サイトは営業提案用のモックアップです。掲載している文言のうち、**事業者による事実確認が必要なもの**を以下にまとめます。本番公開前に、各項目を「事実」「方針として採用」「削除」のいずれかに確定してください。

### 1. 位置づけ（売却前おまかせデスク）

- 対象：松山市周辺の小規模な不動産会社（1〜5名程度、相続物件・空き家・売却前物件を扱い、自社に作業班を持たない会社）。BtoC ではない。
- 役割：売却前の残置物・空室清掃・草刈り・小修繕を、写真から内容整理し、対応できる事業者を確認・手配する**外部窓口**。いつもの業者の置き換えではなく、2番手・3番手の相談先。
- 自社で作業を行う会社ではない（考え方の欄に明記）。
- サイト上の呼び方：「第二の手配先」（v2 の「第二施工店」を不動産売買向けに言い換え）。ブランドの中心は「売却前の現場手配・調整」で、残置物・清掃・草刈り・小修繕はその中のカテゴリ。

### 2. 掲載していないもの（捏造禁止ポリシーにより意図的に不掲載）

| 項目 | 状態 | 本番で必要な対応 |
|---|---|---|
| 運営者情報・所在地 | 不掲載（フッターに「本番公開時に掲載」） | 運営主体を確定して掲載 |
| 電話番号・受付時間 | 不掲載。`site.config.json` の `phone` が null の間は電話CTAを一切表示しない | 実在の番号を設定すると、ヘッダー・ヒーロー・モバイル固定バー・フッターに自動表示 |
| 作業事例・件数・お客様の声 | 不掲載。代わりに「ご相談例」（相談の流れの例）を掲載し、架空の事例でないことを明記 | 実案件の写真・掲載許諾が揃ったら追加 |
| 許認可・資格 | 不掲載 | 運営主体・協力事業者が保有するものを確認のうえ掲載可 |
| 対応スピード・24時間・保証・最安 | 不掲載 | 実際の運用で守れる範囲のみ条件付きで |
| 料金表・相場 | 不掲載（「作業の前に見積をご案内」のみ） | 価格提示の方針を決める |

### 3. 掲載しているが、事業方針として確認が必要な記述

| 記述（掲載箇所） | 確認ポイント |
|---|---|
| 「相談無料」（ヒーロー、CTA、フッター） | 現地確認・見積に費用が発生しないか |
| 「松山市・近郊対応」／FAQ「松山市・松前町・伊予市・東温市・砥部町を中心とした近郊」 | 協力事業者の移動範囲と整合しているか |
| 「いつもの業者はそのまま」「業者変更は不要」（ヒーロー、概要の帯、考え方の欄、関係図、FAQ） | 既存取引先と競合しない営業方針で問題ないか |
| 「お引き受けしていない内容」：御社の取引先に代わる継続的な工事の受注／解体工事・大規模なリフォーム・増改築／夜間・休日の緊急駆け付け／許可・資格を持つ事業者を手配できない作業（考え方の欄） | 実際の方針に合わせて確定 |
| 「小さすぎて頼みにくい案件」「1つだけでも」（こんな時に・対応内容・FAQ） | 最低受注金額・出張費の有無 |
| 「写真を送れば内容整理から手配まで」 | 写真の確認・回答を誰が行うか、回答の目安 |
| 廃棄物：許可を有する事業者へ手配（サービス欄・FAQ） | 一般廃棄物収集運搬（市町村許可）・産業廃棄物・古物商の確認手順。デスク自身が収集運搬を受託する形にしない契約構成 |
| 資格が必要な作業は有資格の事業者が担当する場合に限る | 電気工事士・指定給水装置工事事業者等の確認手順 |
| 「作業の前に見積をご案内し、確認後に手配」（FAQ・利用の流れ） | 見積書の書式、契約・請求の主体（デスク／協力事業者） |
| 「不動産会社以外でも、案件の内容によっては対応」（FAQ）／「不動産会社様向けの窓口です」（相談案内・フォーム） | 個人の相談を受けるか。受けない場合は FAQ の回答を「個人の方からのご依頼はお受けしていません」に変更（独立レビューで信頼感が上がると指摘） |
| 写真：最大10枚、送信前に長辺1600pxへ縮小（フォーム） | 受け側の保存容量 |
| 個人情報の取扱い（/privacy の記載案） | 運営者・窓口・保管期間を確定し、法務確認 |

### 4. フォーム項目の決定

- 3段階（同一ページ）：①相談内容 → ②物件と写真 → ③連絡先。戻っても入力は保持し、ブラウザに下書きを保存（送信成功で削除）。
- 必須：相談内容（複数選択）、物件エリア、会社名、担当者名、電話番号またはメールアドレスのどちらか。
- 任意：住所、物件種別、現在の状況、希望時期、写真（最大10枚）、補足。
- 根拠：依頼書の必須・任意の指定に従った。入力の負担を下げるため、物件エリア以外の物件情報は任意。
- 送信後に案件番号（例：MAT-20261005-001）を表示。番号はバックエンドが日付ごとの連番で採番する。

### 愛媛修繕デスク（/repair/）：事業方針として確認が必要な記述（v2 から引き継ぎ）

| 記述（掲載箇所） | 確認ポイント |
|---|---|
| 「法人・事業者様専用の修繕相談窓口」（TOP MICRO TRUST、FAQ） | 個人からの依頼を受けない方針でよいか |
| 主な対応エリア：松山市・松前町・伊予市・東温市・砥部町／今治市は案件内容・工事規模により対応（TOP・フッター・フォーム） | 施工パートナーの所在地・移動範囲と整合しているか |
| 「いつもの施工会社と併用いただけます」（TOP） | 既存取引先と競合しない営業方針で問題ないか |
| 「1か所だけの小修繕でもご相談いただけます」（FAQ・SERVICES） | 最低受注金額・出張費の有無 |
| 「写真で内容が判断できる場合は、写真をもとに見積をご案内」（FAQ） | 写真見積の運用可否 |
| 「費用が発生する可能性がある場合は、作業前に説明・了承を得てから進める」（FAQ） | 現地調査費・見積費の扱い |
| 「完了時に施工後の状況を写真で報告」（FLOW・/repair/kanri） | 施工パートナーとの契約で写真報告を義務化できるか |
| 「工事内容と金額の内訳を提示」（FLOW・/repair/kanri・/repair/kaitori） | 見積書の書式 |
| 「お引き受けできない場合は、判断がつき次第連絡」（TOP） | 回答期限の社内ルール |
| 「工事内容・金額・日程・支払条件は着手前に書面で確認」（/partner） | 協力会社との発注書・契約書の運用 |
| 相談可能な工種例（TOP SERVICES、/partner 募集工種） | 実際に施工パートナーを確保できる工種に絞る |
| 資格が必要な工事は有資格の施工パートナーのみ（SERVICES、FAQ、/partner） | 電気工事士・指定給水装置工事事業者・建設業許可の確認手順 |
| 写真アップロード：最大10枚・1枚10MB・JPEG/PNG/HEIC/WebP/PDF（/repair/ のフォーム） | 本番フォームサービスの容量制限に合わせる |
| 「お引き受けしていない内容」：個人のお客様、新築・大規模な増改築、夜間・休日の緊急駆け付け、資格者を手配できない工事（TOP・/contact）／間取り変更を伴う大規模リノベーション、構造に関わる工事、設計・確認申請が必要な工事（/repair/kaitori） | 実際の対応範囲に合わせて確定 |
| 「見積の際に、契約・請求の相手先と施工の責任範囲を書面でお示しします」（TOP FAQ） | 契約主体（デスク／施工パートナー）を確定し、本番では具体的に記載 |
| 「担当者からメールまたはお電話でご連絡します」（/repair/ のフォーム・CTA） | 連絡手段の運用 |
| 「施工後の状況を写真でお伝えすることを基本としています」（/repair/kanri）、FLOW「施工後の状況を写真でお伝えし」 | 施工パートナーとの取り決め |
| 個人情報の取扱い（/privacy の記載案） | 運営者・窓口・保管期間を確定し、法務確認のうえ掲載 |
| 入居者様との日程調整は管理会社様経由が基本（/repair/kanri FAQ） | 運用方針 |
| 「御社のお取引先への営業や、取引の切り替えのご提案」をお引き受けしていない内容に記載（/repair/ CONCEPT） | 既存取引先と競合しない方針を、運用でも守れるか |
| 「普段の工事は、いつもの施工会社へ。手が回らない時だけ、愛媛修繕デスクへ。」（/repair/ CONCEPT） | 営業メッセージとして採用するか |
| フォームの「普段の施工会社で対応できない理由」「緊急度」「業種」 | 案件の優先順位づけに使う項目として妥当か |



## ファイル：docs/known-limitations.md

## 既知の制約（known-limitations）

### 制作環境に起因するもの

1. **写真はすべてライセンス素材のイメージ写真です。** ヒーローの室内写真（v2 から再利用）と空き家の写真は Flickr の CC BY 2.0 写真、最後の相談案内の写真は Pexels License。空き家の写真は「ご相談時の状態のイメージ」としてご相談例にだけ使っています。各写真に「写真はイメージです」と表示し、出典は /credits/ に掲載。本番では自社の現場写真（掲載許諾済み）への差し替えを推奨します。
2. **公開URLは制作環境から直接開けないため、GitHub Actions の `verify` ジョブで検証しています。**
3. **バックエンド（Google Apps Script）は実際の Google 環境ではまだ動かしていません。** `Code.gs` は Google のサービスを模したオブジェクト上で単体テスト（`scripts/test-backend.mjs`）し、さらにブラウザQAでフォームの実際の送信内容をそのまま `doPost` に渡す結合テストを行っています。デプロイ後に README の手順で実地確認が必要です。

### 機能上の制約（未設定であることによるもの）

4. **2サイトとも、フォームは送信されません（`formEndpoint` 未設定）。** 送信ボタンを押すと「送信されていません」と明示し、受付番号の表示例を示します。
5. **電話CTA・運営者情報はありません（`operator` 未設定）。** 架空の番号・会社名は入れていません。`site.config.json` の `operator.phone` 等を設定すると、両サイトに自動で表示されます（QAで確認済み）。
6. **アクセス解析は未導入（`ga4MeasurementId` 未設定）。** イベント（hero_cta_click / cta_click / sticky_cta_click / form_start / service_select / photo_upload / form_submit / phone_click / hub_select）は実装済みで、すべてに `site_type`（repair / sale_support）が付きます。ID 設定後に GA4 へ送られます。GA4 側で `site_type` をカスタムディメンションに登録する作業が必要です。
7. **運営者情報がなく、個人情報の取扱いは記載案です。**
8. **自動返信メール・reCAPTCHA はありません。** スパム対策は隠し項目（honeypot）とバックエンドの入力検証のみ。
9. **写真は送信前にブラウザで長辺1600pxの JPEG に縮小します。** 縮小できない形式（一部の HEIC 等）は元のまま送るため、Apps Script の受信上限（約50MB）に注意が必要です。
10. **デモ環境は検索エンジンに載らない設定です（noindex）。**
11. **2サイトは同じドメインのサブディレクトリです。** 独立したドメインで運用する場合は、`build.mjs` の `SITE_URL` とサイトの `slug` を見直してください。
12. **愛媛修繕デスクの業種別ページ（/repair/kanri/ 等）は v2 の内容をそのまま復元しています。** 本文の約束事項（写真での完了報告、見積の内訳など）は `business-assumptions.md` の要確認事項です。

### 本番化で必要な作業

- `docs/deployment.md` の「フォームの受け側」を実施し、`formEndpoint` を設定
- 運営者情報・電話番号・受付時間・個人情報の取扱いの確定
- `business-assumptions.md` の要確認事項の確定（相談無料、エリア、廃棄物の許可の扱い等）
- GA4 の測定ID設定（任意）、実際の写真への差し替え、`PRODUCTION=1`



---

# 営業テストと構成

## ファイル：docs/sales-test.md

## 営業テストの進め方（2つの事業仮説の比較）

このサイトは、営業目的の異なる2つのサービスを、1つの技術基盤で同時に市場テストするための構成です。

| | 愛媛修繕デスク | 売却前おまかせデスク |
|---|---|---|
| URL | https://luckys4900.github.io/ehime-shuzen-desk/repair/ | https://luckys4900.github.io/ehime-shuzen-desk/sale-support/ |
| 送る相手 | 賃貸管理会社・買取再販事業者・店舗/施設運営会社・法人の建物管理担当者 | 小規模の不動産仲介会社（売買仲介中心・相続物件・空き家・中古住宅） |
| 仮説 | いつもの施工会社が手いっぱいの時の「第二施工店」 | 売却前の細かな手配をまとめて投げられる「第二の手配先」 |
| 業種別ページ | `/repair/kanri/`（管理会社）`/repair/kaitori/`（買取再販）`/repair/shop/`（店舗・施設） | なし（トップ1ページ） |
| 台帳の「サービス区分」 | `repair_desk` | `sale_support` |
| GA の `site_type` | `repair` | `sale_support` |

分岐ページ（`/`）は案内用です。営業では、相手に合わせて上の URL を直接送ってください。

### 送るURLに印を付ける（任意・推奨）

URL の末尾に `utm_*` または `ref` を付けると、そのURLから来た相談の「流入元」列に記録されます。

```
https://luckys4900.github.io/ehime-shuzen-desk/sale-support/?utm_source=mail&utm_campaign=2026-10-matsuyama&ref=company-a
https://luckys4900.github.io/ehime-shuzen-desk/repair/kanri/?utm_source=visit&utm_campaign=2026-10-kanri
```

- 記録されるのは、そのブラウザで最初に開いたURLの値です（同じタブ内でページを移動しても保持）。
- 個人名など個人情報はURLに入れないでください（会社ごとの記号程度にとどめます）。

### 比較する指標

| 指標 | どこで見るか |
|---|---|
| 営業送付数 | 営業側の記録（送付リスト）。URL の `utm_campaign` / `ref` と対応させる |
| LP訪問 | GA4（測定ID設定後）：ページビュー（`/repair/` 配下 と `/sale-support/`） |
| CTAクリック | GA4：`hero_cta_click` / `cta_click` / `sticky_cta_click`（`site_type` で分ける） |
| フォーム開始 | GA4：`form_start` |
| 写真の添付 | GA4：`photo_upload` |
| フォーム送信 | GA4：`form_submit`／台帳の行数（「サービス」列で分ける） |
| 電話 | GA4：`phone_click`（電話番号を設定した場合） |
| 見積化・成約・成約金額・粗利・再依頼 | 台帳の「見積日」「見積金額」「成約」「成約金額」「粗利」「再依頼」列に人が記入 |

すべての計測イベントには `site_type`（`repair` / `sale_support`）と `business_line`（`repair_desk` / `sale_support`）が付きます。GA4 では、管理画面の「カスタム定義」で `site_type` をイベント単位のカスタムディメンションとして登録すると、レポートで2サイトを分けて見られます。

### 注意

- 案件番号は2サイト共通の連番です（どちらのサイトかは番号ではなく「サービス」列で判断します）。
- 2つのサイトの本文・ヘッダー・フッターは、互いのサイトへリンクしていません（比較を混ぜないため）。両方を案内するのは分岐ページ（`/`）と共通ページ（協力事業者の募集・個人情報の取扱い・写真クレジット）だけです。



---

# 愛媛修繕デスク（src/sites/repair）

## ファイル：src/sites/repair/pages/index.html

```html
<section class="hero" aria-labelledby="hero-title">
  {{photo:hero|木の壁と無垢材の床の明るい室内|hero__bg|-|eager}}
  <div class="container hero__inner">
    <p class="hero__eyebrow">松山周辺の法人・事業者様向け<span class="br-pc">　</span><br class="br-sp">建物修繕の相談窓口</p>
    <h1 class="hero__title" id="hero-title">いつもの施工会社を<br>変える必要は<br class="br-sp">ありません。</h1>
    <p class="hero__lead">手が回らない時、頼みたい工種の手配先がない時の「もう一つの相談先」として。写真と物件情報から建物修繕のご相談を受け付け、案件ごとに対応できる施工パートナーを手配します。</p>
    <div class="btn-row hero__actions">
      <a class="btn btn--primary" href="#form" data-track="hero_cta_click">{{cta_label}}</a>
      <a class="more more--light" href="#flow">ご相談の流れ</a>
    </div>
    <p class="hero__sub">{{cta_sub}}</p>
    {{phone_cta}}
  </div>
  <div class="hero__foot">
    <div class="container hero__foot-inner">
      <span class="hero__foot-label">業種別のご案内</span>
      <ul class="hero__segs">
        <li><a href="{{site}}kanri/">管理会社様</a></li>
        <li><a href="{{site}}kaitori/">買取再販事業者様</a></li>
        <li><a href="{{site}}shop/">店舗・施設運営者様</a></li>
      </ul>
      <span class="photo__cap photo__cap--dark">写真はイメージです</span>
    </div>
  </div>
</section>

<section class="facts" aria-label="サービスの概要">
  <div class="container">
    <ul class="facts__list">
      <li class="facts__item"><span class="facts__k">対象</span><span class="facts__v">法人・事業者様専用の<br>修繕相談窓口</span></li>
      <li class="facts__item"><span class="facts__k">相談方法</span><span class="facts__v">写真と物件情報を<br>フォームから送信</span></li>
      <li class="facts__item"><span class="facts__k">主な対応エリア</span><span class="facts__v">松山市・松前町・伊予市<br>東温市・砥部町</span></li>
      <li class="facts__item"><span class="facts__k">ご利用の形</span><span class="facts__v">いつもの施工会社と<br>ご併用いただけます</span></li>
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="intro-title">
  <div class="container intro">
    <div>
      <span class="eyebrow">ABOUT</span>
      <h2 class="intro__title" id="intro-title">手が足りない時の、<br>もう一つの修繕窓口。</h2>
    </div>
    <div>
      <p class="intro__lead">普段の修繕は、いつもの施工会社で回っている。<br class="br-pc">それでも、時期や工種によっては<br class="br-pc">手配先に困る場面があります。</p>
      <p class="intro__body">愛媛修繕デスクは、松山周辺の管理会社様・買取再販事業者様・店舗や施設の運営者様から、建物修繕のご相談を受け付ける窓口です。写真と物件情報をもとに内容を確認し、工種・規模・時期に合う施工パートナーの手配を調整したうえで、見積と工程をご案内します。</p>
      <p class="intro__note">ご相談の窓口は愛媛修繕デスクがお受けし、施工は案件ごとに手配する施工パートナーが担当します。</p>
    </div>
  </div>
</section>

<section class="section section--paper" aria-labelledby="problem-title">
  <div class="container">
    <div class="sec-head sec-head--split">
      <div>
        <span class="eyebrow">CASE</span>
        <h2 class="sec-title" id="problem-title">こんな時にご相談ください</h2>
      </div>
      <p class="sec-lead">修繕のすべてをお任せいただく必要はありません。手配に困った案件だけのご相談を想定しています。</p>
    </div>
    <ol class="problems">
      <li><span class="problems__no">01</span><div><h3>いつもの施工会社が繁忙期で手が回らない</h3><p>退去が重なる時期に、着工まで時間がかかると言われた。</p></div></li>
      <li><span class="problems__no">02</span><div><h3>頼みたい工種に対応できる会社がいない</h3><p>内装は頼めるが、建具や外まわりなど別の工種の手配先がない。</p></div></li>
      <li><span class="problems__no">03</span><div><h3>小さな修繕の相談先が見つからない</h3><p>1か所だけの補修など、規模の小さい工事をどこに頼めばいいか分からない。</p></div></li>
      <li><span class="problems__no">04</span><div><h3>オーナー様へ写真付きで報告したい</h3><p>施工前と完了後の状況を、写真で説明できる形で残したい。</p></div></li>
      <li><span class="problems__no">05</span><div><h3>すぐに現地へ行く時間が取れない</h3><p>まずは写真で状況を共有し、現地確認が必要かどうかから相談したい。</p></div></li>
      <li><span class="problems__no">06</span><div><h3>引渡しや営業開始の日程が決まっている</h3><p>販売開始や営業再開の日程に合わせて、工程を相談しながら進めたい。</p></div></li>
    </ol>
  </div>
</section>

<section class="section" id="concept" aria-labelledby="concept-title">
  <div class="container">
    <div class="overlap">
      {{photo:washitsu|障子窓のある、畳敷きの明るい和室|overlap__photo}}
      <div class="overlap__panel">
        <span class="eyebrow">CONCEPT</span>
        <h2 id="concept-title">「第二施工店」<br>という考え方。</h2>
        <p class="overlap__msg">普段の工事は、いつもの施工会社へ。<br>手が回らない時だけ、愛媛修繕デスクへ。</p>
        <p>愛媛修繕デスクは、御社の取引先に置き換わるものではありません。繁忙期や、工種が合わない案件、小さな修繕のときに使っていただく、もう一つの相談先です。</p>
        <p>ご相談は愛媛修繕デスクが受け付け、施工パートナーの手配を調整します。愛媛修繕デスクが自社で施工する形ではありません。</p>
      </div>
    </div>
    <div class="concept-detail">
      <div>
        <h3>いつもの取引先との関係</h3>
        <div class="rel" role="img" aria-label="関係図：御社は、普段の工事をこれまで通りいつもの施工会社に依頼し、繁忙時・対応外の工種・小修繕だけを愛媛修繕デスクへ相談します。愛媛修繕デスクは案件ごとに対応できる施工パートナーを手配します。">
          <div class="rel__you">御社<small>管理会社・買取再販・店舗施設</small></div>
          <div class="rel__lines" aria-hidden="true"><span class="rel__solid"></span><span class="rel__dash"></span></div>
          <div class="rel__pair">
            <div class="rel__usual-col"><div class="rel__box"><small>普段の工事</small>いつもの施工会社</div><p class="rel__usual-note">普段の修繕は、引き続き<br>いつもの施工会社へ</p></div>
            <div class="rel__desk-col">
              <div class="rel__box rel__box--desk"><small>繁忙時・対応外工種・小修繕</small>愛媛修繕デスク</div>
              <span class="rel__drop" aria-hidden="true"></span>
              <div class="rel__partners"><span>対応できる施工パートナーを<br>案件ごとに手配</span></div>
            </div>
          </div>
        </div>
        <p class="rel-cap">役割分担のイメージ図です。</p>
      </div>
      <div>
        <h3>お引き受けしていない内容</h3>
        <ul class="not-list">
          <li>御社のお取引先への営業や、取引の切り替えのご提案</li>
          <li>個人のお客様からのご依頼</li>
          <li>新築工事、大規模な増改築</li>
          <li>夜間・休日の緊急駆け付け対応</li>
          <li>必要な許可・資格を有する施工パートナーを手配できない工事</li>
        </ul>
        <p class="not-note">上記以外でも、内容や時期によって施工パートナーを手配できない場合があります。その場合は、その旨をご連絡します。</p>
      </div>
    </div>
    {{ctaline:concept}}
  </div>
</section>

<section class="section section--paper" id="services" aria-labelledby="svc-title">
  <div class="container">
    <div class="sec-head sec-head--split">
      <div>
        <span class="eyebrow">SERVICES</span>
        <h2 class="sec-title" id="svc-title">相談可能な工種例</h2>
      </div>
      <p class="sec-lead">原状回復から1か所の小修繕まで。以下はご相談いただける内容の例です。記載のない内容も、まずは写真をお送りください。</p>
    </div>
    <div class="svc-rows">
      <div class="svc-row">
        <h3>内装・原状回復<span class="en">INTERIOR</span></h3>
        <div><p>退去後の原状回復や、汚れ・傷みが目立つ箇所の部分的な補修。</p>
          <ul><li>クロス（壁紙）の張替え・部分補修</li><li>クッションフロア・フロアタイルの張替え</li><li>フローリングの傷・へこみの補修</li><li>巾木・見切りなど部材の交換</li><li>退去後のハウスクリーニング</li></ul></div>
      </div>
      <div class="svc-row">
        <h3>建具・設備まわり<span class="en">FIXTURES</span></h3>
        <div><p>扉の開閉や網戸の張替えから、設備部品の交換まで。</p>
          <ul><li>室内ドア・引戸の開閉調整</li><li>網戸・障子・ふすまの張替え</li><li>取手・戸当たりなど金物の交換</li><li>水栓のパッキンなど部品の交換<span class="mark">※</span></li><li>換気扇・照明器具の交換<span class="mark">※</span></li></ul></div>
      </div>
      <div class="svc-row">
        <h3>外まわり・共用部<span class="en">EXTERIOR</span></h3>
        <div><p>建物の外まわりや共用部の、部分的な補修。</p>
          <ul><li>外壁・塀の小さなひびの補修</li><li>雨どい・軒天の部分補修</li><li>共用廊下・階段まわりの補修</li></ul></div>
      </div>
      <div class="svc-row">
        <h3>店舗・事務所<span class="en">SHOP / OFFICE</span></h3>
        <div><p>営業中の店舗や事務所の補修、テナント退去時の原状回復。</p>
          <ul><li>床・壁・カウンターまわりの補修</li><li>テナント退去時の原状回復</li><li>営業時間外の作業のご相談</li></ul></div>
      </div>
    </div>
    <div class="svc-note">
      <p>記載の工種は、ご相談いただける内容の例です。対応の可否は、案件内容を確認後、施工パートナーの手配状況によりご回答します。</p>
      <p><span class="mark">※</span> 電気工事や給水装置工事など、許可・資格が必要な工事は、必要な許可・資格を有する施工パートナーを手配できる場合に限り対応します。</p>
    </div>
    {{ctaline:services}}
  </div>
</section>

<section class="segments" aria-labelledby="seg-title">
  <div class="container segments__head">
    <div class="sec-head sec-head--split">
      <div>
        <span class="eyebrow">FOR YOU</span>
        <h2 class="sec-title" id="seg-title">業種ごとのご相談</h2>
      </div>
      <p class="sec-lead">修繕が発生する場面や、求められる進め方は業種によって異なります。それぞれのご相談の進め方をご案内しています。</p>
    </div>
  </div>
  <div class="tiles">
    <a class="tile" href="{{site}}kanri/">
      {{img:building||(max-width: 1023px) 100vw, 34vw}}
      <span class="photo__cap photo__cap--dark">写真はイメージです</span>
      <span class="tile__en">FOR PROPERTY MANAGEMENT</span>
      <h3>管理会社様</h3>
      <p>退去後の原状回復や、入居中の小修繕。複数物件の修繕手配を、写真から相談できます。</p>
      <span class="more">詳しく見る</span>
    </a>
    <a class="tile" href="{{site}}kaitori/">
      {{img:kitchen||(max-width: 1023px) 100vw, 34vw}}
      <span class="photo__cap photo__cap--dark">写真はイメージです</span>
      <span class="tile__en">FOR RESALE</span>
      <h3>買取再販事業者様</h3>
      <p>仕入れ後の内装補修や、販売前の手直し。工事範囲ごとの見積で、手を入れる範囲を決められます。</p>
      <span class="more">詳しく見る</span>
    </a>
    <a class="tile" href="{{site}}shop/">
      {{img:shop||(max-width: 1023px) 100vw, 34vw}}
      <span class="photo__cap photo__cap--dark">写真はイメージです</span>
      <span class="tile__en">FOR SHOPS &amp; FACILITIES</span>
      <h3>店舗・施設運営者様</h3>
      <p>営業中の店舗や事務所の補修、退店時の原状回復。作業日時の調整からご相談ください。</p>
      <span class="more">詳しく見る</span>
    </a>
  </div>
</section>

<section class="section section--paper" id="flow" aria-labelledby="flow-title">
  <div class="container flow-wrap">
    <div class="flow-wrap__head">
      <span class="eyebrow">FLOW</span>
      <h2 class="sec-title" id="flow-title">ご相談から<br>完了確認までの流れ</h2>
      <p class="sec-lead">最初の一歩は、フォームから写真と物件情報をお送りいただくことです。現地確認は、写真で判断できない場合に日程を調整して行います。</p>
    </div>
    <div>
      {{flow}}
    </div>
  </div>
</section>

<section class="section" id="area-map" aria-labelledby="area-title">
  <div class="container">
    <div class="sec-head">
      <h2 class="sec-title" id="area-title">対応エリア</h2>
    </div>
    <div class="area">
      <figure class="area__map">
        <svg class="draw" viewBox="0 0 420 340" role="img" aria-labelledby="area-t">
          <title id="area-t">対応エリアの位置関係の概略図。松山市を中心に、松前町・伊予市・東温市・砥部町が主な対応エリア、今治市は案件により対応。</title>
          <g fill="none" stroke-width="1.5">
            <path d="M205 140 L290 76" stroke="#8d877b" stroke-dasharray="5 5"/>
            <path d="M205 140 L312 166 M205 140 L224 250 M205 140 L130 218 M130 218 L92 284" stroke="#1e3d38"/>
          </g>
          <g font-size="15" font-weight="700" text-anchor="middle">
            <circle cx="205" cy="140" r="46" fill="#1e3d38"/>
            <text x="205" y="145" fill="#fff" font-size="18">松山市</text>
            <rect x="252" y="14" width="116" height="62" fill="#fff" stroke="#8d877b" stroke-dasharray="5 4"/>
            <text x="310" y="40" fill="#454f4d">今治市</text>
            <text x="310" y="62" fill="#6a7370" font-size="12" font-weight="500">案件により対応</text>
            <rect x="268" y="146" width="88" height="40" fill="#fff" stroke="#1e3d38"/>
            <text x="312" y="171" fill="#23292a">東温市</text>
            <rect x="180" y="232" width="88" height="40" fill="#fff" stroke="#1e3d38"/>
            <text x="224" y="257" fill="#23292a">砥部町</text>
            <rect x="86" y="198" width="88" height="40" fill="#fff" stroke="#1e3d38"/>
            <text x="130" y="223" fill="#23292a">松前町</text>
            <rect x="48" y="266" width="88" height="40" fill="#fff" stroke="#1e3d38"/>
            <text x="92" y="291" fill="#23292a">伊予市</text>
          </g>
          <text x="12" y="330" font-size="11" fill="#6a7370">N↑</text>
        </svg>
        <figcaption>位置関係の概略図です。縮尺・形状は実際の地図とは<span class="nw">異なります。</span></figcaption>
      </figure>
      <table class="area__table">
        <tbody>
          <tr><th scope="row">主な対応エリア</th><td><strong><span class="nw">松山市</span>・<span class="nw">松前町</span>・<span class="nw">伊予市</span>・<span class="nw">東温市</span>・<span class="nw">砥部町</span></strong><span>上記エリアの物件を中心に、ご相談を受け付けています。</span></td></tr>
          <tr><th scope="row">案件により対応</th><td><strong><span class="nw">今治市</span></strong><span>案件内容・工事規模により対応します。まずはご相談ください。</span></td></tr>
          <tr><th scope="row">上記以外</th><td><strong>個別にご相談ください</strong><span>施工パートナーの手配状況により、お引き受けできない場合があります。</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="section section--paper" id="faq" aria-labelledby="faq-title">
  <div class="container faq-wrap">
    <div>
      <h2 class="sec-title" id="faq-title">よくあるご質問</h2>
    </div>
    <div class="faq">
      <details><summary>いつもの施工会社との取引をやめる必要はありますか？</summary><div class="faq__a"><p>ありません。普段の修繕はこれまで通りの施工会社へご依頼いただき、手が回らない時や工種が合わない時にご相談いただく使い方を想定しています。</p></div></details>
      <details><summary>写真だけで見積をもらえますか？</summary><div class="faq__a"><p>写真で内容が判断できる場合は、写真をもとに見積をご案内します。正確な判断に現地確認が必要な場合は、日程を調整のうえ確認してからのご案内になります。</p></div></details>
      <details><summary>写真はどのように撮ればよいですか？</summary><div class="faq__a"><p>部屋や場所の全体が分かる写真と、修繕箇所に近づいた写真の2枚があると判断しやすくなります。大きさが分かるようメジャーなどを添えたり、設備の型番ラベルを撮影したりしていただけると、より正確にご案内できます。</p></div></details>
      <details><summary>相談や見積に費用はかかりますか？</summary><div class="faq__a"><p>費用が発生する場合は、作業に入る前に内容と金額をご説明し、ご了承をいただいてから進めます。</p></div></details>
      <details><summary>契約や請求の相手はどこになりますか？</summary><div class="faq__a"><p>見積をご案内する際に、契約・請求の相手先と、施工の責任範囲を書面でお示しします。内容をご確認いただいたうえで、ご発注をご判断ください。</p></div></details>
      <details><summary>1か所だけの小さな修繕でも相談できますか？</summary><div class="faq__a"><p>ご相談いただけます。内容によっては、近い時期の他の修繕とまとめて施工した方が効率的な場合もあるため、あわせてご提案することがあります。</p></div></details>
      <details><summary>入居中・営業中の物件でも相談できますか？</summary><div class="faq__a"><p>ご相談いただけます。作業できる時間帯や、音・臭い・共用部の使用への配慮など、条件をお知らせください。条件に合う施工パートナーの手配を調整します。</p></div></details>
      <details><summary>電気・水道まわりの工事も頼めますか？</summary><div class="faq__a"><p>電気工事や給水装置工事など、許可・資格が必要な工事は、必要な許可・資格を有する施工パートナーを手配できる場合に限り対応します。対応できない場合は、その旨をお伝えします。</p></div></details>
      <details><summary>個人の住宅の修繕も相談できますか？</summary><div class="faq__a"><p>愛媛修繕デスクは、管理会社様・買取再販事業者様・店舗や施設を運営する事業者様など、法人・事業者様向けの窓口です。個人のお客様からのご依頼はお受けしていません。</p></div></details>
    </div>
  </div>
</section>

{{cta}}

<section class="section form-section" id="form" aria-labelledby="form-title">
  <div class="container form-section__inner">
    <div class="form-section__head">
      <span class="eyebrow">REQUEST FORM</span>
      <h2 class="sec-title" id="form-title">修繕案件を<br>相談する</h2>
      <p class="form-lead">工事内容・物件の情報・写真をお送りください。内容を確認のうえ、対応できる施工パートナーの手配を調整し、担当者からご連絡します。</p>
      <p class="form-note">法人・事業者様専用の窓口です。いつもの施工会社との併用を前提にしています。</p>
    </div>
    {{case_form}}
  </div>
</section>

```

## ファイル：src/sites/repair/pages/kaitori.html

```html
<section class="phero" aria-labelledby="page-title">
  <div class="container">
    <nav class="crumbs" aria-label="パンくずリスト"><ol><li><a href="{{site}}">愛媛修繕デスク</a></li><li aria-current="page">買取再販事業者様へ</li></ol></nav>
  </div>
  <div class="container phero__inner">
    <div>
      <span class="eyebrow">FOR RESALE</span>
      <h1 id="page-title">手を入れる範囲を、<br>見積を比べて<br>決められます。</h1>
      <p class="phero__lead">仕入れ後の内装補修や、販売前の手直し。どこまで手を入れるかを確認しながら、工事範囲ごとに内訳の分かる見積をご案内します。</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="{{site}}?seg=kaitori#form">{{cta_label}}</a>
        <a class="more" href="#scope">工事範囲の決め方</a>
      </div>
    </div>
    {{photo:kitchen|木の造作キッチンと無垢材の床|phero__photo|写真はイメージです|eager}}
  </div>
</section>

<section class="section" aria-labelledby="scene-title">
  <div class="container">
    <div class="sec-head sec-head--split">
      <div>
        <h2 class="sec-title" id="scene-title">買取再販事業者様からの<br>ご相談の場面</h2>
      </div>
      <p class="sec-lead">仕入れのペースや販売の予定に合わせて、いつもの施工会社だけでは手が足りない時にご相談ください。</p>
    </div>
    <div class="needs">
      <article class="need">
        {{photo:fusuma|ふすま風の引戸がある、家具の置かれていない洋室|need__photo}}
        <div class="need__body"><span class="need__tag">仕入れ後</span><h3>販売前に、内装を整えておきたい</h3><p>壁紙や床の汚れ・傷など、内覧の前に整えておきたい箇所。写真をお送りいただければ、箇所ごとに内容を確認してご案内します。</p></div>
      </article>
      <article class="need">
        {{photo:kitaroom|無垢材の床と木の造作のある室内|need__photo}}
        <div class="need__body"><span class="need__tag">範囲</span><h3>どこまで手を入れるか迷っている</h3><p>販売価格とのバランスを見ながら、工事範囲を段階的に検討したい。範囲ごとに分けた見積で、比べながらご判断いただけます。</p></div>
      </article>
    </div>
    <ul class="scenes">
      <li><span class="scenes__tag">日程</span><h3>販売開始の予定が決まっている</h3><p>写真撮影や内覧の開始日に合わせて、工程を相談しながら進めたい。</p></li>
      <li><span class="scenes__tag">工種</span><h3>工種ごとに手配するのが手間</h3><p>内装、建具、外まわりなど、工種ごとに別々の会社へ連絡するのが負担になっている。</p></li>
      <li><span class="scenes__tag">記録</span><h3>工事の内容を記録に残したい</h3><p>どの箇所をどう直したかを、写真と見積の内訳で残しておきたい。</p></li>
    </ul>
  </div>
</section>

<section class="section section--paper" id="scope" aria-labelledby="scope-title">
  <div class="container">
    <div class="sec-head sec-head--split">
      <div>
        <h2 class="sec-title" id="scope-title">工事範囲の決め方</h2>
      </div>
      <p class="sec-lead">手を入れる範囲は、物件ごとに事業者様がご判断ください。判断しやすいよう、範囲ごとに分けて見積をご案内します。</p>
    </div>
    <table class="trade-table">
      <caption class="sr-only">工事範囲の段階と内容の例</caption>
      <tbody>
        <tr><th scope="row">必要な補修のみ</th><td>破損・不具合のある箇所の補修。建具の開閉不良、床の大きな傷、壁の穴など。<small>販売に支障がある箇所を中心に、最小限の範囲で検討する場合</small></td></tr>
        <tr><th scope="row">印象を整える手直し</th><td>上記に加え、汚れや色あせが目立つ壁紙・床材の張替え、ハウスクリーニングなど。<small>内覧時の印象を整えたい場合</small></td></tr>
        <tr><th scope="row">部分的な入替え</th><td>上記に加え、劣化した設備部品の交換や、部屋単位での内装の入替えなど。<small>許可・資格が必要な工事は、必要な許可・資格を有する施工パートナーを手配できる場合に限ります</small></td></tr>
      </tbody>
    </table>
    <ol class="points" data-space="l">
      <li><h3>範囲ごとの見積</h3><p>工事範囲を段階に分けて内訳をご提示します。比較しながら、手を入れる範囲を決めていただけます。</p></li>
      <li><h3>工種をまとめて相談</h3><p>内装・建具・外まわりなど、複数の工種にまたがる内容も、ひとつの窓口でご相談いただけます。</p></li>
      <li><h3>販売日程から逆算</h3><p>販売開始や内覧の予定をお知らせください。施工パートナーの状況を確認し、可能な工程をご案内します。</p></li>
    </ol>
    <div class="concept-detail">
      <div>
        <h3>お引き受けしていない内容</h3>
        <ul class="not-list">
          <li>間取り変更を伴う大規模なリノベーション</li>
          <li>構造に関わる工事、増改築</li>
          <li>設計・確認申請が必要な工事</li>
        </ul>
        <p class="not-note">内容によっては、施工パートナーを手配できない場合があります。その場合は、その旨をご連絡します。</p>
      </div>
      <div>
        <h3>ご相談時にあると判断しやすいもの</h3>
        <ul class="not-list not-list--ok">
          <li>部屋ごとの全体写真と、気になる箇所の写真</li>
          <li>間取り図（お手元にある場合）</li>
          <li>販売開始・内覧開始の予定日</li>
        </ul>
      </div>
    </div>
    <div class="inline-cta">
      <p>仕入れ物件の手直しのご相談はこちら<small>工事範囲が決まっていない段階でもご相談いただけます。</small></p>
      <a class="btn btn--primary" href="{{site}}?seg=kaitori#form">{{cta_label}}</a>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="kfaq-title">
  <div class="container faq-wrap">
    <div>
      <p class="faq-for">買取再販事業者様から</p>
      <h2 class="sec-title" id="kfaq-title">よくあるご質問</h2>
    </div>
    <div class="faq">
      <details><summary>仕入れ前の検討段階でも相談できますか？</summary><div class="faq__a"><p>ご相談いただけます。写真や間取り図など、分かる範囲の情報をお送りください。現地を確認できない段階では、概算でのご案内になる場合があります。</p></div></details>
      <details><summary>販売開始日までに間に合わせてもらえますか？</summary><div class="faq__a"><p>工程は、工事内容と施工パートナーの状況によって異なります。ご希望の日程をお知らせいただければ、対応できるかどうかを確認してご回答します。日程をお約束できない場合は、その旨をお伝えします。</p></div></details>
      <details><summary>空室で鍵を預ける形でも大丈夫ですか？</summary><div class="faq__a"><p>鍵の受け渡し方法や、作業中の管理方法は、案件ごとにご相談のうえ決めさせていただきます。</p></div></details>
    </div>
  </div>
</section>

{{cta}}

```

## ファイル：src/sites/repair/pages/kanri.html

```html
<section class="phero" aria-labelledby="page-title">
  <div class="container">
    <nav class="crumbs" aria-label="パンくずリスト"><ol><li><a href="{{site}}">愛媛修繕デスク</a></li><li aria-current="page">管理会社様へ</li></ol></nav>
  </div>
  <div class="container phero__inner">
    <div>
      <span class="eyebrow">FOR PROPERTY MANAGEMENT</span>
      <h1 id="page-title">退去が重なる時期の、<br>もう一つの修繕窓口に。</h1>
      <p class="phero__lead">原状回復や入居中の小修繕で、いつもの施工会社の手が回らない時に。物件の写真と情報をお送りいただければ、内容を確認のうえ、対応できる施工パートナーの手配を調整します。</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="{{site}}?seg=kanri#form">{{cta_label}}</a>
        <a class="more" href="#prep">送っていただく情報</a>
      </div>
    </div>
    {{photo:building|ベランダが並ぶ集合住宅の外観|phero__photo|写真はイメージです|eager}}
  </div>
</section>

<section class="section" aria-labelledby="scene-title">
  <div class="container">
    <div class="sec-head sec-head--split">
      <div>
        <h2 class="sec-title" id="scene-title">管理会社様からの<br>ご相談の場面</h2>
      </div>
      <p class="sec-lead">普段の発注先で対応できている修繕まで、お任せいただく必要はありません。手配に困る場面でお使いください。</p>
    </div>
    <div class="needs">
      <article class="need">
        {{photo:washitsu2|障子と床の間のある、家具の置かれていない和室|need__photo}}
        <div class="need__body"><span class="need__tag">退去後</span><h3>原状回復の手配が重なった</h3><p>繁忙期に複数の退去が重なり、いつもの施工会社だけでは次の募集に間に合わない。クロスや床の張替え、ハウスクリーニングなど、原状回復の手配をご相談いただけます。</p></div>
      </article>
      <article class="need">
        {{photo:tatami|家具や家電が置かれた、入居中の畳敷きの居室|need__photo}}
        <div class="need__body"><span class="need__tag">入居中</span><h3>入居者様からの不具合のご連絡</h3><p>建具の開閉や水まわりの部品など、入居中の小さな不具合。入居者様との日程調整の進め方も含めて、管理会社様のルールに合わせてご相談させてください。</p></div>
      </article>
      <article class="need">
        {{photo:apartments|建ち並ぶ集合住宅|need__photo}}
        <div class="need__body"><span class="need__tag">共用部</span><h3>共用部の傷みが気になる</h3><p>共用廊下や階段、外壁の小さなひびなど、部分的な補修の相談先として。写真で状況を共有していただき、現地確認が必要かどうかからご案内します。</p></div>
      </article>
    </div>
    <ul class="scenes">
      <li><span class="scenes__tag">工種</span><h3>頼みたい工種の手配先がない</h3><p>内装は頼めるが、建具や外まわりなど、別の工種の施工会社とつながりがない。</p></li>
      <li><span class="scenes__tag">報告</span><h3>オーナー様への説明材料がほしい</h3><p>施工前後の写真と見積の内訳を、オーナー様へのご報告に使いたい。</p></li>
      <li><span class="scenes__tag">遠方</span><h3>担当物件まで距離がある</h3><p>すぐに現地へ行けないため、まずは写真で状況を共有して相談を始めたい。</p></li>
    </ul>
  </div>
</section>

<section class="section section--paper" aria-labelledby="point-title">
  <div class="container">
    <div class="sec-head">
      <h2 class="sec-title" id="point-title">管理業務に合わせた進め方</h2>
    </div>
    <ol class="points">
      <li><h3>写真から相談を始められます</h3><p>現地での立会いを前提とせず、写真と物件情報から相談を始められます。写真で判断できない場合に、現地確認の日程を調整します。</p></li>
      <li><h3>見積は内訳の分かる形で</h3><p>工事内容と金額の内訳をご提示します。オーナー様へのご説明やご承認の取得にお使いください。</p></li>
      <li><h3>完了時は写真でご報告</h3><p>施工後の状況を写真でお伝えすることを基本としています。現地へ行かずに仕上がりをご確認いただけます。</p></li>
    </ol>
  </div>
</section>

<section class="section" aria-labelledby="kflow-title">
  <div class="container flow-wrap">
    <div class="flow-wrap__head">
      <h2 class="sec-title" id="kflow-title">ご相談から<br>完了確認までの流れ</h2>
      <p class="sec-lead">退去のご連絡を受けた段階でも、まずは写真と物件情報をお送りください。</p>
    </div>
    <div>{{flow}}</div>
  </div>
</section>

<section class="section section--paper" id="prep" aria-labelledby="prep-title">
  <div class="container">
    <div class="sec-head">
      <h2 class="sec-title" id="prep-title">ご相談時に送っていただく情報</h2>
      <p class="sec-lead">分かる範囲で構いません。不足している情報は、内容確認の段階でお問い合わせします。</p>
    </div>
    <div class="prep">
      <ul class="prep__list">
        <li><b>物件の情報</b><span>所在地（市町村・町名まで）、建物種別、部屋番号など</span></li>
        <li><b>入居状況</b><span>空室か入居中か。入居中の場合は、入居者様との日程調整の要否</span></li>
        <li><b>修繕内容</b><span>修繕したい箇所と、気になっている状態</span></li>
        <li><b>希望時期</b><span>次の入居予定日や、募集開始の予定など</span></li>
        <li><b>写真</b><span>修繕箇所の写真。管理会社様の指示書などがあれば、あわせてお送りください</span></li>
      </ul>
      <div class="photo-tips">
        <h3>写真を撮る時のポイント</h3>
        <ul>
          <li>部屋全体が分かる写真を1枚</li>
          <li>修繕箇所に近づいた写真を1枚</li>
          <li>大きさが分かるよう、可能ならメジャーなどを添えて</li>
          <li>複数箇所ある場合は、箇所ごとに撮影</li>
          <li>型番が分かる設備は、ラベル部分も</li>
        </ul>
      </div>
    </div>
    <div class="inline-cta">
      <p>退去・小修繕のご相談はこちら<small>写真がない場合も、内容をご記入のうえご相談いただけます。</small></p>
      <a class="btn btn--primary" href="{{site}}?seg=kanri#form">{{cta_label}}</a>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="kfaq-title">
  <div class="container faq-wrap">
    <div>
      <p class="faq-for">管理会社様から</p>
      <h2 class="sec-title" id="kfaq-title">よくあるご質問</h2>
    </div>
    <div class="faq">
      <details><summary>複数の物件をまとめて相談できますか？</summary><div class="faq__a"><p>ご相談いただけます。物件ごとに所在地と修繕内容が分かるようにお送りください。施工パートナーの手配状況により、物件ごとに時期が異なる場合があります。</p></div></details>
      <details><summary>入居者様との日程調整はお願いできますか？</summary><div class="faq__a"><p>入居者様との連絡方法は、管理会社様のルールに合わせてご相談させてください。管理会社様を通じた調整を基本としています。</p></div></details>
      <details><summary>鍵の受け渡しや立会いはどうなりますか？</summary><div class="faq__a"><p>鍵の受け渡し方法や立会いの要否は、物件と案件ごとにご相談のうえ決めさせていただきます。</p></div></details>
      <details><summary>入居者様の負担区分の判断もしてもらえますか？</summary><div class="faq__a"><p>費用負担の区分は、管理会社様・オーナー様のご判断となります。判断の参考になるよう、施工前の写真と工事内容の内訳をお渡しします。</p></div></details>
    </div>
  </div>
</section>

{{cta}}

```

## ファイル：src/sites/repair/pages/shop.html

```html
<section class="phero" aria-labelledby="page-title">
  <div class="container">
    <nav class="crumbs" aria-label="パンくずリスト"><ol><li><a href="{{site}}">愛媛修繕デスク</a></li><li aria-current="page">店舗・施設運営者様へ</li></ol></nav>
  </div>
  <div class="container phero__inner">
    <div>
      <span class="eyebrow">FOR SHOPS &amp; FACILITIES</span>
      <h1 id="page-title">営業を続けながらの<br>補修も、作業時間から<br>ご相談ください。</h1>
      <p class="phero__lead">店舗・事務所・施設の床や壁の傷み、建具の不具合、退店時の原状回復。営業への影響を確認しながら、作業できる日時を含めてご相談いただけます。</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="{{site}}?seg=shop#form">{{cta_label}}</a>
        <a class="more" href="#conditions">お知らせいただきたい条件</a>
      </div>
    </div>
    {{photo:shop|夜の商店街に建つ木造の店舗|phero__photo|写真はイメージです|eager}}
  </div>
</section>

<section class="section" aria-labelledby="scene-title">
  <div class="container">
    <div class="sec-head sec-head--split">
      <div>
        <h2 class="sec-title" id="scene-title">店舗・施設運営者様からの<br>ご相談の場面</h2>
      </div>
      <p class="sec-lead">営業中の店舗や施設では、作業の時間帯や周囲への配慮が工程を左右します。条件を伺ったうえで、施工パートナーの手配を調整します。</p>
    </div>
    <div class="needs">
      <article class="need">
        {{photo:shop2|テーブル席のある飲食店の店内|need__photo}}
        <div class="need__body"><span class="need__tag">営業中</span><h3>床や壁の傷みが目立ってきた</h3><p>客席や通路の床、壁の汚れや傷など、営業を続けながら直したい箇所。開店前・閉店後・定休日など、作業できる時間帯をお知らせください。</p></div>
      </article>
      <article class="need">
        {{photo:vacant|ガラス戸越しに見える、テナント退去後の空室|need__photo}}
        <div class="need__body"><span class="need__tag">退店・移転</span><h3>退店時の原状回復</h3><p>テナント契約の終了に合わせた原状回復。範囲は契約内容や貸主様の指定によって決まるため、契約書や指示書の内容をあわせてお知らせください。</p></div>
      </article>
    </div>
    <ul class="scenes">
      <li><span class="scenes__tag">建具</span><h3>扉や引戸の調子が悪い</h3><p>出入口や個室の扉の開閉が重い、閉まりきらないなどの不具合を相談したい。</p></li>
      <li><span class="scenes__tag">複数拠点</span><h3>店舗ごとに修繕先を探している</h3><p>松山周辺に複数の店舗や拠点があり、まとめて相談できる窓口がほしい。</p></li>
      <li><span class="scenes__tag">本部</span><h3>現地に担当者がいない</h3><p>本部から遠い店舗の修繕を、写真で状況を共有しながら進めたい。</p></li>
    </ul>
  </div>
</section>

<section class="section section--paper" id="conditions" aria-labelledby="cond-title">
  <div class="container">
    <div class="sec-head sec-head--split">
      <div>
        <h2 class="sec-title" id="cond-title">お知らせいただきたい条件</h2>
      </div>
      <p class="sec-lead">営業中の店舗や施設では、作業の条件が工程と施工パートナーの手配に大きく関わります。分かる範囲でお知らせください。</p>
    </div>
    <div class="prep">
      <ul class="prep__list">
        <li><b>営業時間・定休日</b><span>作業できる曜日や時間帯（開店前・閉店後など）</span></li>
        <li><b>作業時の制約</b><span>音・臭い・粉じんへの配慮、搬入経路、駐車場所など</span></li>
        <li><b>建物側のルール</b><span>商業施設やビルの場合、工事申請や作業時間の決まり</span></li>
        <li><b>修繕内容</b><span>修繕したい箇所と状態、写真</span></li>
        <li><b>希望時期</b><span>改装・退店などの予定日</span></li>
      </ul>
      <div class="photo-tips">
        <h3>ご相談の前に確認しておきたいこと</h3>
        <ul>
          <li>建物の管理会社・オーナーへの届出の要否</li>
          <li>テナント契約で定められた原状回復の範囲</li>
          <li>工事中に使えなくなる設備や区画の有無</li>
          <li>作業当日に立会いができる方</li>
        </ul>
      </div>
    </div>
    <div class="notice" data-space="l">
      <h3>作業時間について</h3>
      <p>営業時間外や定休日の作業をご希望の場合も、まずはご相談ください。施工パートナーの状況により、ご希望の日時で調整できない場合があります。</p>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="sflow-title">
  <div class="container flow-wrap">
    <div class="flow-wrap__head">
      <h2 class="sec-title" id="sflow-title">ご相談から<br>完了確認までの流れ</h2>
      <p class="sec-lead">作業日時のご希望は、最初のご相談時にお知らせください。</p>
    </div>
    <div>{{flow}}</div>
  </div>
  <div class="container">
    <div class="inline-cta">
      <p>店舗・施設の修繕のご相談はこちら<small>作業日時の条件もあわせてお知らせください。</small></p>
      <a class="btn btn--primary" href="{{site}}?seg=shop#form">{{cta_label}}</a>
    </div>
  </div>
</section>

<section class="section section--paper" aria-labelledby="sfaq-title">
  <div class="container faq-wrap">
    <div>
      <p class="faq-for">店舗・施設運営者様から</p>
      <h2 class="sec-title" id="sfaq-title">よくあるご質問</h2>
    </div>
    <div class="faq">
      <details><summary>閉店後や定休日に作業してもらえますか？</summary><div class="faq__a"><p>ご相談いただけます。作業できる日時をお知らせください。施工パートナーの状況を確認のうえ、対応できるかどうかをご回答します。</p></div></details>
      <details><summary>商業施設内のテナントでも相談できますか？</summary><div class="faq__a"><p>ご相談いただけます。施設ごとに工事申請や作業時間のルールがあるため、施設側の決まりをあわせてお知らせください。</p></div></details>
      <details><summary>退店時の原状回復の範囲が分かりません。</summary><div class="faq__a"><p>原状回復の範囲は、テナント契約の内容や貸主様の指定によって決まります。契約書や貸主様からの指示書をご確認のうえ、内容をお知らせください。</p></div></details>
    </div>
  </div>
</section>

{{cta}}

```

## ファイル：src/sites/repair/partials/cta.html

```html
<section class="cta" aria-labelledby="cta-title">
  {{photo:cta|天窓のある明るい空室|cta__bg|写真はイメージです}}
  <div class="container cta__inner">
    <div>
      <span class="eyebrow">CONTACT</span>
      <h2 id="cta-title">まずは写真と物件情報を、<br>お送りください。</h2>
      <p class="cta__lead">状況が分かる写真と、物件の所在地・修繕内容をお送りいただければ、内容を確認のうえ担当者からメールまたはお電話でご連絡します。写真がない場合も、内容をご記入のうえご相談いただけます。</p>
    </div>
    <div class="cta__box">
      <h3>ご相談時に必要な情報</h3>
      <ol>
        <li>会社名・ご担当者名・ご連絡先</li>
        <li>物件の所在地と種別</li>
        <li>空室・入居中・営業中の別</li>
        <li>修繕内容とご希望の時期</li>
        <li>修繕箇所の写真（推奨）</li>
      </ol>
      <a class="btn btn--primary btn--block" href="{{site}}#form" data-track="cta_click" data-track-pos="band">{{cta_label}}</a>
      <small>法人・事業者様専用の窓口です。</small>
    </div>
  </div>
</section>

```

## ファイル：src/sites/repair/partials/flow.html

```html
<ol class="flow">
        <li><div><h3>写真を送る</h3><p>フォームから、物件の所在地・修繕内容・写真をお送りください。</p></div></li>
        <li><div><h3>内容確認</h3><p>担当者が内容を確認し、不足している情報があればお問い合わせします。</p></div></li>
        <li><div><h3>施工パートナー確認</h3><p>工種・規模・時期に対応できる施工パートナーの可否と日程を確認します。</p></div></li>
        <li><div><h3>現地確認<span class="flow__opt">必要な場合</span></h3><p>写真で判断できない場合は、日程を調整して現地を確認します。</p></div></li>
        <li><div><h3>見積</h3><p>工事内容と金額の内訳をご提示します。ご発注は内容をご確認のうえご判断ください。</p></div></li>
        <li><div><h3>施工</h3><p>合意した内容で、手配した施工パートナーが施工します。日程や作業時間は事前に調整します。</p></div></li>
        <li><div><h3>完了確認</h3><p>施工後の状況を写真でお伝えし、仕上がりをご確認いただきます。</p></div></li>
      </ol>
      <p class="flow-note">※ 各工程にかかる日数は、案件内容と施工パートナーの状況により異なります。ご希望の時期は、ご相談時にお知らせください。</p>

```

## ファイル：src/sites/repair/partials/form-step1.html

```html
          <div class="field field--stack" data-field="services">
            <span class="field__label" id="services-label"><span class="req">必須</span>工事内容（複数選択できます）</span>
            <div>
              <div class="choices choices--grid" role="group" aria-labelledby="services-label" aria-describedby="services-err">
                <label class="choice"><input type="checkbox" name="services" value="原状回復・内装"><span>原状回復・内装</span></label>
                <label class="choice"><input type="checkbox" name="services" value="建具・設備まわり"><span>建具・設備まわり</span></label>
                <label class="choice"><input type="checkbox" name="services" value="外回り・共用部"><span>外回り・共用部</span></label>
                <label class="choice"><input type="checkbox" name="services" value="店舗・事務所の修繕"><span>店舗・事務所の修繕</span></label>
                <label class="choice"><input type="checkbox" name="services" value="小規模な補修"><span>小規模な補修</span></label>
                <label class="choice"><input type="checkbox" name="services" value="その他"><span>その他</span></label>
              </div>
              <p class="field__err" id="services-err" aria-live="polite"></p>
            </div>
          </div>
          <div class="field field--stack" data-field="reason">
            <span class="field__label" id="reason-label"><span class="opt">任意</span>普段の施工会社で対応できない理由</span>
            <div class="choices" role="group" aria-labelledby="reason-label">
              <label class="choice"><input type="checkbox" name="reason" value="繁忙で手が回らない"><span>繁忙で手が回らない</span></label>
              <label class="choice"><input type="checkbox" name="reason" value="対応外の工種"><span>対応外の工種</span></label>
              <label class="choice"><input type="checkbox" name="reason" value="小規模な案件"><span>小規模な案件</span></label>
              <label class="choice"><input type="checkbox" name="reason" value="新しい相談先を探している"><span>新しい相談先を探している</span></label>
              <label class="choice"><input type="checkbox" name="reason" value="その他"><span>その他</span></label>
            </div>
          </div>
          <div class="field field--stack" data-field="urgency">
            <span class="field__label" id="urgency-label"><span class="opt">任意</span>緊急度</span>
            <div class="choices" role="radiogroup" aria-labelledby="urgency-label">
              <label class="choice"><input type="radio" name="urgency" value="使用・営業に支障がある"><span>使用・営業に支障がある</span></label>
              <label class="choice"><input type="radio" name="urgency" value="早めに対応したい"><span>早めに対応したい</span></label>
              <label class="choice"><input type="radio" name="urgency" value="急ぎではない"><span>急ぎではない</span></label>
            </div>
          </div>
          <div class="field field--stack" data-field="timing">
            <span class="field__label" id="timing-label"><span class="opt">任意</span>希望時期</span>
            <div class="choices" role="radiogroup" aria-labelledby="timing-label">
              <label class="choice"><input type="radio" name="timing" value="1週間以内"><span>1週間以内</span></label>
              <label class="choice"><input type="radio" name="timing" value="1か月以内"><span>1か月以内</span></label>
              <label class="choice"><input type="radio" name="timing" value="2〜3か月以内"><span>2〜3か月以内</span></label>
              <label class="choice"><input type="radio" name="timing" value="時期未定"><span>時期未定</span></label>
            </div>
          </div>
          <div class="field field--stack" data-field="note">
            <label class="field__label" for="note"><span class="opt">任意</span>修繕内容の補足</label>
            <div><textarea class="textarea" id="note" name="note" rows="4" placeholder="例）退去後の原状回復。6畳洋室のクロス張替えと、室内ドア1か所の開閉調整。いつもの施工会社は繁忙期で着工まで1か月かかると言われています。"></textarea></div>
          </div>

```

## ファイル：src/sites/repair/partials/form-step2.html

```html
          <div class="field field--stack" data-field="ptype">
            <span class="field__label" id="ptype-label"><span class="opt">任意</span>建物種別</span>
            <div class="choices" role="radiogroup" aria-labelledby="ptype-label">
              <label class="choice"><input type="radio" name="ptype" value="マンション・アパート"><span>マンション・アパート</span></label>
              <label class="choice"><input type="radio" name="ptype" value="戸建"><span>戸建</span></label>
              <label class="choice"><input type="radio" name="ptype" value="店舗"><span>店舗</span></label>
              <label class="choice"><input type="radio" name="ptype" value="事務所"><span>事務所</span></label>
              <label class="choice"><input type="radio" name="ptype" value="施設"><span>施設</span></label>
              <label class="choice"><input type="radio" name="ptype" value="その他"><span>その他</span></label>
            </div>
          </div>
          <div class="field field--stack" data-field="occupancy">
            <span class="field__label" id="occupancy-label"><span class="opt">任意</span>使用状況</span>
            <div class="choices" role="radiogroup" aria-labelledby="occupancy-label">
              <label class="choice"><input type="radio" name="occupancy" value="空室"><span>空室</span></label>
              <label class="choice"><input type="radio" name="occupancy" value="入居中"><span>入居中</span></label>
              <label class="choice"><input type="radio" name="occupancy" value="営業中"><span>営業中</span></label>
            </div>
          </div>

```

## ファイル：src/sites/repair/partials/form-step3.html

```html
          <div class="field field--stack" data-field="segment">
            <span class="field__label" id="segment-label"><span class="opt">任意</span>貴社の業種</span>
            <div class="choices" role="radiogroup" aria-labelledby="segment-label">
              <label class="choice"><input type="radio" name="segment" value="管理会社" data-seg="kanri"><span>管理会社</span></label>
              <label class="choice"><input type="radio" name="segment" value="買取再販事業者" data-seg="kaitori"><span>買取再販事業者</span></label>
              <label class="choice"><input type="radio" name="segment" value="店舗・施設運営者" data-seg="shop"><span>店舗・施設運営者</span></label>
              <label class="choice"><input type="radio" name="segment" value="その他の法人・事業者"><span>その他の法人・事業者</span></label>
            </div>
          </div>

```


---

# 売却前おまかせデスク（src/sites/sale）

## ファイル：src/sites/sale/pages/index.html

```html
<section class="hero" aria-labelledby="hero-title">
  {{photo:kitaroom|家具がなく、無垢材の床と白い壁が明るい室内|hero__bg|-|eager}}
  <div class="container hero__inner">
    <p class="hero__eyebrow">松山周辺の不動産会社様向け</p>
    <h1 class="hero__title" id="hero-title">いつもの業者は<br class="br-sp">そのまま。<br>売却前だけ、<br class="br-sp">もう一つの手配先を。</h1>
    <p class="hero__lead">残置物・空室清掃・草刈り・小修繕。<br>相続物件や空き家など、いつもの業者へ<span class="nw">頼みにくい案件</span>だけ、<br class="br-pc">まとめてご相談いただけます。</p>
    <div class="btn-row hero__actions">
      <a class="btn btn--primary" href="#form" data-track="hero_cta_click">{{cta_label}}</a>
      <a class="more more--light" href="#concept">いつもの業者との関係</a>
    </div>
    <p class="hero__sub">{{cta_sub}}</p>
    {{phone_cta}}
  </div>
  <div class="hero__foot">
    <div class="container hero__foot-inner">
      <span class="hero__foot-label">役割分担</span>
      <ul class="hero__roles">
        <li><span>通常案件</span><b>いつもの施工会社・清掃会社</b><em>これまで通り</em></li>
        <li><span>売却前の細かい案件</span><b>売却前おまかせデスク</b><em>受付・整理・事業者の手配</em></li>
      </ul>
      <span class="photo__cap photo__cap--dark">写真はイメージです</span>
    </div>
  </div>
</section>

<section class="facts" aria-label="サービスの概要">
  <div class="container">
    <ul class="facts__list">
      <li class="facts__item"><span class="facts__k">対象</span><span class="facts__v">不動産会社様向けの<br>売却前の手配窓口</span></li>
      <li class="facts__item"><span class="facts__k">ご相談方法</span><span class="facts__v">写真と物件エリアを<br>フォームから送信</span></li>
      <li class="facts__item"><span class="facts__k">主な対応エリア</span><span class="facts__v">松山市・松前町・伊予市<br>東温市・砥部町</span></li>
      <li class="facts__item"><span class="facts__k">ご利用の形</span><span class="facts__v">いつもの業者と併用<br>業者変更は不要です</span></li>
    </ul>
  </div>
</section>

<section class="section" id="cases" aria-labelledby="cases-title">
  <div class="container">
    <div class="sec-head sec-head--split">
      <div>
        <span class="eyebrow">CASE</span>
        <h2 class="sec-title" id="cases-title">こんな時にご相談ください</h2>
      </div>
      <p class="sec-lead">売却準備のすべてをお任せいただく必要はありません。いつもの業者へ<span class="nw">頼みにくい</span>案件だけのご相談で構いません。</p>
    </div>
    <ol class="problems">
      <li><span class="problems__no">01</span><div><h3>媒介中の相続物件、段取りが進まない</h3><p>売主様が遠方で、片付けから清掃までの手配を組む人がいない。</p></div></li>
      <li><span class="problems__no">02</span><div><h3>内覧・撮影の前に、室内と庭を整えたい</h3><p>清掃・草刈り・小修繕が重なり、業者ごとに連絡する時間がない。</p></div></li>
      <li><span class="problems__no">03</span><div><h3>いつもの業者の予定が取れない</h3><p>繁忙期で、引き渡しや販売開始の日程に間に合いそうにない。</p></div></li>
      <li><span class="problems__no">04</span><div><h3>小さすぎて、頼みにくい</h3><p>建具1か所の調整や網戸の張替えなど、リフォーム会社へ頼むほどではない。</p></div></li>
    </ol>
  </div>
</section>

<section class="section section--paper" id="concept" aria-labelledby="concept-title">
  <div class="container">
    <div class="overlap">
      {{photo:fusuma|ふすまと無垢材の床の、片付いた明るい室内|overlap__photo}}
      <div class="overlap__panel">
        <span class="eyebrow">CONCEPT</span>
        <h2 id="concept-title">売却前の<br>「第二の手配先」。</h2>
        <p><strong>いつもの業者は、そのままで大丈夫です。</strong>普段の工事や修繕はこれまで通りに。売却前に重なる細かな作業や、手が回らない時期の案件だけを、売却前おまかせデスクが受け付けます。</p>
        <p class="split"><span><small>当窓口</small>ご相談の受付・内容の整理・事業者の手配・完了のご報告</span><span><small>作業</small>内容に合う事業者が担当（契約・請求の相手先は見積時にご案内）</span></p>
        <p>ご相談から完了のご報告まで、窓口は当デスクが受け持ちます。当窓口は自社で作業を行う会社ではありません。</p>
      </div>
    </div>
    <div class="concept-detail">
      <div>
        <h3>いつもの取引先との関係</h3>
        <div class="rel" role="img" aria-label="関係図：不動産会社様は、通常案件をこれまで通りいつもの施工会社・清掃会社に依頼し、売却前の細かい案件だけ売却前おまかせデスクへ相談します。売却前おまかせデスクは、案件ごとに対応できる事業者を手配します。既存業者の置き換えではありません。">
          <div class="rel__you">御社<small>不動産会社様</small></div>
          <div class="rel__lines" aria-hidden="true"><span class="rel__solid"></span><span class="rel__dash"></span></div>
          <div class="rel__pair">
            <div class="rel__usual-col"><div class="rel__box"><small>通常案件</small>いつもの施工会社・清掃会社</div><p class="rel__usual-note">これまで通り、<br>いつもの業者へ</p></div>
            <div class="rel__desk-col">
              <div class="rel__box rel__box--desk"><small>売却前の細かい案件</small><span>売却前<wbr>おまかせデスク</span></div>
              <span class="rel__drop" aria-hidden="true"></span>
              <div class="rel__partners"><span>対応できる事業者を<br>案件ごとに手配</span></div>
            </div>
          </div>
        </div>
        <p class="rel-cap">役割分担のイメージ図です。既存業者の置き換えではありません。</p>
      </div>
      <div>
        <h3>お引き受けしていない内容</h3>
        <ul class="not-list">
          <li>御社の取引先に代わる、継続的な工事の受注</li>
          <li>解体工事、大規模なリフォーム・増改築</li>
          <li>夜間・休日の緊急駆け付け対応</li>
          <li>必要な許可・資格を有する事業者を手配できない作業</li>
        </ul>
        <p class="not-note">上記以外でも、内容や時期によって対応できる事業者を手配できない場合があります。その場合は、その旨をご連絡します。</p>
      </div>
    </div>
    {{ctaline:keep}}
  </div>
</section>

<section class="section" id="services" aria-labelledby="svc-title">
  <div class="container">
    <div class="sec-head sec-head--split">
      <div>
        <span class="eyebrow">SERVICES</span>
        <h2 class="sec-title" id="svc-title">売却前の現場手配・調整</h2>
      </div>
      <p class="sec-lead">売却準備に必要な作業を整理し、内容に合う事業者へ手配します。1つだけでも、組み合わせても構いません。</p>
    </div>
    <div class="svc-policy">
      <h3>手配の考え方</h3>
      <p>作業ごとに、内容に合う事業者を手配します。廃棄物の収集・運搬、電気・給水装置工事など許可・資格が必要な業務は、必要な許可・資格を有する事業者を手配できる場合に限りお引き受けします。</p>
    </div>
    <div class="svc-rows">
      <div class="svc-row">
        <h3>空室清掃<span class="en">CLEANING</span></h3>
        <div><p><span class="svc-when">撮影前・内覧前・引き渡し前</span>室内全体と水まわりを清掃します。</p>
          <ul><li>室内全体の清掃</li><li>キッチン・浴室・トイレの清掃</li><li>窓・サッシの清掃</li></ul></div>
      </div>
      <div class="svc-row">
        <h3>小修繕<span class="en">SMALL REPAIRS</span></h3>
        <div><p><span class="svc-when">内覧前・引き渡し前</span>建具・壁・床・設備の軽微な補修。</p>
          <ul><li>建具の開閉調整</li><li>壁紙・床の部分補修</li><li>網戸・障子・ふすまの張替え</li><li>水栓・照明など部品の交換<span class="mark">※</span></li></ul></div>
      </div>
      <div class="svc-row">
        <h3>草刈り・外回り<span class="en">OUTDOOR</span></h3>
        <div><p><span class="svc-when">撮影前・内覧前</span>庭・空き地・建物まわりを整えます。</p>
          <ul><li>庭・空き地の草刈り</li><li>庭木の剪定</li><li>建物まわりの片付け</li></ul></div>
      </div>
      <div class="svc-row">
        <h3>残置物の搬出手配<span class="en">CLEAR-OUT</span></h3>
        <div><p><span class="svc-when">媒介開始前・相続物件</span>売主様のご確認後、残置物の整理と搬出を手配します。収集・運搬は必要な許可を有する事業者が担当します。</p>
          <ul><li>売主様確認済みの残置物の搬出手配</li><li>物置・倉庫内の残置物の搬出手配</li></ul></div>
      </div>
      <div class="svc-row">
        <h3>複数業者の手配・調整<span class="en">COORDINATION</span></h3>
        <div><p><span class="svc-when">作業が重なるとき</span>片付け・清掃・補修など複数の作業を、順番と日程を整理して手配します。</p>
          <ul><li>作業の順番と日程の調整</li><li>ご連絡の窓口を一本化</li></ul></div>
      </div>
    </div>
    <p class="svc-foot"><span class="mark">※</span> 許可・資格が必要な作業は、必要な許可・資格を有する事業者を手配できる場合に限ります。記載のない作業も、まずはご相談ください。</p>
    <p class="svc-cta"><a class="more" href="#form" data-track="cta_click" data-track-pos="services">写真を送って案件相談</a></p>
  </div>
</section>

<section class="section section--paper" id="examples" aria-labelledby="ex-title">
  <div class="container">
    <div class="sec-head sec-head--split">
      <div>
        <span class="eyebrow">EXAMPLES</span>
        <h2 class="sec-title" id="ex-title">写真1枚から、<br>売却準備の段取りまで。</h2>
      </div>
      <p class="sec-lead">実際の作業事例ではなく、ご相談の進め方の例です（写真はすべてイメージです）。作業内容と順番は、物件の状況を確認してご案内します。</p>
    </div>
    <div class="examples">
      <article class="example">
        <figure class="example__photo photo">{{img:wall|壁紙をはがし、下地を補修している室内と脚立|(max-width: 1023px) 100vw, 50vw}}<figcaption class="photo__cap">写真はイメージです</figcaption></figure>
        <div class="example__body">
          <p class="example__label">ご相談例 01</p>
          <h3 class="example__q">内覧を控えた空室。壁や建具の傷みが目立つ</h3>
          <ol class="chain">
            <li>補修範囲のご確認（御社）</li><li>小修繕</li><li>空室清掃</li><li class="chain__goal">内覧へ</li>
          </ol>
        </div>
      </article>
      <article class="example">
        <figure class="example__photo photo">{{img:tatami|家具や生活用品が置かれたままの畳の部屋|(max-width: 1023px) 100vw, 50vw}}<figcaption class="photo__cap">写真はイメージです</figcaption></figure>
        <div class="example__body">
          <p class="example__label">ご相談例 02</p>
          <h3 class="example__q">媒介中の相続戸建。内覧前に室内を整えたい</h3>
          <ol class="chain">
            <li>売主様のご了承（御社）</li><li>残置物整理</li><li>空室清掃</li><li class="chain__goal">売却活動へ</li>
          </ol>
        </div>
      </article>
    </div>
  </div>
</section>

<section class="section" id="flow" aria-labelledby="flow-title">
  <div class="container flow-wrap">
    <div class="flow-wrap__head">
      <span class="eyebrow">FLOW</span>
      <h2 class="sec-title" id="flow-title">ご相談から<br>作業までの流れ</h2>
      <p class="sec-lead">最初の一歩は、フォームから写真をお送りいただくことです。見積の内容をご確認いただいてから手配します。</p>
    </div>
    <div>
      {{flow}}
    </div>
  </div>
  <div class="container">{{ctaline:flow}}</div>
</section>

<section class="section section--paper" id="area-map" aria-labelledby="area-title">
  <div class="container">
    <div class="sec-head">
      <span class="eyebrow">AREA</span>
      <h2 class="sec-title" id="area-title">対応エリア</h2>
    </div>
    <div class="area">
      <figure class="area__map">
        <svg class="draw" viewBox="0 78 420 262" role="img" aria-labelledby="area-t">
          <title id="area-t">対応エリアの位置関係の概略図。松山市を中心に、松前町・伊予市・東温市・砥部町が主な対応エリア。</title>
          <g fill="none" stroke-width="1.5">
                        <path d="M205 140 L312 166 M205 140 L224 250 M205 140 L130 218 M130 218 L92 284" stroke="#1e3d38"/>
          </g>
          <g font-size="15" font-weight="700" text-anchor="middle">
            <circle cx="205" cy="140" r="46" fill="#1e3d38"/>
            <text x="205" y="145" fill="#fff" font-size="18">松山市</text>
            <rect x="268" y="146" width="88" height="40" fill="#fff" stroke="#1e3d38"/>
            <text x="312" y="171" fill="#23292a">東温市</text>
            <rect x="180" y="232" width="88" height="40" fill="#fff" stroke="#1e3d38"/>
            <text x="224" y="257" fill="#23292a">砥部町</text>
            <rect x="86" y="198" width="88" height="40" fill="#fff" stroke="#1e3d38"/>
            <text x="130" y="223" fill="#23292a">松前町</text>
            <rect x="48" y="266" width="88" height="40" fill="#fff" stroke="#1e3d38"/>
            <text x="92" y="291" fill="#23292a">伊予市</text>
          </g>
          <text x="12" y="330" font-size="11" fill="#6a7370">N↑</text>
        </svg>
        <figcaption>位置関係の概略図です。縮尺・形状は実際の地図とは<span class="nw">異なります。</span></figcaption>
      </figure>
      <table class="area__table">
        <tbody>
          <tr><th scope="row">主な対応エリア</th><td><strong><span class="nw">松山市</span>・<span class="nw">松前町</span>・<span class="nw">伊予市</span>・<span class="nw">東温市</span>・<span class="nw">砥部町</span></strong><span>上記エリアの物件を中心に、ご相談を受け付けています。</span></td></tr>
          <tr><th scope="row">上記以外</th><td><strong>個別にご相談ください</strong><span>案件内容と対応できる事業者の状況により、お引き受けできない場合があります。</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="section" id="faq" aria-labelledby="faq-title">
  <div class="container faq-wrap">
    <div>
      <h2 class="sec-title" id="faq-title">よくあるご質問</h2>
    </div>
    <div class="faq">
      <details><summary>いつもの業者がいますが利用できますか？</summary><div class="faq__a"><p>はい。業者変更をお願いするサービスではありません。普段の業者で対応できない案件や、小規模・急ぎの案件だけでもご利用いただけます。</p></div></details>
      <details><summary>契約や請求の相手はどこになりますか？</summary><div class="faq__a"><p>見積をご案内する際に、契約・請求の相手先と、作業の責任範囲を書面でお示しします。内容をご確認いただいたうえで、ご依頼をご判断ください。</p></div></details>
      <details><summary>小さい修繕だけでも大丈夫ですか？</summary><div class="faq__a"><p>内容を確認して、対応できるかどうかをご案内します。まずは写真をお送りください。電気工事・給水装置工事など許可・資格が必要な作業は、必要な許可・資格を有する事業者を手配できる場合に限り対応します。</p></div></details>
      <details><summary>見積だけでも大丈夫ですか？</summary><div class="faq__a"><p>まずは案件内容をご相談ください。内容を確認したうえで、対応方法をご案内します。</p></div></details>
      <details><summary>複数の作業をまとめて相談できますか？</summary><div class="faq__a"><p>できます。残置物・清掃・草刈り・小修繕など、売却前に必要な作業をまとめてご相談いただけます。</p></div></details>
      <details><summary>残置物の搬出・処分は、どの事業者が担当しますか？</summary><div class="faq__a"><p>収集・運搬・処分など法令上の許可が必要な業務は、必要な許可を有する事業者が担当します。当窓口は内容を確認し、その事業者への手配と日程の調整を行います。</p></div></details>
      <details><summary>費用はいつ分かりますか？</summary><div class="faq__a"><p>内容を確認したうえで、作業の前に見積をご案内します。見積の内容をご確認いただいてから手配します。写真は任意のため、写真がない段階でもご相談いただけます。</p></div></details>
      <details><summary>不動産会社以外でも利用できますか？</summary><div class="faq__a"><p>基本的には法人・不動産関連事業者様向けですが、案件の内容によっては対応できます。</p></div></details>
    </div>
  </div>
</section>

{{cta}}

<section class="section form-section" id="form" aria-labelledby="form-title">
  <div class="container form-section__inner">
    <div class="form-section__head">
      <span class="eyebrow">CONTACT</span>
      <h2 class="sec-title" id="form-title">写真を送って<br>案件相談</h2>
      <p class="form-lead">分かる範囲だけで構いません。写真と簡単な内容をお送りいただければ、必要な作業の整理から始めます。</p>
      <p class="form-note">不動産会社様向けの窓口です。相談無料、いつもの業者との併用も問題ありません。</p>
    </div>

    {{case_form}}
  </div>
</section>

```

## ファイル：src/sites/sale/partials/cta.html

```html
<section class="cta" aria-labelledby="cta-title">
  {{photo:washitsu|家具が運び出された、障子窓のある畳敷きの明るい和室|cta__bg|写真はイメージです}}
  <div class="container cta__inner">
    <div>
      <span class="eyebrow">FIRST STEP</span>
      <h2 id="cta-title">まずは写真を送って<br>ください。</h2>
      <p class="cta__lead">内容が固まっていなくても構いません。写真と分かる範囲の情報から、必要な作業を整理して、対応できる事業者を確認します。</p>
    </div>
    <div class="cta__box">
      <p class="cta__only">不動産会社様向けの窓口です</p>
      <h3>送っていただくもの</h3>
      <ol>
        <li>相談したい作業（複数可）</li>
        <li>物件の写真（任意・10枚まで）</li>
        <li>物件エリア</li>
        <li>会社名・ご担当者名・ご連絡先</li>
      </ol>
      <a class="btn btn--primary btn--block" href="{{site}}#form" data-track="cta_click" data-track-pos="band">{{cta_label}}</a>
      <small>{{cta_sub2}}</small>
    </div>
  </div>
</section>

```

## ファイル：src/sites/sale/partials/flow.html

```html
<ol class="flow">
        <li><div><h3>写真を送る</h3><p>フォームから、写真・相談したい作業・物件エリアをお送りください。分かる範囲で構いません。</p></div></li>
        <li><div><h3>内容の整理</h3><p>当窓口が必要な作業と順番を整理し、足りない情報があればお問い合わせします。</p></div></li>
        <li><div><h3>事業者の確認・見積<span class="flow__opt">必要に応じて現地確認</span></h3><p>作業に合う事業者の対応可否と日程を確認し、見積と、契約・請求の相手先をご案内します。</p></div></li>
        <li><div><h3>ご承認後に手配・作業</h3><p>見積の内容を御社でご確認いただき、ご承認後に手配します。作業は手配した事業者が行います。</p></div></li>
        <li><div><h3>完了のご報告</h3><p>作業後の状況をお伝えします。売却活動・内覧の準備にお進みください。</p></div></li>
      </ol>

```

## ファイル：src/sites/sale/partials/form-step1.html

```html
          <div class="field field--stack" data-field="status">
            <span class="field__label" id="status-label"><span class="opt">任意</span>いまの売却工程</span>
            <div class="choices" role="radiogroup" aria-labelledby="status-label">
              <label class="choice"><input type="radio" name="status" value="媒介前"><span>媒介前</span></label>
              <label class="choice"><input type="radio" name="status" value="媒介中"><span>媒介中</span></label>
              <label class="choice"><input type="radio" name="status" value="撮影前"><span>撮影前</span></label>
              <label class="choice"><input type="radio" name="status" value="内覧前"><span>内覧前</span></label>
              <label class="choice"><input type="radio" name="status" value="引き渡し前"><span>引き渡し前</span></label>
              <label class="choice"><input type="radio" name="status" value="その他"><span>その他</span></label>
            </div>
          </div>
          <div class="field field--stack" data-field="services">
            <span class="field__label" id="services-label"><span class="req">必須</span>売却準備で必要な作業（複数選択できます）</span>
            <div>
              <div class="choices choices--grid" role="group" aria-labelledby="services-label" aria-describedby="services-err">
                <label class="choice"><input type="checkbox" name="services" value="残置物・片付け"><span>残置物の搬出手配</span></label>
                <label class="choice"><input type="checkbox" name="services" value="空室清掃"><span>空室清掃</span></label>
                <label class="choice"><input type="checkbox" name="services" value="草刈り・外回り"><span>草刈り・外回り整理</span></label>
                <label class="choice"><input type="checkbox" name="services" value="小修繕"><span>小修繕</span></label>
                <label class="choice"><input type="checkbox" name="services" value="複数業者の手配"><span>複数業者の手配をまとめたい</span></label>
                <label class="choice"><input type="checkbox" name="services" value="その他"><span>その他の売却前作業</span></label>
              </div>
              <p class="field__err" id="services-err" aria-live="polite"></p>
            </div>
          </div>
          <div class="field field--stack" data-field="timing">
            <span class="field__label" id="timing-label"><span class="opt">任意</span>希望時期</span>
            <div class="choices" role="radiogroup" aria-labelledby="timing-label">
              <label class="choice"><input type="radio" name="timing" value="急ぎ"><span>急ぎ</span></label>
              <label class="choice"><input type="radio" name="timing" value="1週間程度"><span>1週間程度</span></label>
              <label class="choice"><input type="radio" name="timing" value="1か月以内"><span>1か月以内</span></label>
              <label class="choice"><input type="radio" name="timing" value="時期未定"><span>時期未定</span></label>
            </div>
          </div>
          <div class="field field--stack" data-field="note">
            <label class="field__label" for="note"><span class="opt">任意</span>補足説明</label>
            <div><textarea class="textarea" id="note" name="note" rows="4" placeholder="例）相続した戸建。2階に家具が多く残っています。売主様は県外在住です。"></textarea></div>
          </div>

```

## ファイル：src/sites/sale/partials/form-step2.html

```html
          <div class="field field--stack" data-field="ptype">
            <span class="field__label" id="ptype-label"><span class="opt">任意</span>物件種別</span>
            <div class="choices" role="radiogroup" aria-labelledby="ptype-label">
              <label class="choice"><input type="radio" name="ptype" value="戸建"><span>戸建</span></label>
              <label class="choice"><input type="radio" name="ptype" value="マンション"><span>マンション</span></label>
              <label class="choice"><input type="radio" name="ptype" value="アパート"><span>アパート</span></label>
              <label class="choice"><input type="radio" name="ptype" value="土地"><span>土地</span></label>
              <label class="choice"><input type="radio" name="ptype" value="その他"><span>その他</span></label>
            </div>
          </div>
          <div class="field field--stack" data-field="features">
            <span class="field__label" id="features-label"><span class="opt">任意</span>物件の状況（当てはまるものすべて）</span>
            <div class="choices" role="group" aria-labelledby="features-label">
              <label class="choice"><input type="checkbox" name="features" value="相続物件"><span>相続物件</span></label>
              <label class="choice"><input type="checkbox" name="features" value="空き家"><span>空き家</span></label>
              <label class="choice"><input type="checkbox" name="features" value="売主様が遠方"><span>売主様が遠方</span></label>
            </div>
          </div>

```


---

# 共通ページ・共通部品（src/pages, src/partials）

## ファイル：src/pages/404.html

```html
<section class="nf">
  <div class="container">
    <p class="nf__code">404 NOT FOUND</p>
    <h1>お探しのページが見つかりませんでした</h1>
    <p>URLが変更されたか、入力に誤りがある可能性があります。以下のページからお探しください。</p>
    <ul>
      <li><a href="repair/">愛媛修繕デスク（法人・事業者様向け 建物修繕の相談窓口）</a></li>
      <li><a href="sale-support/">売却前おまかせデスク（不動産会社様向け 売却前の手配窓口）</a></li>
      <li><a href="partner/">協力事業者の募集</a></li>
      <li><a href="privacy/">個人情報の取扱い</a></li>
    </ul>
  </div>
</section>

```

## ファイル：src/pages/credits.html

```html
<section class="phero phero--text" aria-labelledby="page-title">
  <div class="container">
    <nav class="crumbs" aria-label="パンくずリスト"><ol><li><a href="{{base}}">相談窓口のご案内</a></li><li aria-current="page">写真クレジット</li></ol></nav>
  </div>
  <div class="container phero__inner">
    <div>
      <span class="eyebrow">PHOTO CREDITS</span>
      <h1 id="page-title">写真クレジット</h1>
      <p class="phero__lead">本サイトの写真は、商用利用が認められたライセンスの写真素材です。愛媛修繕デスク・売却前おまかせデスクの施工・作業事例ではなく、イメージとして使用しています。写真の一部はトリミングしています。</p>
    </div>
  </div></div>
</section>
<section class="section section--tight">
  <div class="container"><div class="doc">
    {{credits}}
  </div></div>
</section>

```

## ファイル：src/pages/hub.html

```html
<section class="hub" aria-labelledby="hub-title">
  <div class="container">
    <p class="hub__eyebrow">愛媛の不動産・建物事業者向け</p>
    <h1 class="hub__title" id="hub-title">2つの相談窓口</h1>
    <p class="hub__lead">ご用件に合わせて、窓口をお選びください。どちらも、いつものお取引先を変えていただく必要はありません。</p>
    <div class="hub__grid">
      <a class="hub-card hub-card--repair" href="repair/" data-track="hub_select" data-track-pos="repair">
        {{photo:hero|木の壁と無垢材の床の明るい室内|hub-card__photo|-}}
        <span class="hub-card__for">建物修繕でお困りの法人・事業者様</span>
        <h2 class="hub-card__name">愛媛修繕デスク</h2>
        <p class="hub-card__text">いつもの施工会社が手いっぱいの時や、対応できる工種がない時の第二施工店。管理会社様・買取再販事業者様・店舗や施設の運営者様向けです。</p>
        <span class="hub-card__go">愛媛修繕デスクを見る</span>
      </a>
      <a class="hub-card hub-card--sale" href="sale-support/" data-track="hub_select" data-track-pos="sale_support">
        {{photo:kitaroom|家具がなく、無垢材の床が見える明るい室内|hub-card__photo|-}}
        <span class="hub-card__for">売却前の手配でお困りの不動産会社様</span>
        <h2 class="hub-card__name">売却前おまかせデスク</h2>
        <p class="hub-card__text">残置物・清掃・草刈り・小修繕など、売却前の面倒な手配をまとめてご相談いただけます。</p>
        <span class="hub-card__go">売却前おまかせデスクを見る</span>
      </a>
    </div>
    <p class="hub__note">写真はイメージです。協力事業者の募集については<a href="partner/">こちら</a>をご覧ください。</p>
  </div>
</section>
<script>
  // 以前のトップページ（売却前おまかせデスク）のページ内リンク（#form など）で来た場合は、売却前おまかせデスクへ移動する
  (function () { var h = location.hash; if (h && h.length > 1 && /^#[\w-]+$/.test(h) && h !== '#main') location.replace('sale-support/' + h); })();
</script>

```

## ファイル：src/pages/partner.html

```html
<section class="phero" aria-labelledby="page-title">
  <div class="container">
    <nav class="crumbs" aria-label="パンくずリスト"><ol><li><a href="{{base}}">相談窓口のご案内</a></li><li aria-current="page">協力事業者の募集</li></ol></nav>
  </div>
  <div class="container phero__inner">
    <div>
      <span class="eyebrow">FOR PARTNERS</span>
      <h1 id="page-title">松山市・近郊で、<br>修繕や売却前の作業に<br>対応できる事業者様を<br class="br-sp">募集しています。</h1>
      <p class="phero__lead">「愛媛修繕デスク」で法人・事業者様から受け付けた建物修繕のご相談と、「売却前おまかせデスク」で不動産会社様から受け付けた売却前の作業のご相談について、作業内容と地域に合う事業者様へ、案件ごとにご依頼します。</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="#entry">協力事業者として登録を相談する</a>
        <a class="more" href="#trades">募集している作業</a>
      </div>
    </div>
    {{photo:wall|壁紙をはがし、下地を補修している室内と脚立|phero__photo|写真はイメージです|eager}}
  </div>
</section>

<section class="section" aria-labelledby="how-title">
  <div class="container">
    <div class="sec-head">
      <h2 class="sec-title" id="how-title">ご依頼の考え方</h2>
    </div>
    <ol class="points">
      <li><h3>案件ごとに、受けるかどうかを選べます</h3><p>案件の内容・場所・時期をお伝えし、お引き受けいただけるかをご判断いただきます。お断りいただいても問題ありません。</p></li>
      <li><h3>写真と情報を共有してから</h3><p>ご相談者様から受け取った写真と物件情報を共有します。必要に応じて現地確認のうえ、見積をご提出いただきます。</p></li>
      <li><h3>条件は着手前に確認します</h3><p>作業内容・金額・日程・支払条件は、着手前に書面で確認します。条件が合わない場合は、無理にお願いすることはありません。</p></li>
    </ol>
    <div class="notice" data-space="l">
      <h3>ご登録前にご確認ください</h3>
      <ul>
        <li>ご依頼できる案件の数や頻度は、ご相談の状況によって変わるため、お約束できません。</li>
        <li>登録の可否は、作業内容・地域・保有している許可や資格などを確認のうえ、個別にご連絡します。</li>
      </ul>
    </div>
  </div>
</section>

<section class="section section--paper" id="trades" aria-labelledby="trades-title">
  <div class="container">
    <div class="sec-head sec-head--split">
      <div>
        <h2 class="sec-title" id="trades-title">募集している作業</h2>
      </div>
      <p class="sec-lead">以下の作業で、松山市・松前町・伊予市・東温市・砥部町を中心に対応いただける方を募集しています。</p>
    </div>
    <table class="trade-table">
      <caption class="sr-only">募集している作業と、許可・資格についての注意</caption>
      <tbody>
        <tr><th scope="row">内装・原状回復</th><td>クロス・床の張替えや部分補修、退去後の原状回復など</td></tr>
        <tr><th scope="row">建具・外まわり</th><td>建具の調整・交換、外壁や共用部の部分補修など</td></tr>
        <tr><th scope="row">残置物整理・片付け</th><td>家具・家電・生活用品の搬出、相続物件・空き家の室内整理<small>廃棄物の収集運搬には、一般廃棄物・産業廃棄物の収集運搬業許可など、法令で定められた許可が必要です。許可の範囲でのご依頼となります。不用品の買取を行う場合は古物商許可が必要です。</small></td></tr>
        <tr><th scope="row">ハウスクリーニング</th><td>空室の室内清掃、水まわりの清掃、内覧前の簡易清掃など</td></tr>
        <tr><th scope="row">草刈り・外回り</th><td>庭・空き地の草刈り、庭木の剪定、建物周辺の<span class="nw">片付けなど</span></td></tr>
        <tr><th scope="row">小修繕（内装・建具）</th><td>壁紙・床の部分補修、建具の調整、網戸・障子・ふすまの<span class="nw">張替えなど</span></td></tr>
        <tr><th scope="row">電気工事</th><td>照明器具・換気扇・スイッチ・コンセントの<span class="nw">交換など</span><small>電気工事士の資格など、法令で定められた資格・登録をお持ちの方に限ります。</small></td></tr>
        <tr><th scope="row">給排水設備</th><td>水栓・給排水まわりの部品交換や<span class="nw">修理など</span><small>給水装置工事は、各市町の指定給水装置工事事業者であることが必要な場合があります。該当する指定・資格をお持ちの方に限ります。</small></td></tr>
      </tbody>
    </table>
    <div class="notice" data-space="m">
      <h3>許可・資格が必要な業務について</h3>
      <p>廃棄物の収集運搬、電気工事、給水装置工事など、法令で許可・資格・登録・指定が求められる業務は、該当する許可等をお持ちの方にのみご依頼します。許可等をお持ちでない方に、これらの業務をご依頼することはありません。</p>
      <p>また、請負金額によっては建設業許可が必要になる場合があります。登録のご相談時に、保有している資格・許可をお知らせください（確認のため、証明書類の写しをお願いする場合があります）。</p>
    </div>
  </div>
</section>

<section class="section" id="entry" aria-labelledby="entry-title">
  <div class="container">
    <div class="sec-head">
      <h2 class="sec-title" id="entry-title">協力事業者としての登録相談</h2>
      <p class="sec-lead">まずは以下の内容をお送りください。内容を確認のうえ、担当者からご連絡します。</p>
    </div>
    <div class="form-status" data-status-for="partner-form" role="alert" tabindex="-1" hidden></div>
    <form class="form js-form" id="partner-form" data-form="partner" novalidate>
      <fieldset class="fset">
        <legend class="fset__legend">会社・ご担当者様の情報</legend>
        <div class="field" data-field="p_company">
          <label class="field__label" for="p_company"><span class="req">必須</span>会社名・屋号</label>
          <div><input class="input" id="p_company" name="p_company" type="text" autocomplete="organization" required aria-describedby="p_company-err"><p class="field__err" id="p_company-err" aria-live="polite"></p></div>
        </div>
        <div class="field" data-field="p_name">
          <label class="field__label" for="p_name"><span class="req">必須</span>ご担当者名</label>
          <div><input class="input" id="p_name" name="p_name" type="text" autocomplete="name" required aria-describedby="p_name-err"><p class="field__err" id="p_name-err" aria-live="polite"></p></div>
        </div>
        <div class="field" data-field="p_tel">
          <label class="field__label" for="p_tel"><span class="req">必須</span>電話番号</label>
          <div><input class="input" id="p_tel" name="p_tel" type="tel" inputmode="tel" autocomplete="tel" required data-type="tel" aria-describedby="p_tel-hint p_tel-err"><p class="field__hint" id="p_tel-hint">日中つながりやすい番号をご入力ください。</p><p class="field__err" id="p_tel-err" aria-live="polite"></p></div>
        </div>
        <div class="field" data-field="p_email">
          <label class="field__label" for="p_email"><span class="req">必須</span>メールアドレス</label>
          <div><input class="input" id="p_email" name="p_email" type="email" inputmode="email" autocomplete="email" required aria-describedby="p_email-err"><p class="field__err" id="p_email-err" aria-live="polite"></p></div>
        </div>
        <div class="field" data-field="p_city">
          <label class="field__label" for="p_city"><span class="req">必須</span>所在地（市町村）</label>
          <div><input class="input" id="p_city" name="p_city" type="text" autocomplete="address-level2" required placeholder="例）松山市" aria-describedby="p_city-err"><p class="field__err" id="p_city-err" aria-live="polite"></p></div>
        </div>
      </fieldset>
      <fieldset class="fset">
        <legend class="fset__legend">対応内容</legend>
        <div class="field" data-field="p_trades">
          <span class="field__label" id="p_trades-label"><span class="req">必須</span>対応できる作業</span>
          <div>
            <div class="choices" role="group" aria-labelledby="p_trades-label" aria-describedby="p_trades-err">
              <label class="choice"><input type="checkbox" name="p_trades" value="内装・原状回復"><span>内装・原状回復</span></label>
              <label class="choice"><input type="checkbox" name="p_trades" value="建具・外まわり"><span>建具・外まわり</span></label>
              <label class="choice"><input type="checkbox" name="p_trades" value="残置物整理・片付け"><span>残置物整理・片付け</span></label>
              <label class="choice"><input type="checkbox" name="p_trades" value="ハウスクリーニング"><span>ハウスクリーニング</span></label>
              <label class="choice"><input type="checkbox" name="p_trades" value="草刈り・外回り"><span>草刈り・外回り</span></label>
              <label class="choice"><input type="checkbox" name="p_trades" value="小修繕（内装・建具）"><span>小修繕（内装・建具）</span></label>
              <label class="choice"><input type="checkbox" name="p_trades" value="電気工事"><span>電気工事</span></label>
              <label class="choice"><input type="checkbox" name="p_trades" value="給排水設備"><span>給排水設備</span></label>
              <label class="choice"><input type="checkbox" name="p_trades" value="その他"><span>その他</span></label>
            </div>
            <p class="field__err" id="p_trades-err" aria-live="polite"></p>
          </div>
        </div>
        <div class="field" data-field="p_license">
          <label class="field__label" for="p_license"><span class="opt">任意</span>保有資格・許可</label>
          <div><textarea class="textarea" id="p_license" name="p_license" rows="4" aria-describedby="p_license-hint"></textarea><p class="field__hint" id="p_license-hint">一般廃棄物・産業廃棄物の収集運搬業許可、古物商許可、電気工事士、指定給水装置工事事業者、建設業許可など、お持ちのものをご記入ください。</p></div>
        </div>
        <div class="field" data-field="p_area">
          <span class="field__label" id="p_area-label"><span class="opt">任意</span>対応可能なエリア</span>
          <div class="choices" role="group" aria-labelledby="p_area-label">
            <label class="choice"><input type="checkbox" name="p_area" value="松山市"><span>松山市</span></label>
            <label class="choice"><input type="checkbox" name="p_area" value="松前町"><span>松前町</span></label>
            <label class="choice"><input type="checkbox" name="p_area" value="伊予市"><span>伊予市</span></label>
            <label class="choice"><input type="checkbox" name="p_area" value="東温市"><span>東温市</span></label>
            <label class="choice"><input type="checkbox" name="p_area" value="砥部町"><span>砥部町</span></label>
            <label class="choice"><input type="checkbox" name="p_area" value="今治市"><span>今治市</span></label>
          </div>
        </div>
        <div class="field" data-field="p_note">
          <label class="field__label" for="p_note"><span class="opt">任意</span>その他</label>
          <div><textarea class="textarea" id="p_note" name="p_note" rows="4" placeholder="稼働しやすい曜日・時期、得意な工事など"></textarea></div>
        </div>
      </fieldset>
      <div class="consent field-like" data-field="p_agree">
        <div class="consent__row"><span class="req">必須</span><label class="choice"><input type="checkbox" name="p_agree" id="p_agree" value="1" required aria-describedby="p_agree-err"><span>入力した情報の取扱いについて同意します</span></label><a href="{{base}}privacy/" target="_blank" rel="noopener">個人情報の取扱い（別タブで開きます）</a></div>
        <p class="field__err" id="p_agree-err" aria-live="polite"></p>
      </div>
      <div class="form__submit"><button class="btn btn--primary" type="submit">この内容で登録を相談する</button></div>
    </form>
  </div>
</section>

```

## ファイル：src/pages/privacy.html

```html
<section class="phero phero--text" aria-labelledby="page-title">
  <div class="container">
    <nav class="crumbs" aria-label="パンくずリスト"><ol><li><a href="{{base}}">相談窓口のご案内</a></li><li aria-current="page">個人情報の取扱い</li></ol></nav>
  </div>
  <div class="container phero__inner">
    <div>
      <span class="eyebrow">PRIVACY</span>
      <h1 id="page-title">個人情報の取扱い</h1>
      <p class="phero__lead">「愛媛修繕デスク」「売却前おまかせデスク」の案件相談フォームと、協力事業者の登録フォームでお預かりする個人情報と写真の取扱いについて、{{operator_name}}の基本的な考え方をご案内します。</p>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="container"><div class="doc">
    <div class="notice notice--muted"><p>本ページは営業提案用デモサイトにおける記載案です。運営者名・お問い合わせ窓口・保管期間などは、事業内容の確認を経て本番公開時に確定し、掲載します。</p></div>

    <h2 data-space="l">お預かりする情報</h2>
    <ul>
      <li>会社名、ご担当者名、電話番号、メールアドレス</li>
      <li>物件のエリア・住所、物件・建物種別、売却工程や使用状況、相談したい作業・工事内容、緊急度、希望時期、補足説明</li>
      <li>ご相談のきっかけとなったページや、営業のご案内で送付したURLの識別情報（どの窓口・どのご案内からのご相談かを把握するため）</li>
      <li>お送りいただいた写真・ファイル</li>
      <li>協力事業者の登録の場合：所在地、対応できる作業・エリア、保有している許可・資格</li>
    </ul>

    <h2>利用目的</h2>
    <ul>
      <li>ご相談内容の確認、ご連絡、見積・工程のご案内のため</li>
      <li>案件に対応できる事業者を確認・手配するため</li>
      <li>協力事業者としてのご登録について、確認・ご連絡を行うため</li>
    </ul>

    <h2>対応事業者との共有</h2>
    <p>ご相談への対応に必要な範囲で、物件情報・相談内容・写真を、案件を検討する事業者と共有します。共有する場合は、案件の検討・作業に必要な情報に限ります。</p>

    <h2>写真の取扱い</h2>
    <p>写真には、売主様の私物や表札、郵便物など、個人が特定できる情報が写り込むことがあります。可能な範囲で写り込みを避けて撮影してください。お送りいただいた写真は、ご相談への対応以外の目的では使用しません。</p>

    <h2>第三者への提供</h2>
    <p>法令に基づく場合を除き、ご本人の同意なく、上記以外の第三者へ提供することはありません。</p>

    <h2>保管と削除</h2>
    <p>お預かりした情報は、目的に必要な期間保管し、その後は適切な方法で削除します。保管期間と削除のご依頼方法は、本番公開時に掲載します。</p>

    <h2>お問い合わせ窓口</h2>
    <p>個人情報の開示・訂正・削除などのお問い合わせ窓口は、運営者情報とあわせて本番公開時に掲載します。</p>
  </div></div>
</section>

```

## ファイル：src/partials/case-form.html

```html
<!-- 案件相談フォーム（共通の枠）。サービスごとの質問は src/sites/<site>/partials/form-step1.html・form-step2.html（・form-step3.html）で差し込む -->
<div class="case">
      <ol class="stepper" aria-label="入力の進み具合">
        <li class="stepper__item" data-step-ind="1" aria-current="step"><span class="stepper__no">1</span><span class="stepper__label">{{step1_label}}</span></li>
        <li class="stepper__item" data-step-ind="2"><span class="stepper__no">2</span><span class="stepper__label">{{step2_label}}</span></li>
        <li class="stepper__item" data-step-ind="3"><span class="stepper__no">3</span><span class="stepper__label">連絡先</span></li>
      </ol>

      <div class="form-status" data-status-for="case-form" role="alert" tabindex="-1" hidden></div>
      <p class="draft-note" id="draft-note" hidden>前回の入力内容を復元しました。<button type="button" class="linklike" id="draft-clear">入力内容を消す</button></p>

      <form class="case-form js-case-form" id="case-form" data-services-msg="{{services_msg}}" novalidate>
        <fieldset class="cstep" data-step="1">
          <legend class="cstep__legend">STEP 1　{{step1_label}}</legend>
{{form_step1}}          <div class="cstep__nav">
            <button type="button" class="btn btn--primary btn--block" data-next="2">次へ（{{step2_label}}）</button>
          </div>
        </fieldset>

        <fieldset class="cstep" data-step="2" hidden>
          <legend class="cstep__legend">STEP 2　{{step2_label}}</legend>
          <div class="field field--stack" data-field="photos">
            <span class="field__label" id="photos-label"><span class="opt">任意</span>写真（10枚まで）</span>
            <div>
              <div class="upload js-upload">
                <input type="file" id="photos" name="photos" accept="image/*" multiple aria-labelledby="photos-label photos-btn" aria-describedby="photos-hint photos-err">
                <label class="upload__btn" for="photos" id="photos-btn">写真を選ぶ・撮る</label>
                <p class="upload__txt" id="photos-hint">スマートフォンのカメラ・アルバムから複数枚選べます。{{photo_hint}}</p>
              </div>
              <ul class="thumbs js-thumbs" aria-label="選択した写真"></ul>
              <p class="field__err" id="photos-err" aria-live="polite"></p>
            </div>
          </div>
          <div class="field field--stack" data-field="area">
            <label class="field__label" for="area"><span class="req">必須</span>物件エリア</label>
            <div>
              <select class="select" id="area" name="area" required aria-describedby="area-err">
                <option value="">選択してください</option>
                <option>松山市</option><option>松前町</option><option>伊予市</option><option>東温市</option><option>砥部町</option><option>その他の近郊</option>
              </select>
              <p class="field__err" id="area-err" aria-live="polite"></p>
            </div>
          </div>
          <div class="field field--stack" data-field="address">
            <label class="field__label" for="address"><span class="opt">任意</span>物件住所</label>
            <div><input class="input" id="address" name="address" type="text" autocomplete="off" placeholder="町名まででも構いません"></div>
          </div>
{{form_step2}}          <div class="cstep__nav">
            <button type="button" class="btn btn--back" data-prev="1">戻る</button>
            <button type="button" class="btn btn--primary" data-next="3">次へ（連絡先）</button>
          </div>
        </fieldset>

        <fieldset class="cstep" data-step="3" hidden>
          <legend class="cstep__legend">STEP 3　連絡先</legend>
          <div class="field field--stack" data-field="company">
            <label class="field__label" for="company"><span class="req">必須</span>会社名</label>
            <div><input class="input" id="company" name="company" type="text" autocomplete="organization" required aria-describedby="company-err"><p class="field__err" id="company-err" aria-live="polite"></p></div>
          </div>
          <div class="field field--stack" data-field="name">
            <label class="field__label" for="name"><span class="req">必須</span>ご担当者名</label>
            <div><input class="input" id="name" name="name" type="text" autocomplete="name" required aria-describedby="name-err"><p class="field__err" id="name-err" aria-live="polite"></p></div>
          </div>
          <div class="field field--stack field--group" data-field="contact">
            <span class="field__label" id="contact-label"><span class="req">必須</span>電話番号またはメールアドレス（どちらか一方）</span>
            <div class="contact-pair" role="group" aria-labelledby="contact-label" aria-describedby="contact-err">
              <label class="sublabel" for="tel">電話番号</label>
              <input class="input" id="tel" name="tel" type="tel" inputmode="tel" autocomplete="tel" data-type="tel" data-group="contact">
              <label class="sublabel" for="email">メールアドレス</label>
              <input class="input" id="email" name="email" type="email" inputmode="email" autocomplete="email" data-group="contact">
              <p class="field__err" id="contact-err" aria-live="polite"></p>
            </div>
          </div>
{{form_step3}}          <div class="hp" aria-hidden="true"><label for="website">ウェブサイト（入力しないでください）</label><input id="website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
          <p class="form-privacy">送信いただいた内容と写真は、ご相談への対応と、対応できる事業者への確認のために使用します。<a href="{{base}}privacy/" target="_blank" rel="noopener">個人情報の取扱い（別タブで開きます）</a></p>
          <div class="cstep__nav">
            <button type="button" class="btn btn--back" data-prev="2">戻る</button>
            <button type="submit" class="btn btn--primary">この内容で相談を送る</button>
          </div>
        </fieldset>
      </form>

      <div class="case-done" id="case-done" tabindex="-1" hidden>
        <p class="case-done__label">ご相談を受け付けました</p>
        <p class="case-done__text" id="case-text">写真と内容を確認し、担当者から対応方法をご連絡します。</p>
        <p class="case-done__ref"><span class="case-done__id-label">受付番号</span><span class="case-done__id" id="case-id"></span><button type="button" class="linklike" id="case-copy">コピー</button></p>
        <button type="button" class="btn btn--back" id="case-again">続けて別の案件を相談する</button>
      </div>
    </div>

```

## ファイル：src/partials/ctaline.html

```html
<div class="ctaline">
      <p class="ctaline__text">{{ctaline_text}}</p>
      <div class="ctaline__act">
        <a class="btn btn--primary" href="#form" data-track="cta_click" data-track-pos="{{pos}}">{{cta_label}}</a>
      </div>
    </div>

```


---

# ビルド・設定・スクリプト

## ファイル：site.config.json

```json
{
  "_comment": "本番投入前に人間が設定する項目。未設定（null）の項目はサイトに表示されません。架空の値は入れないでください。",
  "operator": {
    "_comment": "運営者情報。設定した項目だけが両サイトのフッターに表示されます。phone を設定すると「電話で相談」ボタンも表示されます。",
    "name": null,
    "address": null,
    "phone": null,
    "phoneHours": null,
    "email": null
  },
  "formEndpoint": null,
  "ga4MeasurementId": null,
  "casePrefix": "MAT"
}

```

## ファイル：build.mjs

```js
// 愛媛修繕デスク／売却前おまかせデスク 静的サイトビルド
// 営業目的の異なる2つのサービスサイトを、共通の部品（ヘッダー・フッター・フォーム・計測・写真）から生成する。
//   /repair/        愛媛修繕デスク（法人向け 建物修繕の第二施工店）       src/sites/repair/
//   /sale-support/  売却前おまかせデスク（不動産会社向け 売却前の手配窓口） src/sites/sale/
//   /               2つの窓口への分岐ページと共通ページ（協力事業者・個人情報・写真クレジット） src/pages/
// GitHub Pages のサブパス配信に対応するため、全リンクは相対パスで生成する。
// 本番公開時は PRODUCTION=1 でビルドすると、検索エンジン向けの noindex を外す。
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const sha1 = (f) => createHash('sha1').update(readFileSync(f)).digest('hex');

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const DIST = process.env.OUT_DIR || join(ROOT, 'dist');
const SITE_URL = 'https://luckys4900.github.io/ehime-shuzen-desk/';
const BASE_PATH = new URL(SITE_URL).pathname;
// 検証用に SITE_CONFIG_OVERRIDE（JSON）で設定を一時的に上書きできる（本番ビルドでは使わない）
const CONFIG = Object.assign(JSON.parse(readFileSync(join(ROOT, 'site.config.json'), 'utf8')), process.env.SITE_CONFIG_OVERRIDE ? JSON.parse(process.env.SITE_CONFIG_OVERRIDE) : {});
const BUILD_ID = (process.env.GITHUB_SHA || 'local').slice(0, 12);
const PRODUCTION = process.env.PRODUCTION === '1';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// 運営者情報：設定されている項目だけを表示する（未設定の項目を架空の値で埋めない）
const OP = Object.fromEntries(Object.entries(CONFIG.operator || {}).filter(([k, v]) => !k.startsWith('_') && v !== null && String(v).trim() !== '').map(([k, v]) => [k, String(v).trim()]));
const PHONE = OP.phone || '';
const PHONE_HREF = PHONE ? 'tel:' + PHONE.replace(/[^\d+]/g, '') : '';

// 区切りの位置でだけ改行させる
const subHtml = (t) => t.split(' ｜ ').map((x) => `<span class="nw">${x}</span>`).join('<span class="sub-sep"> ｜ </span>');

/* ---------- 2つのサービス（表側の文言・色・導線はここで分ける） ---------- */
const SITES = {
  repair: {
    dir: 'repair', slug: 'repair', name: '愛媛修繕デスク', sub: 'EHIME SHUZEN DESK', subJa: false,
    theme: 'theme-repair', siteType: 'repair', businessLine: 'repair_desk', themeColor: '#17283f', og: 'og-repair.png',
    cta: '修繕案件を相談する', sticky: '修繕案件を相談する', stickyShort: '修繕案件を相談',
    ctaSub: '法人・事業者様専用 ｜ いつもの施工会社との併用OK ｜ 松山市・近郊',
    ctaline: { concept: '普段の工事はそのままで。手が回らない案件だけ、ご相談ください。', services: '写真と物件情報から、対応できる施工パートナーを確認します。', flow: '写真と物件情報だけで、ご相談いただけます。' },
    nav: [{ href: 'kanri/', label: '管理会社様' }, { href: 'kaitori/', label: '買取再販事業者様' }, { href: 'shop/', label: '店舗・施設運営者様' }, { href: '#flow', label: 'ご相談の流れ' }],
    footerText: '松山周辺の法人・事業者様向け<br>建物修繕の相談窓口',
    step1: '修繕内容', step2: '写真・物件情報',
    photoHint: '修繕箇所に近づいた写真と、部屋や場所の全体が分かる写真があると判断しやすくなります。',
    services: '工事内容を1つ以上選んでください。',
  },
  sale: {
    dir: 'sale', slug: 'sale-support', name: '売却前おまかせデスク', sub: '松山周辺の不動産会社様向け', subJa: true,
    theme: 'theme-sale', siteType: 'sale_support', businessLine: 'sale_support', themeColor: '#1e3d38', og: 'og-sale.png',
    cta: '写真を送って案件相談', sticky: '写真を送って案件相談', stickyShort: '写真を送って相談',
    ctaSub: '不動産会社様向け ｜ 既存業者との併用OK ｜ 松山市・近郊',
    heroSub: '相談無料 ｜ 既存業者との併用OK ｜ 松山市・近郊対応',
    ctaline: { keep: 'いつもの業者はそのままで。売却前の案件だけ、ご相談ください。', services: '物件の写真から、必要な手配を整理します。', flow: '写真と物件エリアだけで、ご相談いただけます。' },
    nav: [{ href: '#services', label: '対応内容' }, { href: '#examples', label: 'ご相談例' }, { href: '#flow', label: '利用の流れ' }, { href: '#faq', label: 'よくある質問' }],
    footerText: '松山周辺の不動産会社様向け<br>売却前の現場手配・調整の窓口',
    step1: '売却工程・作業', step2: '写真・物件情報',
    photoHint: '全体が分かる写真と、気になる箇所の写真があると整理しやすくなります。',
    services: '必要な作業を1つ以上選んでください。',
  },
  // 分岐ページと共通ページ（協力事業者の募集・個人情報・写真クレジット）
  hub: {
    dir: null, slug: '', name: '愛媛修繕デスク・売却前おまかせデスク', sub: '松山周辺の事業者様向け 相談窓口', subJa: true,
    theme: 'theme-hub', siteType: 'hub', businessLine: '', themeColor: '#1e3d38', og: 'og.png',
    nav: [{ href: 'repair/', label: '愛媛修繕デスク', root: true }, { href: 'sale-support/', label: '売却前おまかせデスク', root: true }],
    footerText: '松山周辺の法人・事業者様、不動産会社様向けの相談窓口',
  },
};

const pages = [
  { site: 'hub', slug: '', file: 'pages/hub.html', title: '愛媛の不動産・建物事業者向け 2つの相談窓口｜愛媛修繕デスク・売却前おまかせデスク', description: '建物修繕の第二施工店「愛媛修繕デスク」と、不動産会社向けの売却前の手配窓口「売却前おまかせデスク」のご案内です。' },
  { site: 'repair', slug: 'repair', home: true, file: 'sites/repair/pages/index.html', label: '愛媛修繕デスク トップ', title: '愛媛修繕デスク｜松山周辺の法人向け 建物修繕の相談窓口', description: '松山市・松前町・伊予市・東温市・砥部町の管理会社様、買取再販事業者様、店舗・施設運営者様向けの建物修繕の相談窓口。いつもの施工会社が手いっぱいの時に、写真と物件情報から修繕のご相談を受け付けます。' },
  { site: 'repair', slug: 'repair/kanri', file: 'sites/repair/pages/kanri.html', label: '愛媛修繕デスク 管理会社様', title: '管理会社様へ｜愛媛修繕デスク', description: '退去後の原状回復、入居中の小修繕など、賃貸管理の修繕手配を写真から相談できる、もう一つの修繕窓口。いつもの施工会社との取引はそのままにご利用いただけます。' },
  { site: 'repair', slug: 'repair/kaitori', file: 'sites/repair/pages/kaitori.html', label: '愛媛修繕デスク 買取再販事業者様', title: '買取再販事業者様へ｜愛媛修繕デスク', description: '仕入れ後の内装補修や販売前の手直しなど、買取再販物件の修繕を写真から相談できる窓口。工事範囲ごとに内訳の分かる見積をご案内します。' },
  { site: 'repair', slug: 'repair/shop', file: 'sites/repair/pages/shop.html', label: '愛媛修繕デスク 店舗・施設運営者様', title: '店舗・施設運営者様へ｜愛媛修繕デスク', description: '店舗・事務所・施設の床や壁の補修、退店時の原状回復など。営業への影響を確認しながら、作業日時を含めてご相談いただけます。' },
  { site: 'sale', slug: 'sale-support', home: true, file: 'sites/sale/pages/index.html', label: '売却前おまかせデスク トップ', title: '松山の不動産会社向け｜売却前の残置物・清掃・小修繕をまとめて相談｜売却前おまかせデスク', description: '松山市周辺の不動産会社向け。売却前の残置物整理、空室清掃、草刈り、小修繕などの手配をまとめて相談。いつもの業者はそのままで、写真を送るだけでご相談いただけます。' },
  { site: 'hub', slug: 'partner', file: 'pages/partner.html', label: '協力事業者の募集', title: '協力事業者の募集｜愛媛修繕デスク・売却前おまかせデスク', description: '松山市・近郊で、建物の修繕や、売却前の残置物整理・清掃・草刈りなどに対応いただける事業者様を募集しています。許可や資格が必要な業務は、該当する許可・資格をお持ちの方にのみご依頼します。' },
  { site: 'hub', slug: 'credits', file: 'pages/credits.html', label: '写真クレジット', title: '写真クレジット｜愛媛修繕デスク・売却前おまかせデスク', description: '愛媛修繕デスク・売却前おまかせデスクのサイトで使用している写真の出典とライセンス。' },
  { site: 'hub', slug: 'privacy', file: 'pages/privacy.html', label: '個人情報の取扱い', title: '個人情報の取扱い｜愛媛修繕デスク・売却前おまかせデスク', description: '愛媛修繕デスク・売却前おまかせデスクの相談フォーム等でお預かりする個人情報・写真の取扱いについて。' },
];
// 旧URL：前バージョンの業種別ページ・問い合わせページは愛媛修繕デスクへ転送する（リンク切れを防ぐ）
// 旧トップのページ内リンク（#form など）は、分岐ページで売却前おまかせデスクへ転送する（src/pages/hub.html）
const redirects = [
  { slug: 'kanri', to: 'repair/kanri/' },
  { slug: 'kaitori', to: 'repair/kaitori/' },
  { slug: 'shop', to: 'repair/shop/' },
  { slug: 'contact', to: 'repair/#form', keepType: true },
];

const read = (p) => readFileSync(join(SRC, p), 'utf8');
const partial = (site, name) => {
  const own = site.dir && join(SRC, 'sites', site.dir, 'partials', name);
  return own && existsSync(own) ? readFileSync(own, 'utf8') : read(join('partials', name));
};
const OG = JSON.parse(read('assets/og.json'));
const PHOTOS = existsSync(join(SRC, 'assets', 'photos', 'photos.json')) ? JSON.parse(read('assets/photos/photos.json')) : {};

// 写真：{{photo:name|代替テキスト|追加クラス|キャプション|eager}} は <figure>、{{img:name|代替テキスト|sizes|eager}} は <img> に展開する
function imgTag(base, name, alt, sizes, eager) {
  const p = PHOTOS[name];
  if (!p) throw new Error(`photo not found: ${name}`);
  const f = (k) => `${base}assets/photos/${name}-${k}.jpg`;
  return `<img src="${f('l')}" srcset="${f('s')} ${p.sw}w, ${f('l')} ${p.lw}w" sizes="${sizes}" width="${p.lw}" height="${p.lh}" alt="${alt}"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}>`;
}
function photo(base, spec) {
  const [name, alt = '', cls = '', cap = '写真はイメージです', eager = ''] = spec.split('|');
  const sizes = /hero__bg/.test(cls) ? '(max-width: 767px) 270vw, 100vw' : /cta__bg/.test(cls) ? '(max-width: 767px) 200vw, 100vw' : '(max-width: 1023px) 100vw, 55vw';
  const capHtml = cap === '-' ? '' : `<figcaption class="photo__cap">${cap}</figcaption>`;
  return `<figure class="photo ${cls}">${imgTag(base, name, alt, sizes, eager)}${capHtml}</figure>`;
}
function img(base, spec) {
  const [name, alt = '', sizes = '100vw', eager = ''] = spec.split('|');
  return imgTag(base, name, alt, sizes, eager);
}

/* ---------- 写真クレジット（実際に使っている写真だけを、使用箇所つきで掲載） ---------- */
function photoUsage() {
  const used = {};
  const add = (src, label) => { for (const m of src.matchAll(/\{\{(?:photo|img):(\w+)/g)) (used[m[1]] ||= new Set()).add(label); };
  for (const p of pages) add(read(p.file), p.label || 'トップページ');
  for (const key of ['repair', 'sale']) add(partial(SITES[key], 'cta.html'), `${SITES[key].name} 末尾のご相談案内（背景）`);
  return used;
}
function creditsHtml(base) {
  const used = photoUsage();
  const ogs = Object.values(OG);
  const rows = Object.entries(PHOTOS).filter(([name]) => used[name] || ogs.some((o) => o.photo === name)).map(([name, p]) => {
    const isPexels = p.source === 'pexels';
    const id = isPexels ? (p.page.match(/photo\/(\d+)/) || [])[1] : '';
    const where = [...(used[name] || [])];
    if (ogs.some((o) => o.photo === name)) where.push('SNS共有用画像（OGP）');
    return `<li class="credit">
  <img src="${base}assets/photos/${name}-s.jpg" width="200" height="150" alt="" loading="lazy" decoding="async">
  <dl>
    <dt>使用箇所</dt><dd>${where.join('、')}</dd>
    <dt>作品名</dt><dd>${isPexels ? `Pexels 写真 ID ${id}（タイトルは出典ページを参照）` : p.title}</dd>
    <dt>撮影者・提供者</dt><dd>${isPexels ? 'Pexels 投稿者（Pexels License ではクレジット表示は任意）' : p.creator}</dd>
    <dt>出典</dt><dd><a href="${p.page}" rel="noopener">${isPexels ? 'Pexels' : 'Flickr'}</a></dd>
    <dt>ライセンス</dt><dd><a href="${p.licenseUrl}" rel="noopener">${p.license}</a></dd>
  </dl>
</li>`;
  }).join('\n');
  return `<ul class="credits">${rows}</ul><p class="credits-note">いずれの写真も、本サイトの表示に合わせて縦横比 4:3 にトリミングし、縮小・圧縮しています（改変あり）。愛媛修繕デスク・売却前おまかせデスクの施工・作業事例ではありません。</p>`;
}

/* ---------- 共通部品：ロゴ・ヘッダー・フッター ---------- */
const logo = (site, href) => `<a class="logo${site.siteType === 'hub' ? ' logo--hub' : ''}" href="${href || './'}" aria-label="${site.name} トップページ">
  <svg class="logo__mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect x="1" y="1" width="38" height="38" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 20 L20 9 L32 20" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 18 V31 H28 V18" fill="none" stroke="currentColor" stroke-width="2"/><rect x="17.5" y="23" width="5" height="8" class="logo__door"/></svg>
  <span class="logo__text"><span class="logo__name">${site.name}</span><span class="logo__sub${site.subJa ? '' : ' logo__sub--en'}">${site.sub}</span></span>
</a>`;

const phoneLink = (cls, track) => PHONE ? `<a class="${cls}" href="${PHONE_HREF}" data-track="phone_click" data-track-pos="${track}">電話で相談</a>` : '';

function header(site, root, siteBase) {
  const items = site.nav.map((n) => `<li><a href="${n.root ? root : siteBase}${n.href}">${n.label}</a></li>`).join('');
  const cta = site.cta ? `${phoneLink('gnav__tel', 'header')}
      <a class="btn btn--primary gnav__cta" href="${siteBase}#form" data-track="cta_click" data-track-pos="header">${site.cta}</a>` : '';
  return `<a class="skip" href="#main">本文へスキップ</a>
<header class="site-header">
  <div class="site-header__inner">
    ${logo(site, siteBase || './')}
    <nav class="gnav" id="gnav" aria-label="メインメニュー">
      <ul class="gnav__list">${items}</ul>
      ${cta}
    </nav>
    <button class="menu-btn" type="button" aria-controls="gnav" aria-expanded="false"><span class="menu-btn__bars" aria-hidden="true"></span><span class="menu-btn__label">メニュー</span></button>
  </div>
</header>`;
}

function operatorHtml() {
  if (!Object.keys(OP).length) return '';
  const rows = [
    OP.name && `<dt>運営</dt><dd>${esc(OP.name)}</dd>`,
    OP.address && `<dt>所在地</dt><dd>${esc(OP.address)}</dd>`,
    OP.phone && `<dt>電話</dt><dd><a href="${PHONE_HREF}" data-track="phone_click" data-track-pos="footer">${esc(OP.phone)}</a>${OP.phoneHours ? `（${esc(OP.phoneHours)}）` : ''}</dd>`,
    OP.email && `<dt>メール</dt><dd><a href="mailto:${esc(OP.email)}">${esc(OP.email)}</a></dd>`,
  ].filter(Boolean).join('');
  return rows ? `<dl class="site-footer__op">${rows}</dl>` : '';
}

function footer(site, root, siteBase, page) {
  const isPartner = page.slug === 'partner';
  const items = (site.siteType === 'hub'
    ? [{ href: 'repair/', label: '愛媛修繕デスク' }, { href: 'sale-support/', label: '売却前おまかせデスク' }, { href: 'partner/', label: '協力事業者の募集' }, { href: 'privacy/', label: '個人情報の取扱い' }, { href: 'credits/', label: '写真クレジット' }].map((n) => ({ ...n, href: root + n.href }))
    : [{ href: siteBase, label: 'トップページ' }, ...(site.siteType === 'repair' ? site.nav.slice(0, 3).map((n) => ({ href: siteBase + n.href, label: n.label })) : []), { href: siteBase + '#form', label: '案件相談フォーム' }, { href: root + 'partner/', label: '協力事業者の募集' }, { href: root + 'privacy/', label: '個人情報の取扱い' }, { href: root + 'credits/', label: '写真クレジット' }])
    .map((n) => `<li><a href="${n.href || './'}">${n.label}</a></li>`).join('');
  let mobile = '';
  if (isPartner) mobile = `<a class="btn btn--primary" href="#entry">協力事業者として登録を相談する</a>`;
  else if (site.cta) mobile = `${PHONE ? `<a class="btn btn--tel" href="${PHONE_HREF}" data-track="phone_click" data-track-pos="sticky">電話で相談</a>` : ''}<a class="btn btn--primary" href="${siteBase}#form" data-track="sticky_cta_click">${PHONE ? site.stickyShort : site.sticky}</a>`;
  return `<footer class="site-footer">
  <div class="container site-footer__inner">
    <div class="site-footer__brand">
      ${logo(site, siteBase || './')}
      <p>${site.footerText}</p>
      <p class="site-footer__area">対応エリア：<span class="nw">松山市</span>・<span class="nw">松前町</span>・<span class="nw">伊予市</span>・<span class="nw">東温市</span>・<span class="nw">砥部町</span>ほか近郊（案件によりご相談）</p>
      ${site.cta && !isPartner ? `<div class="site-footer__cta"><a class="btn btn--primary" href="${siteBase}#form" data-track="cta_click" data-track-pos="footer">${site.cta}</a><p>${subHtml(site.ctaSub)}</p></div>` : ''}
      ${operatorHtml()}
    </div>
    <nav aria-label="フッターメニュー"><ul class="site-footer__nav">${items}</ul></nav>
  </div>
  <div class="container site-footer__note">
    <p>${OP.name ? '' : '本サイトは営業提案用のデモサイトです。運営者情報・連絡先・各種条件は、事業内容の確認を経て本番公開時に掲載します。'}</p>
    <p><small>&copy; 2026 ${OP.name ? esc(OP.name) : site.name}</small></p>
  </div>
</footer>
${mobile ? `<div class="mobile-cta${PHONE && !isPartner ? ' mobile-cta--two' : ''}">${mobile}</div>` : ''}`;
}

/* ---------- 案件相談フォーム：共通のエンジンと枠に、サービスごとの質問を差し込む ---------- */
function caseForm(site) {
  return partial(site, 'case-form.html')
    .replaceAll('{{step1_label}}', site.step1)
    .replaceAll('{{step2_label}}', site.step2)
    .replace('{{form_step1}}', partial(site, 'form-step1.html'))
    .replace('{{form_step2}}', partial(site, 'form-step2.html'))
    .replace('{{form_step3}}', existsSync(join(SRC, 'sites', site.dir, 'partials', 'form-step3.html')) ? partial(site, 'form-step3.html') : '')
    .replaceAll('{{photo_hint}}', site.photoHint)
    .replaceAll('{{services_msg}}', site.services);
}

// GA4 は測定IDが設定されている場合のみ読み込む（IDを自動生成しない）
const GA = CONFIG.ga4MeasurementId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${CONFIG.ga4MeasurementId}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${CONFIG.ga4MeasurementId}');</script>
` : '';
const RUNTIME_CONFIG = `<script>window.OSD_CONFIG=${JSON.stringify({ formEndpoint: CONFIG.formEndpoint || null, casePrefix: CONFIG.casePrefix || 'MAT' })};</script>`;

function layout(page, body) {
  const site = SITES[page.site];
  const depth = page.slug ? page.slug.split('/').length : 0;
  const root = '../'.repeat(depth);
  const siteDepth = site.slug ? site.slug.split('/').length : 0;
  const siteBase = '../'.repeat(depth - siteDepth);
  const canonical = SITE_URL + (page.slug ? page.slug + '/' : '');
  let html = body
    .replace('{{case_form}}', () => caseForm(site))
    .replace(/\{\{ctaline(?::(\w+))?\}\}/g, (_, pos) => partial(site, 'ctaline.html').replace('{{pos}}', pos || 'inline').replace('{{ctaline_text}}', (site.ctaline || {})[pos] || '写真と簡単な内容だけで相談できます。'))
    .replace(/\{\{(cta|flow)\}\}/g, (_, k) => partial(site, k + '.html'));
  html = html
    .replace(/\{\{photo:([^}]+)\}\}/g, (_, spec) => photo(root, spec))
    .replace(/\{\{img:([^}]+)\}\}/g, (_, spec) => img(root, spec))
    .replace('{{credits}}', () => creditsHtml(root))
    .replaceAll('{{base}}', root)
    .replaceAll('{{site}}', siteBase || './')
    .replaceAll('{{cta_label}}', site.cta || '')
    .replaceAll('{{cta_sub}}', subHtml(site.heroSub || site.ctaSub || ''))
    .replaceAll('{{cta_sub2}}', subHtml(site.ctaSub || ''))
    .replaceAll('{{operator_name}}', OP.name ? esc(OP.name) : '本サイトの運営者')
    .replaceAll('{{phone_cta}}', PHONE ? `<a class="btn btn--line" href="${PHONE_HREF}" data-track="phone_click" data-track-pos="inline">電話で相談（${esc(PHONE)}）</a>` : '');
  const bodyClass = [page.home ? 'page-home' : `page-${(page.slug.split('/').pop()) || 'hub'}`, site.theme].join(' ');
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title}</title>
<meta name="description" content="${page.description}">
${PRODUCTION ? '' : '<meta name="robots" content="noindex, nofollow">\n'}<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${page.title}">
<meta property="og:description" content="${page.description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE_URL}assets/${site.og}">
<meta property="og:locale" content="ja_JP">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="${site.themeColor}">
${RUNTIME_CONFIG}
${GA}
<meta name="build" content="${BUILD_ID}">
<link rel="icon" href="${root}assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${root}assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Shippori+Mincho+B1:wght@500;600;700&display=swap">
<link rel="stylesheet" href="${root}assets/style.css">
<script src="${root}assets/main.js" defer></script>
</head>
<body class="${bodyClass}" data-site-type="${site.siteType}"${site.businessLine ? ` data-business-line="${site.businessLine}"` : ''}>
${header(site, root, siteBase)}
<main id="main">
${html}
</main>
${footer(site, root, siteBase, page)}
</body>
</html>
`;
}

// OGP 画像が現在の写真から作られているか確認（写真を差し替えたら node scripts/make-images.mjs を再実行）
for (const [file, o] of Object.entries(OG)) {
  if (sha1(join(SRC, 'assets', 'photos', `${o.photo}-l.jpg`)) !== o.source || sha1(join(SRC, 'assets', file)) !== o.og) {
    throw new Error(`${file} is stale: run \`node scripts/make-images.mjs\` after changing photos or OGP text`);
  }
}

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(join(SRC, 'assets'), join(DIST, 'assets'), { recursive: true, filter: (p) => !/(photos|og)\.json$/.test(p) });

for (const page of pages) {
  const outDir = page.slug ? join(DIST, page.slug) : DIST;
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), layout(page, read(page.file)));
}
for (const r of redirects) {
  mkdirSync(join(DIST, r.slug), { recursive: true });
  const to = `../${r.to}`;
  // 旧問い合わせページの ?type=kanri 等は、愛媛修繕デスクのフォームの業種の初期選択（?seg=）に引き継ぐ
  const js = r.keepType
    ? `var t=new URLSearchParams(location.search).get('type');location.replace(${JSON.stringify(to)}.replace('#form','')+(t?'?seg='+encodeURIComponent(t):'')+'#form');`
    : `location.replace(${JSON.stringify(to)});`;
  writeFileSync(join(DIST, r.slug, 'index.html'), `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<title>このページは移動しました</title><link rel="canonical" href="${SITE_URL}${r.to}">
<meta http-equiv="refresh" content="0; url=${to}">
<script>${js}</script>
</head><body><p>このページは移動しました。<a href="${to}">移動先のページへ</a></p></body></html>
`);
}

// 404（GitHub Pages はルート直下の 404.html を任意パスで返すため、サイトのベースパスからの絶対パスで参照）
const nf = layout({ site: 'hub', slug: '', title: 'ページが見つかりません｜愛媛修繕デスク・売却前おまかせデスク', description: 'お探しのページは見つかりませんでした。' }, read('pages/404.html'))
  .replace(/(href|src)="(?!https?:|\/|#|mailto:|tel:)([^"]*)"/g, `$1="${BASE_PATH}$2"`)
  .replaceAll(`${BASE_PATH}./`, BASE_PATH)
  .replace('<body class="page-hub ', '<body class="page-404 ')
  .replace('<meta name="robots" content="noindex, nofollow">\n', '')
  .replace('<head>', '<head>\n<meta name="robots" content="noindex">');
writeFileSync(join(DIST, '404.html'), nf);

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${SITE_URL}${p.slug ? p.slug + '/' : ''}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(DIST, 'robots.txt'), PRODUCTION
  ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`
  : `# 営業提案用デモのため、検索エンジンへの掲載を拒否しています（本番は PRODUCTION=1 でビルド）\nUser-agent: *\nDisallow: /\n`);
writeFileSync(join(DIST, '.nojekyll'), '');

console.log(`built ${pages.length} pages + ${redirects.length} redirects + 404 -> dist/ (${PRODUCTION ? 'production' : 'demo: noindex'})`);

```

## ファイル：src/assets/main.js

```js
/* 愛媛修繕デスク・売却前おまかせデスク — 共通 UI スクリプト（2サイトで共有） */
(function () {
  'use strict';

  /* ---------- 計測：GA4（gtag）や dataLayer があれば送り、なければ何もしない ----------
     計測ツールを後から入れても、ここを変えずにイベントが届くようにしている。
     すべてのイベントは document の 'osd:track' イベントとしても発行する（検証・他ツール接続用）。 */
  // どちらのサイトで起きたイベントかを必ず付ける（body の data-site-type / data-business-line）
  var SITE_TYPE = document.body.getAttribute('data-site-type') || '';
  var BUSINESS_LINE = document.body.getAttribute('data-business-line') || '';
  function track(name, params) {
    params = Object.assign({ site_type: SITE_TYPE, business_line: BUSINESS_LINE }, params || {});
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name, params);
      else if (Array.isArray(window.dataLayer)) window.dataLayer.push(Object.assign({ event: name }, params));
    } catch (e) { /* 計測の失敗で画面を止めない */ }
    document.dispatchEvent(new CustomEvent('osd:track', { detail: { name: name, params: params } }));
  }
  window.osdTrack = track;
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-track]');
    if (!a) return;
    var p = {};
    if (a.getAttribute('data-track-pos')) p.position = a.getAttribute('data-track-pos');
    track(a.getAttribute('data-track'), p);
  });

  /* ---------- 流入元：営業メールなどで送るURLの utm_* / ref と参照元を、セッションの最初の1回だけ記録する ----------
     案件相談の送信データ（entry）に含め、どの営業送付から案件化したかを台帳で追えるようにする。 */
  var ENTRY_KEY = 'osd-entry-v1';
  function entryInfo() {
    var st; try { st = window.sessionStorage; } catch (e) { st = null; }
    var saved = null;
    try { saved = st && st.getItem(ENTRY_KEY); } catch (e) { saved = null; }
    if (saved) return saved;
    var q = new URLSearchParams(location.search);
    var parts = [];
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'ref'].forEach(function (k) { if (q.get(k)) parts.push(k + '=' + q.get(k).slice(0, 80)); });
    var ref = document.referrer && document.referrer.indexOf(location.origin) !== 0 ? document.referrer.slice(0, 200) : '';
    var v = [parts.join('&') || '(パラメータなし)', 'landing=' + location.pathname, ref ? 'referrer=' + ref : ''].filter(Boolean).join(' | ');
    try { if (st) st.setItem(ENTRY_KEY, v); } catch (e) { /* noop */ }
    return v;
  }
  var ENTRY = entryInfo();

  /* ---------- mobile navigation ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  var gnav = document.getElementById('gnav');
  if (menuBtn && gnav) {
    var setOpen = function (open) {
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.querySelector('.menu-btn__label').textContent = open ? '閉じる' : 'メニュー';
      gnav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
    };
    menuBtn.addEventListener('click', function () { setOpen(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    gnav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setOpen(false); menuBtn.focus(); }
    });
    window.matchMedia('(min-width: 1241px)').addEventListener('change', function (mq) { if (mq.matches) setOpen(false); });
  }

  /* ---------- 別ページからのアンカー移動：Webフォント読み込み後に位置を合わせ直す ---------- */
  // 新しく開いたときだけ。再読み込み・戻る操作や、利用者がすでにスクロールした場合はブラウザの位置を優先する
  var navEntry = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  if (location.hash && location.hash.length > 1 && document.fonts && document.fonts.ready && (!navEntry || navEntry.type === 'navigate')) {
    var userMoved = false;
    var stop = function () { userMoved = true; };
    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) { window.addEventListener(ev, stop, { once: true, passive: true }); });
    document.fonts.ready.then(function () {
      var t = document.getElementById(location.hash.slice(1));
      if (t && !userMoved) t.scrollIntoView({ block: 'start' });
    });
  }

  /* ---------- header over the home hero ---------- */
  var siteHeader = document.querySelector('.site-header');
  if (document.body.classList.contains('page-home') && siteHeader) {
    var onScroll = function () { siteHeader.classList.toggle('is-over', window.scrollY < 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- hide mobile CTA near the final CTA / footer ---------- */
  var mobileCta = document.querySelector('.mobile-cta');
  // 常に表示し、案件相談フォーム（または協力事業者の登録フォーム）が画面にある間だけ隠す（入力欄を覆わないため）
  var hideTargets = document.querySelectorAll('#form, #entry');
  if (mobileCta && 'IntersectionObserver' in window && hideTargets.length) {
    var visible = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) visible.add(en.target); else visible.delete(en.target); });
      mobileCta.classList.toggle('is-hidden', visible.size > 0);
    });
    hideTargets.forEach(function (t) { io.observe(t); });
  }

  /* ---------- forms ---------- */
  var MAX_FILES = 10;
  var MAX_SIZE = 10 * 1024 * 1024;
  var FILE_TYPES = /^(image\/(jpeg|png|heic|heif|webp)|application\/pdf)$/;
  var FILE_EXT = /\.(jpe?g|png|heic|heif|webp|pdf)$/i;

  var MESSAGES = {
    required: 'この項目は必須です。',
    choose: '選択してください。',
    email: 'メールアドレスの形式で入力してください（例：name@example.co.jp）。',
    tel: '電話番号は数字10〜11桁で入力してください。',
    agree: '内容をご確認のうえ、チェックを入れてください。'
  };

  function toHalfWidth(s) {
    return s.replace(/[０-９]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); })
      .replace(/[－ー―‐−–—ｰ]/g, '-')
      .replace(/（/g, '(').replace(/）/g, ')').replace(/　/g, ' ');
  }

  function fieldLabel(form, name) {
    var wrap = form.querySelector('[data-field="' + name + '"]');
    if (/agree$/.test(name)) return '個人情報の取扱いへの同意';
    var lab = wrap && wrap.querySelector('.field__label');
    return lab ? lab.textContent.replace(/必須|任意|推奨/g, '').trim() : name;
  }

  function setError(form, name, msg) {
    var wrap = form.querySelector('[data-field="' + name + '"]');
    var err = document.getElementById(name + '-err');
    if (wrap) wrap.classList.toggle('is-invalid', !!msg);
    if (err) err.textContent = msg || '';
    form.querySelectorAll('[name="' + name + '"]').forEach(function (el) {
      if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    });
  }

  function validateField(form, name) {
    var els = form.querySelectorAll('[name="' + name + '"]');
    if (!els.length) return '';
    var first = els[0];
    var msg = '';
    if (first.type === 'radio') {
      if (first.required && !form.querySelector('[name="' + name + '"]:checked')) msg = MESSAGES.choose;
    } else if (first.type === 'checkbox') {
      var wrap = form.querySelector('[data-field="' + name + '"]');
      var isReq = (wrap && wrap.querySelector('.req')) || first.required;
      var checked = form.querySelector('[name="' + name + '"]:checked');
      if (/agree$/.test(name) && !checked) msg = MESSAGES.agree;
      else if (isReq && !checked) msg = '1つ以上選択してください。';
    } else if (first.type === 'file') {
      return ''; /* 写真は任意。追加時のエラーは選択時に表示済み */
    } else {
      var v = first.value.trim();
      if (first.required && !v) msg = first.tagName === 'SELECT' ? MESSAGES.choose : MESSAGES.required;
      else if (v && first.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = MESSAGES.email;
      else if (v && first.dataset.type === 'tel') {
        var digits = toHalfWidth(v).replace(/[\s()-]/g, '');
        if (!/^0\d{9,10}$/.test(digits)) msg = MESSAGES.tel;
      }
    }
    setError(form, name, msg);
    return msg;
  }

  function fieldNames(form) {
    var names = [];
    form.querySelectorAll('[name]').forEach(function (el) { if (names.indexOf(el.name) < 0) names.push(el.name); });
    return names;
  }

  /* ---------- 送信先 ----------
     site.config.json の formEndpoint（ビルド時に window.OSD_CONFIG へ出力）に送る。
     未設定のときは送信せず「本番接続前」と表示する。検証時は window.EHIME_FORM_ENDPOINT で上書きできる。
     送信は JSON（Content-Type: text/plain）。Google Apps Script のウェブアプリでも CORS の事前確認なしで受け取れる形式。 */
  var CONFIG = window.OSD_CONFIG || {};
  var ENDPOINT = window.EHIME_FORM_ENDPOINT || CONFIG.formEndpoint || null;
  function postJSON(payload) {
    if (!ENDPOINT) return Promise.resolve({ ok: false, reason: 'not_connected' });
    return fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) })
      .then(function (r) {
        if (!r.ok) return { ok: false, reason: 'server' };
        return r.text().then(function (t) {
          var data = {};
          try { data = JSON.parse(t); } catch (e) { data = {}; }
          if (data && data.ok === false) return { ok: false, reason: 'server', data: data };
          return { ok: true, data: data };
        });
      })
      .catch(function () { return { ok: false, reason: 'network' }; });
  }
  function formDataToObject(fd) {
    var o = {};
    fd.forEach(function (v, k) {
      if (typeof v !== 'string') return;
      if (o[k] === undefined) o[k] = v; else o[k] = [].concat(o[k], v);
    });
    return o;
  }
  function submitInquiry(fd, kind) {
    var o = formDataToObject(fd);
    o.formType = kind || 'other';
    o.page = location.href;
    return postJSON(o);
  }

  /* エラー要約を、項目の再判定に合わせて更新する（フォーカスは動かさない） */
  function refreshSummary(form) {
    var box = document.querySelector('[data-status-for="' + form.id + '"]');
    // 送信後のエラー要約を表示している間（data-live）だけ更新する。送信完了の表示中は触らない
    if (!box || box.hidden || !box.hasAttribute('data-live')) return;
    var invalid = [];
    // 写真の追加エラーは送信を止めない注意なので、要約には含めない
    form.querySelectorAll('[data-field].is-invalid').forEach(function (w) { if (!w.querySelector('input[type="file"]')) invalid.push(w.getAttribute('data-field')); });
    // 入力中の更新は控えめに読み上げる（role=alert をやめ、aria-live=polite に切り替える）
    box.setAttribute('role', 'status');
    box.setAttribute('aria-live', 'polite');
    var html;
    if (!invalid.length) {
      box.className = 'form-status';
      html = '<p>入力エラーはすべて解消されました。内容をご確認のうえ、送信してください。</p>';
    } else {
      box.className = 'form-status form-status--error';
      html = summaryHtml(form, invalid.map(function (n) {
        var err = document.getElementById(n + '-err');
        return { name: n, msg: err ? err.textContent : '' };
      }));
    }
    // 内容が変わったときだけ書き換える（同じ内容の再読み上げを防ぐ）
    if (box.getAttribute('data-summary') !== html) {
      box.setAttribute('data-summary', html);
      box.innerHTML = html;
    }
  }

  function summaryHtml(form, errors) {
    var list = errors.map(function (er) {
      var el = form.querySelector('[name="' + er.name + '"]');
      return '<li><a href="#' + (el && el.id ? el.id : '') + '" data-goto="' + er.name + '">' + fieldLabel(form, er.name) + '</a>：' + er.msg + '</li>';
    }).join('');
    return '<h3>入力内容をご確認ください（' + errors.length + '件）</h3><ul>' + list + '</ul>';
  }

  // live: 入力エラーの要約のときだけ true（入力に合わせて要約を更新する）
  function showStatus(form, type, html, live) {
    var box = document.querySelector('[data-status-for="' + form.id + '"]') || form.querySelector('.form-status');
    box.setAttribute('role', 'alert');
    box.removeAttribute('aria-live');
    box.setAttribute('data-summary', html);
    if (live) box.setAttribute('data-live', ''); else box.removeAttribute('data-live');
    if (type === 'done') box.setAttribute('data-done', ''); else box.removeAttribute('data-done');
    box.className = 'form-status' + (type ? ' form-status--' + type : '');
    box.innerHTML = html;
    box.hidden = false;
    box.focus({ preventScroll: true });
    box.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-goto]');
    if (!a) return;
    e.preventDefault();
    var el = document.querySelector('[name="' + a.getAttribute('data-goto') + '"]');
    if (el) { el.focus({ preventScroll: true }); (el.closest('.field, .consent') || el).scrollIntoView({ block: 'center' }); }
  });

  document.querySelectorAll('.js-form').forEach(function (form) {
    var touched = {};
    form.addEventListener('blur', function (e) {
      var t = e.target;
      if (!t.name || t.type === 'file') return;
      touched[t.name] = true;
      validateField(form, t.name);
      refreshSummary(form);
    }, true);
    form.addEventListener('change', function (e) {
      var t = e.target;
      if (t.name && (t.type === 'radio' || t.type === 'checkbox' || t.tagName === 'SELECT')) { validateField(form, t.name); refreshSummary(form); }
    });
    form.addEventListener('input', function (e) {
      var t = e.target;
      var sbox = document.querySelector('[data-status-for="' + form.id + '"]');
      if (sbox && sbox.hasAttribute('data-done')) { sbox.hidden = true; sbox.removeAttribute('data-done'); }
      // エラー表示中の項目は入力のたびに再判定し、直った時点でメッセージを消す（離脱時のレイアウトのずれを防ぐ）
      var wrap = t.name && form.querySelector('[data-field="' + t.name + '"]');
      if (t.name && (touched[t.name] || (wrap && wrap.classList.contains('is-invalid')))) { validateField(form, t.name); refreshSummary(form); }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var errors = [];
      fieldNames(form).forEach(function (n) {
        var m = validateField(form, n);
        if (m) errors.push({ name: n, msg: m });
      });
      if (errors.length) {
        showStatus(form, 'error', summaryHtml(form, errors), true);
        return;
      }
      var fd = new FormData(form);
      // 電話番号は半角数字のみ（例：0899123456）に正規化して送る
      form.querySelectorAll('[data-type="tel"]').forEach(function (el) { fd.set(el.name, toHalfWidth(el.value).replace(/\D/g, '')); });
      var input = form.querySelector('input[type="file"]');
      if (input && input._files) { fd.delete(input.name); input._files.forEach(function (f) { fd.append(input.name, f); }); }
      var btn = form.querySelector('button[type="submit"]');
      if (btn.disabled) return;
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
      submitInquiry(fd, form.getAttribute('data-form')).then(function (res) {
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
        if (res.ok) {
          showStatus(form, 'done', '<h3>送信しました</h3><p>内容を確認のうえ、担当者からご連絡します。</p>');
          form.reset();
          // 次の相談に前回の写真や入力状態が残らないよう、写真の選択と判定状態も初期化する
          touched = {};
          form.dispatchEvent(new CustomEvent('form:cleared'));
        } else if (res.reason === 'not_connected') {
          showStatus(form, 'done', '<h3>入力内容の確認が完了しました</h3><p>本サイトは営業提案用のデモサイトのため、フォームは送信先に接続されていません（本番接続前）。実際の送信は行われていません。</p>');
        } else if (res.reason === 'network') {
          showStatus(form, 'error', '<h3>送信できませんでした</h3><p>通信に失敗しました。インターネット接続をご確認のうえ、もう一度お試しください。入力内容は保持されています。</p>');
        } else {
          showStatus(form, 'error', '<h3>送信できませんでした</h3><p>時間をおいて、もう一度お試しください。入力内容は保持されています。</p>');
        }
      });
    });

    /* ---------- photo upload ---------- */
    var upload = form.querySelector('.js-upload');
    if (!upload) return;
    var input = upload.querySelector('input[type="file"]');
    var thumbs = form.querySelector('.js-thumbs');
    input._files = [];

    function render() {
      thumbs.innerHTML = '';
      input._files.forEach(function (f, i) {
        var li = document.createElement('li');
        if (/^image\/(jpeg|png|webp)$/.test(f.type)) {
          var img = document.createElement('img');
          img.alt = '';
          img.src = URL.createObjectURL(f);
          img.onload = function () { URL.revokeObjectURL(img.src); };
          li.appendChild(img);
        } else {
          var ph = document.createElement('div');
          ph.className = 'thumbs__file';
          ph.textContent = /pdf$/i.test(f.name) ? 'PDF' : 'FILE';
          li.appendChild(ph);
        }
        var name = document.createElement('span');
        name.textContent = f.name;
        li.appendChild(name);
        var del = document.createElement('button');
        del.type = 'button';
        del.setAttribute('aria-label', f.name + ' を削除');
        del.textContent = '×';
        del.addEventListener('click', function () { input._files.splice(i, 1); input._fileError = ''; setError(form, input.name, ''); render(); input.focus(); });
        li.appendChild(del);
        thumbs.appendChild(li);
      });
      upload.querySelector('.upload__btn').textContent = input._files.length ? '写真・ファイルを追加する（' + input._files.length + '件選択中）' : '写真・ファイルを選ぶ';
    }

    function addFiles(list) {
      var rejected = [];
      Array.prototype.forEach.call(list, function (f) {
        if (!(FILE_TYPES.test(f.type) || FILE_EXT.test(f.name))) rejected.push(f.name + '（対応していない形式）');
        else if (f.size > MAX_SIZE) rejected.push(f.name + '（10MBを超えています）');
        else if (input._files.length >= MAX_FILES) rejected.push(f.name + '（上限の10件を超えています）');
        else input._files.push(f);
      });
      input._fileError = rejected.length ? '追加できなかったファイルがあります：' + rejected.join('、') : '';
      setError(form, input.name, input._fileError);
      render();
    }

    input.addEventListener('change', function () { addFiles(input.files); input.value = ''; });
    form.addEventListener('form:cleared', function () { input._files = []; input._fileError = ''; setError(form, input.name, ''); render(); });
    ['dragenter', 'dragover'].forEach(function (ev) { upload.addEventListener(ev, function (e) { e.preventDefault(); upload.classList.add('is-drag'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { upload.addEventListener(ev, function (e) { e.preventDefault(); upload.classList.remove('is-drag'); }); });
    upload.addEventListener('drop', function (e) { if (e.dataTransfer) addFiles(e.dataTransfer.files); });
  });

  /* =====================================================================
     案件相談フォーム（3ステップ・同一ページ）
     ===================================================================== */
  var caseForm = document.getElementById('case-form');
  if (caseForm) (function (form) {
    var DRAFT_KEY = 'osd-case-draft-v1-' + (BUSINESS_LINE || 'case');  // サービスごとに下書きを分ける
    var PHOTO_MAX = 10;
    var PHOTO_RAW_MAX = 20 * 1024 * 1024;  // 元ファイルの上限（スマホ写真を想定）
    var PHOTO_EDGE = 1600;                 // 送信前に長辺1600pxへ縮小する
    var steps = form.querySelectorAll('.cstep');
    var indicators = document.querySelectorAll('[data-step-ind]');
    var statusBox = document.querySelector('[data-status-for="case-form"]');
    var done = document.getElementById('case-done');
    var current = 1;
    var started = false;
    var photos = [];   // { file, name, dataUrl(縮小後), w, h }

    function storage() { try { return window.localStorage; } catch (e) { return null; } }

    /* ---- 入力チェック ---- */
    function stepFields(n) {
      var names = [];
      steps[n - 1].querySelectorAll('[data-field]').forEach(function (w) { names.push(w.getAttribute('data-field')); });
      return names;
    }
    function check(name) {
      if (name === 'contact') {
        var tel = form.tel.value.trim(), mail = form.email.value.trim(), msg = '';
        if (!tel && !mail) msg = '電話番号かメールアドレスのどちらかを入力してください。';
        else if (tel && !/^0\d{9,10}$/.test(toHalfWidth(tel).replace(/[\s()-]/g, ''))) msg = MESSAGES.tel;
        else if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) msg = MESSAGES.email;
        var w = form.querySelector('[data-field="contact"]');
        w.classList.toggle('is-invalid', !!msg);
        document.getElementById('contact-err').textContent = msg;
        [form.tel, form.email].forEach(function (el) { if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid'); });
        return msg;
      }
      if (name === 'services') {
        var m = form.querySelector('[name="services"]:checked') ? '' : (form.getAttribute('data-services-msg') || '相談したい内容を1つ以上選んでください。');
        setError(form, 'services', m);
        return m;
      }
      if (name === 'photos') return '';
      return validateField(form, name);
    }
    function checkStep(n) {
      var bad = [];
      stepFields(n).forEach(function (f) { if (check(f)) bad.push(f); });
      return bad;
    }
    function focusField(name) {
      var el = name === 'contact' ? form.tel : form.querySelector('[name="' + name + '"]');
      if (!el) return;
      el.focus({ preventScroll: true });
      (el.closest('.field') || el).scrollIntoView({ block: 'center' });
    }

    /* ---- ステップ切り替え ---- */
    function go(n, opts) {
      opts = opts || {};
      current = n;
      steps.forEach(function (fs) { fs.hidden = Number(fs.getAttribute('data-step')) !== n; });
      indicators.forEach(function (li) {
        var k = Number(li.getAttribute('data-step-ind'));
        li.classList.toggle('is-done', k < n);
        if (k === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      });
      if (statusBox) statusBox.hidden = true;
      saveDraft();
      if (!opts.silent) {
        var legend = steps[n - 1].querySelector('.cstep__legend');
        document.querySelector('.stepper').scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        legend.setAttribute('tabindex', '-1');
        legend.focus({ preventScroll: true });
      }
    }
    form.addEventListener('click', function (e) {
      var next = e.target.closest('[data-next]');
      var prev = e.target.closest('[data-prev]');
      if (next) {
        var bad = checkStep(current);
        if (bad.length) { focusField(bad[0]); return; }
        go(Number(next.getAttribute('data-next')));
      } else if (prev) {
        go(Number(prev.getAttribute('data-prev')));
      }
    });

    /* ---- 入力中の再判定・下書き保存・計測 ---- */
    function markStart() { if (!started) { started = true; track('form_start'); } }
    form.addEventListener('focusin', markStart);
    form.addEventListener('input', function (e) {
      markStart();
      var t = e.target;
      var group = t.getAttribute && t.getAttribute('data-group');
      var key = group || t.name;
      var w = key && form.querySelector('[data-field="' + key + '"]');
      if (w && w.classList.contains('is-invalid')) check(key);
      saveDraft();
    });
    form.addEventListener('change', function (e) {
      var t = e.target;
      if (t.name === 'services') { check('services'); if (t.checked) track('service_select', { service: t.value }); }
      else if (t.name && t.type !== 'file') { var w = form.querySelector('[data-field="' + t.name + '"]'); if (w && w.classList.contains('is-invalid')) check(t.name); }
      saveDraft();
    });
    form.addEventListener('blur', function (e) {
      var t = e.target;
      if (!t.name || t.type === 'file' || t.type === 'checkbox' || t.type === 'radio') return;
      var key = t.getAttribute('data-group') || t.name;
      if (key === 'contact' && (!form.tel.value.trim() && !form.email.value.trim())) return; // 片方入力中は急かさない
      if (t.value.trim() || form.querySelector('[data-field="' + key + '"]').classList.contains('is-invalid')) check(key);
    }, true);

    function saveDraft() {
      var st = storage(); if (!st) return;
      var data = { step: current, v: {} };
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || el.type === 'file' || el.name === 'website') return;
        if (el.type === 'checkbox') { (data.v[el.name] = data.v[el.name] || []); if (el.checked) data.v[el.name].push(el.value); }
        else if (el.type === 'radio') { if (el.checked) data.v[el.name] = el.value; }
        else data.v[el.name] = el.value;
      });
      try { st.setItem(DRAFT_KEY, JSON.stringify(data)); } catch (e) { /* 保存できなくても入力は続けられる */ }
    }
    function restoreDraft() {
      var st = storage(); if (!st) return false;
      var raw; try { raw = st.getItem(DRAFT_KEY); } catch (e) { return false; }
      if (!raw) return false;
      var data; try { data = JSON.parse(raw); } catch (e) { return false; }
      var any = false;
      Object.keys(data.v || {}).forEach(function (k) {
        var val = data.v[k];
        form.querySelectorAll('[name="' + k + '"]').forEach(function (el) {
          if (el.type === 'checkbox') { el.checked = Array.isArray(val) && val.indexOf(el.value) >= 0; if (el.checked) any = true; }
          else if (el.type === 'radio') { el.checked = el.value === val; if (el.checked) any = true; }
          else { el.value = val || ''; if (val) any = true; }
        });
      });
      if (any && data.step >= 1 && data.step <= 3) go(data.step, { silent: true });
      return any;
    }
    function clearDraft() { var st = storage(); if (st) try { st.removeItem(DRAFT_KEY); } catch (e) { /* noop */ } }
    if (restoreDraft()) document.getElementById('draft-note').hidden = false;
    // 業種別ページからの導線（?seg=kanri 等）は、業種の選択肢を初期選択にする（未選択のときだけ）
    var seg = new URLSearchParams(location.search).get('seg');
    var segInput = seg && form.querySelector('[data-seg="' + seg.replace(/[^a-z]/g, '') + '"]');
    if (segInput && !form.querySelector('[name="' + segInput.name + '"]:checked')) segInput.checked = true;
    document.getElementById('draft-clear').addEventListener('click', function () {
      form.reset(); photos = []; renderPhotos(); clearDraft(); go(1, { silent: true });
      form.querySelectorAll('.is-invalid').forEach(function (w) { w.classList.remove('is-invalid'); });
      form.querySelectorAll('.field__err').forEach(function (p) { p.textContent = ''; });
      document.getElementById('draft-note').hidden = true;
    });

    /* ---- 写真：選択→縮小→プレビュー ---- */
    var input = document.getElementById('photos');
    var thumbs = form.querySelector('.js-thumbs');
    var upBtn = form.querySelector('.upload__btn');
    function shrink(file) {
      return new Promise(function (resolve) {
        var url = URL.createObjectURL(file);
        var img = new Image();
        img.onload = function () {
          var r = Math.min(1, PHOTO_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
          var c = document.createElement('canvas');
          c.width = Math.round(img.naturalWidth * r); c.height = Math.round(img.naturalHeight * r);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          URL.revokeObjectURL(url);
          resolve({ dataUrl: c.toDataURL('image/jpeg', 0.82), w: c.width, h: c.height });
        };
        img.onerror = function () {
          // ブラウザが表示できない形式（Chrome の HEIC など）は、元のファイルのまま送る
          URL.revokeObjectURL(url);
          var fr = new FileReader();
          fr.onload = function () { resolve({ dataUrl: fr.result, w: 0, h: 0, raw: true }); };
          fr.onerror = function () { resolve(null); };
          fr.readAsDataURL(file);
        };
        img.src = url;
      });
    }
    function renderPhotos() {
      thumbs.innerHTML = '';
      photos.forEach(function (p, i) {
        var li = document.createElement('li');
        if (p.dataUrl && /^data:image\/(jpeg|png|webp|gif)/.test(p.dataUrl)) {
          var im = document.createElement('img'); im.alt = p.name; im.src = p.dataUrl; li.appendChild(im);
        } else {
          var ph = document.createElement('div'); ph.className = 'thumbs__file'; ph.textContent = (p.name.split('.').pop() || 'FILE').toUpperCase(); li.appendChild(ph);
        }
        var nm = document.createElement('span'); nm.textContent = p.name; li.appendChild(nm);
        var del = document.createElement('button'); del.type = 'button'; del.textContent = '×';
        del.setAttribute('aria-label', p.name + ' を削除');
        del.addEventListener('click', function () { photos.splice(i, 1); setError(form, 'photos', ''); renderPhotos(); input.focus(); });
        li.appendChild(del);
        thumbs.appendChild(li);
      });
      upBtn.textContent = photos.length ? '写真を追加する（' + photos.length + ' / ' + PHOTO_MAX + '枚）' : '写真を選ぶ・撮る';
    }
    function addPhotos(list) {
      markStart();
      var files = Array.prototype.slice.call(list);
      var rejected = [];
      var jobs = [];
      files.forEach(function (f) {
        var isImg = /^image\//.test(f.type) || /\.(jpe?g|png|heic|heif|webp)$/i.test(f.name);
        if (!isImg) { rejected.push(f.name + '（写真ではありません）'); return; }
        if (f.size > PHOTO_RAW_MAX) { rejected.push(f.name + '（20MBを超えています）'); return; }
        if (photos.length + jobs.length >= PHOTO_MAX) { rejected.push(f.name + '（上限の' + PHOTO_MAX + '枚を超えています）'); return; }
        jobs.push(shrink(f).then(function (r) { return r ? { file: f, name: f.name, dataUrl: r.dataUrl, w: r.w, h: r.h } : null; }));
      });
      upBtn.textContent = '写真を読み込んでいます…';
      Promise.all(jobs).then(function (list2) {
        var added = list2.filter(Boolean);
        photos = photos.concat(added);
        setError(form, 'photos', rejected.length ? '追加できなかった写真があります：' + rejected.join('、') : '');
        renderPhotos();
        if (added.length) track('photo_upload', { count: added.length, total: photos.length });
      });
    }
    input.addEventListener('change', function () { addPhotos(input.files); input.value = ''; });
    var up = form.querySelector('.js-upload');
    ['dragenter', 'dragover'].forEach(function (ev) { up.addEventListener(ev, function (e) { e.preventDefault(); up.classList.add('is-drag'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { up.addEventListener(ev, function (e) { e.preventDefault(); up.classList.remove('is-drag'); }); });
    up.addEventListener('drop', function (e) { if (e.dataTransfer) addPhotos(e.dataTransfer.files); });

    /* ---- 送信 ---- */
    function showError(html) {
      statusBox.className = 'form-status form-status--error';
      statusBox.innerHTML = html;
      statusBox.hidden = false;
      statusBox.focus({ preventScroll: true });
      statusBox.scrollIntoView({ block: 'center' });
    }
    function today() {
      var d = new Date();
      return d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    }
    function showDone(caseId, demo) {
      form.hidden = true;
      document.querySelector('.stepper').hidden = true;
      statusBox.hidden = true;
      document.getElementById('draft-note').hidden = true;
      done.hidden = false;
      done.classList.toggle('is-demo', !!demo);
      document.getElementById('case-id').textContent = caseId || '担当者からお知らせします';
      document.getElementById('case-copy').hidden = !caseId || !!demo;
      document.getElementById('case-text').textContent = demo
        ? 'このサイトは営業提案用のデモで、送信先に接続していないため、実際には送信されていません。本番では、写真と内容を確認し、担当者から対応方法をご連絡します（下の形式の受付番号もお知らせします）。'
        : '写真と内容を確認し、担当者から対応方法をご連絡します。お問い合わせの際は、下の受付番号をお伝えください。';
      done.querySelector('.case-done__label').textContent = demo ? '入力内容の確認まで完了しました（デモ）' : 'ご相談を受け付けました';
      done.querySelector('.case-done__id-label').textContent = demo ? '受付番号の表示例' : '受付番号';
      done.focus({ preventScroll: true });
      done.scrollIntoView({ block: 'center' });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      for (var n = 1; n <= 3; n++) {
        var bad = checkStep(n);
        if (bad.length) {
          if (n !== current) go(n, { silent: true });
          showError('<h3>入力内容をご確認ください</h3><p>' + (n < 3 ? 'STEP ' + n + ' に未入力の項目があります。' : '赤く表示された項目をご確認ください。') + '</p>');
          focusField(bad[0]);
          return;
        }
      }
      if (form.website.value) return; // スパム対策（人には見えない欄）
      var btn = form.querySelector('button[type="submit"]');
      if (btn.disabled) return;
      var fd = new FormData(form);
      var payload = formDataToObject(fd);
      // 複数選択の項目は、選択数に関わらず配列で送る
      form.querySelectorAll('input[type="checkbox"][name]').forEach(function (el) { payload[el.name] = fd.getAll(el.name); });
      payload.tel = toHalfWidth(form.tel.value).replace(/\D/g, '');
      payload.email = form.email.value.trim();
      payload.formType = 'case';
      payload.business_line = BUSINESS_LINE;  // repair_desk / sale_support：どちらのサイトの案件かを台帳に残す
      payload.site_type = SITE_TYPE;
      payload.entry = ENTRY;
      payload.page = location.href;
      payload.photos = photos.map(function (p) { return { name: p.name, dataUrl: p.dataUrl }; });
      delete payload.website;
      if (!ENDPOINT) {
        track('form_submit', { mode: 'demo', services: payload.services.join(','), photos: photos.length });
        showDone((CONFIG.casePrefix || 'MAT') + '-' + today() + '-001', true);
        return;
      }
      btn.disabled = true; btn.setAttribute('aria-busy', 'true'); btn.textContent = '送信しています…';
      postJSON(payload).then(function (res) {
        btn.disabled = false; btn.removeAttribute('aria-busy'); btn.textContent = 'この内容で相談を送る';
        if (res.ok) {
          var id = res.data && res.data.caseId;
          track('form_submit', { mode: 'live', services: payload.services.join(','), photos: photos.length, case_id: id || '' });
          clearDraft();
          showDone(id, false);
        } else if (res.reason === 'network') {
          showError('<h3>送信できませんでした</h3><p>通信に失敗しました。電波の良い場所で、もう一度お試しください。入力内容と写真は保持されています。</p>');
        } else {
          showError('<h3>送信できませんでした</h3><p>時間をおいて、もう一度お試しください。入力内容と写真は保持されています。</p>');
        }
      });
    });

    document.getElementById('case-copy').addEventListener('click', function () {
      var id = document.getElementById('case-id').textContent;
      var b = this;
      var ok = function () { b.textContent = 'コピーしました'; };
      if (navigator.clipboard) navigator.clipboard.writeText(id).then(ok, function () {}); 
    });
    document.getElementById('case-again').addEventListener('click', function () {
      form.reset(); photos = []; renderPhotos(); clearDraft();
      form.querySelectorAll('.is-invalid').forEach(function (w) { w.classList.remove('is-invalid'); });
      form.querySelectorAll('.field__err').forEach(function (p) { p.textContent = ''; });
      done.hidden = true; form.hidden = false; document.querySelector('.stepper').hidden = false;
      started = false;
      go(1);
    });
  })(caseForm);
})();

```

## ファイル：scripts/qa.mjs

```js
// ブラウザ QA：全ルート × ブレークポイントで横スクロール・コンソールエラー・リンク・フォーム等を検証し、スクリーンショットを保存
// 使い方: node scripts/qa.mjs [baseURL]   （省略時はローカルサーバーを起動）
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { serve } from './serve.mjs';
import { routeFonts } from './pw.mjs';

const arg = process.argv[2];
let srv;
const BASE = arg || 'http://localhost:4173/ehime-shuzen-desk/';
if (!arg) srv = await serve(4173);
const WRITE = process.env.QA_WRITE === '1'; // 1 のときだけ docs/screenshots と harness/qa-result.json を更新する
const SHOT_DIR = new URL('../docs/screenshots/', import.meta.url).pathname;
mkdirSync(SHOT_DIR, { recursive: true });

const REPAIR = BASE + 'repair/';
const SALE = BASE + 'sale-support/';
// 分岐ページ・2サイトのトップ・共通ページは全幅で、愛媛修繕デスクの業種別ページはスマホとPCの2幅で確認する
const routes = ['', 'repair/', 'sale-support/', 'partner/', 'privacy/', 'credits/', 'repair/kanri/', 'repair/kaitori/', 'repair/shop/'];
const SUB_ONLY = (r) => /^repair\/\w+\/$/.test(r);
const widths = [390, 430, 768, 1024, 1240, 1440];
const shots = { '': ['desktop', 'mobile'], 'repair/': ['desktop', 'mobile'], 'sale-support/': ['desktop', 'mobile'], 'partner/': ['mobile'] };
const results = { base: BASE, date: new Date().toISOString(), checks: [], failures: [] };
const fail = (m) => { results.failures.push(m); };
const ok = (m) => { results.checks.push(m); };

const browser = await chromium.launch();
const linkSet = new Set();

for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 844 : 900 }, deviceScaleFactor: 1 });
  await routeFonts(ctx);
  for (const r of routes) {
    if (SUB_ONLY(r) && w !== 390 && w !== 1440) continue;
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('requestfailed', (req) => { if (!/fonts\.g/.test(req.url())) errors.push('requestfailed ' + req.url()); });
    const res = await page.goto(BASE + r, { waitUntil: 'networkidle' });
    if (res.status() !== 200) fail(`${r || '/'} @${w}: status ${res.status()}`);
    await page.evaluate(() => document.fonts.ready);
    const m = await page.evaluate(async () => {
      const de = document.documentElement;
      const over = [];
      document.querySelectorAll('body *').forEach((el) => {
        const rc = el.getBoundingClientRect();
        if (rc.width && (rc.right > de.clientWidth + 1 || rc.left < -1) && getComputedStyle(el).position !== 'fixed' && !el.closest('.gnav') && !el.closest('.skip')) over.push(el.tagName + '.' + el.className);
      });
      return {
        sw: de.scrollWidth, cw: de.clientWidth, over: over.slice(0, 5),
        imgsNoAlt: [...document.querySelectorAll('img:not([alt])')].length,
        svgNoLabel: [...document.querySelectorAll('svg[role="img"]')].filter((s) => !s.getAttribute('aria-labelledby') && !s.getAttribute('aria-label')).length,
        h1: document.querySelectorAll('h1').length,
        title: document.title, desc: document.querySelector('meta[name="description"]')?.content,
        og: document.querySelector('meta[property="og:image"]')?.content,
        icon: document.querySelector('link[rel="icon"]')?.href,
        links: [...document.querySelectorAll('a[href]')].map((a) => a.href),
        unlabeled: [...document.querySelectorAll('input:not([type=hidden]), select, textarea')].filter((el) => !(el.labels && el.labels.length) && !el.getAttribute('aria-labelledby') && !el.getAttribute('aria-label')).map((el) => el.name),
        smallTap: [...document.querySelectorAll('a.btn, button')].filter((el) => { const b = el.getBoundingClientRect(); return b.width && b.height < 40; }).length,
        narrowHeads: innerWidth < 768 ? [...document.querySelectorAll('h1, h2')].filter((h) => h.getBoundingClientRect().width && h.getBoundingClientRect().width < de.clientWidth * 0.7 && !h.closest('.cta__box, .rel')).map((h) => h.textContent.trim().slice(0, 12)) : [],
        orphanLines: [...document.querySelectorAll('h1, h2, h3, main p, main li, main dd, main th, main td, main small, main figcaption, .faq summary, .prep__list span, .facts__v')].filter((h) => h.offsetParent !== null).map((h) => {
          const counts = [];
          const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
          let node;
          while ((node = walker.nextNode())) {
            // 同じブロックの文字だけを数える（子ブロックの文字は別に評価する）
            if (node.parentElement !== h && !node.parentElement.matches('a, .nw, .mark, strong, em, small')) continue;
            if (node.parentElement !== h && node.parentElement.matches('small') && getComputedStyle(node.parentElement).display === 'block') continue;
            for (let i = 0; i < node.length; i++) {
              if (/\s/.test(node.data[i])) continue;
              const r = document.createRange(); r.setStart(node, i); r.setEnd(node, i + 1);
              const rect = r.getClientRects()[0];
              if (!rect) continue;
              const top = Math.round(rect.top);
              const line = counts.find((c) => Math.abs(c.top - top) < 6);
              if (line) line.n++; else counts.push({ top, n: 1 });
            }
          }
          counts.sort((x, y) => x.top - y.top);
          return counts.length > 1 && counts.some((c, i) => c.n <= (i === counts.length - 1 ? 2 : 1)) ? h.textContent.trim().slice(0, 14) : null;
        }).filter(Boolean),
        areaStrongLines: [...document.querySelectorAll('.area__table td strong')].map((el) => Math.round(el.getBoundingClientRect().height / ((v) => Number.isFinite(v) ? v : parseFloat(getComputedStyle(el).fontSize) * 1.5)(parseFloat(getComputedStyle(el).lineHeight)))).filter((n) => n > 2).length,
        stickyCovers: await (async () => {
          const bar = document.querySelector('.mobile-cta');
          if (!bar || getComputedStyle(bar).display === 'none') return false;
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
          await new Promise((r) => setTimeout(r, 120));
          const last = document.querySelector('.site-footer__note');
          const covers = !bar.classList.contains('is-hidden') && last.getBoundingClientRect().bottom > bar.getBoundingClientRect().top + 1;
          window.scrollTo({ top: 0, behavior: 'instant' });
          return covers;
        })(),
        placeholderText: /(lorem|ipsum|ダミー|TODO|XXX|000-0000|○○)/i.test(document.body.innerText),
      };
    });
    if (m.sw > m.cw) fail(`${r || '/'} @${w}: horizontal scroll ${m.sw}>${m.cw} ${m.over.join(',')}`);
    else ok(`${r || '/'} @${w}: no horizontal overflow`);
    if (m.over.length) fail(`${r || '/'} @${w}: elements outside viewport ${m.over.join(',')}`);
    if (m.imgsNoAlt || m.svgNoLabel) fail(`${r || '/'}: missing alt/labels`);
    if (m.h1 !== 1) fail(`${r || '/'}: h1 count ${m.h1}`);
    if (!m.title || !m.desc || !m.og || !m.icon) fail(`${r || '/'}: meta missing`);
    if (m.unlabeled.length) fail(`${r || '/'}: unlabeled inputs ${m.unlabeled}`);
    if (m.smallTap) fail(`${r || '/'} @${w}: ${m.smallTap} tap targets < 40px`);
    if (m.narrowHeads.length) fail(`${r || '/'} @${w}: headings squeezed ${m.narrowHeads.join(',')}`);
    if (m.orphanLines.length) fail(`${r || '/'} @${w}: last line with <=2 chars: ${m.orphanLines.join(' / ')}`);
    if (m.areaStrongLines) fail(`${r || '/'} @${w}: area table place list wraps over 2 lines`);
    if (m.stickyCovers) fail(`${r || '/'} @${w}: sticky CTA covers the end of the page`);
    if (m.placeholderText) fail(`${r || '/'}: placeholder-like text found`);
    if (errors.length) fail(`${r || '/'} @${w}: console errors ${errors.join(' | ')}`);
    m.links.forEach((l) => linkSet.add(l.split('#')[0]));

    const kind = w === 1440 ? 'desktop' : w === 390 ? 'mobile' : null;
    if (WRITE && kind && shots[r]?.includes(kind)) {
      const name = (r.replace(/\/$/, '').replace(/\//g, '-') || 'top') + '-' + kind + '.png';
      await page.screenshot({ path: SHOT_DIR + name, fullPage: true });
    }
    await page.close();
  }
  await ctx.close();
}

// internal links
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
await routeFonts(ctx);
const req = ctx.request;
for (const l of linkSet) {
  if (!l.startsWith(BASE.replace(/\/$/, ''))) continue;
  const r = await req.get(l);
  if (r.status() !== 200) fail(`broken link ${l} -> ${r.status()}`);
}
ok(`internal links checked: ${[...linkSet].filter((l) => l.startsWith(BASE.replace(/\/$/, ''))).length}`);
for (const p of ['sitemap.xml', 'robots.txt', 'assets/og.png', 'assets/og-repair.png', 'assets/og-sale.png', 'assets/favicon.svg', 'assets/apple-touch-icon.png']) {
  const r = await req.get(BASE + p);
  if (r.status() !== 200) fail(`${p} -> ${r.status()}`); else ok(`${p} 200`);
}
const nf = await req.get(BASE + 'no-such-page/');
if (nf.status() !== 404) fail(`404 status ${nf.status()}`); else ok('404 returns 404');
const nfBody = await nf.text();
{
  const pr = await ctx.newPage();
  await pr.goto(SALE + '#flow', { waitUntil: 'networkidle' });
  await pr.waitForTimeout(300);
  await pr.mouse.wheel(0, 2500); await pr.waitForTimeout(400);
  const y1 = await pr.evaluate(() => scrollY);
  await pr.reload({ waitUntil: 'networkidle' }); await pr.waitForTimeout(600);
  const y2 = await pr.evaluate(() => scrollY);
  await pr.close();
  if (Math.abs(y2 - y1) > 40) fail(`reload with #hash jumps: ${y1} -> ${y2}`); else ok('reload keeps scroll position with #hash');
}
if (/href="#(?!main")/.test(nfBody)) fail('404 has in-page anchors that do not exist there'); else ok('404 links are all absolute');
if (!nfBody.includes('お探しのページが見つかりませんでした')) fail('404 body');

// mobile nav + form behaviour
const page = await ctx.newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(String(e)));
await page.goto(SALE, { waitUntil: 'networkidle' });
await page.click('.menu-btn');
if (!(await page.isVisible('#gnav'))) fail('mobile nav does not open'); else ok('mobile nav opens');
if ((await page.getAttribute('.menu-btn', 'aria-expanded')) !== 'true') fail('aria-expanded not updated');
await page.keyboard.press('Escape');
if (await page.isVisible('#gnav')) fail('mobile nav does not close with Escape'); else ok('mobile nav closes with Escape');
await page.click('.menu-btn');
await page.click('#gnav a[href$="#faq"]');
await page.waitForTimeout(500);
const navOk = await page.evaluate(() => location.hash === '#faq' && !document.getElementById('gnav').classList.contains('is-open') && Math.abs(document.getElementById('faq').getBoundingClientRect().top) < 140);
if (!navOk) fail('mobile nav anchor link'); else ok('mobile nav anchor jumps to section and closes menu');

{ const robots = await (await req.get(BASE + 'robots.txt')).text(); if (!/Disallow: \//.test(robots)) fail('demo robots.txt should disallow'); else ok('demo robots.txt disallows indexing'); }

// ---- 旧URLは新しいページへ転送される（旧トップのページ内リンクは売却前おまかせデスクへ） ----
for (const [from, to] of [['kanri/', 'repair/kanri/'], ['kaitori/', 'repair/kaitori/'], ['shop/', 'repair/shop/'], ['contact/', 'repair/#form'], ['contact/?type=kanri', 'repair/?seg=kanri#form'], ['#form', 'sale-support/#form']]) {
  const p2 = await ctx.newPage();
  await p2.goto(BASE + from, { waitUntil: 'networkidle' });
  const u = new URL(p2.url());
  if (u.pathname + u.search + u.hash !== new URL(BASE + to).pathname + new URL(BASE + to).search + new URL(BASE + to).hash) fail(`redirect ${from} -> ${p2.url()}`); else ok(`old URL ${from || '/'} -> ${to}`);
  await p2.close();
}
// ---- 分岐ページ：2つのサイトへのリンク ----
{
  const p2 = await ctx.newPage();
  await p2.goto(BASE, { waitUntil: 'networkidle' });
  const hub = await p2.evaluate(() => [...document.querySelectorAll('main a.hub-card')].map((a) => new URL(a.href).pathname));
  const want = [new URL(REPAIR).pathname, new URL(SALE).pathname];
  if (want.some((w) => !hub.includes(w)) || (await p2.locator('main form').count())) fail('hub links: ' + hub); else ok('hub page links to /repair/ and /sale-support/ (no form on the hub)');
  await p2.close();
}

// ---- 文言：2サイトそれぞれのヒーローと立ち位置、根拠のない表現・架空情報がないこと ----
const COPY = {
  repair: { url: REPAIR, h1: 'いつもの施工会社を変える必要はありません。', cta: '修繕案件を相談する', minCtas: 5,
    must: ['松山周辺の法人・事業者様向け', '建物修繕の相談窓口', '修繕案件を相談する', 'ご相談の流れ', '第二施工店', '普段の工事は、いつもの施工会社へ。', '手が回らない時だけ、愛媛修繕デスクへ。', '御社のお取引先への営業', '必要な許可・資格を有する', '管理会社様', '買取再販事業者様', '店舗・施設運営者様'],
    mustNot: ['残置物', '草刈り'] },
  sale: { url: SALE, h1: 'いつもの業者はそのまま。売却前だけ、もう一つの手配先を。', cta: '写真を送って案件相談', minCtas: 6,
    must: ['松山周辺の不動産会社様向け', '写真を送って案件相談', '相談無料 ｜ 既存業者との併用OK ｜ 松山市・近郊対応', 'いつもの業者は、そのままで大丈夫です。', '第二の手配先', '既存業者の置き換えではありません', 'ご相談例', '必要な許可を有する事業者', '自社で作業を行う会社ではありません'],
    mustNot: ['第二施工店'] },
};
for (const [key, c] of Object.entries(COPY)) {
  await page.goto(c.url, { waitUntil: 'networkidle' });
  // 表示幅で隠す区切り記号（｜）なども含めて判定するため、本文テキスト（textContent）を使う
  const text = await page.evaluate(() => document.body.textContent.replace(/\s+/g, ' '));
  const banned = ['地域最安', '最安', 'どんな工事でも', '何でもできます', '安心施工', '自社職人', '自社施工します', 'ご自宅の修繕でお困り', '施工実績', 'お客様の声', '24時間', '即日対応', '満足度', '000-0000'];
  const hits = banned.filter((w) => text.includes(w));
  if (hits.length) fail(`${key}: banned wording: ` + hits.join(',')); else ok(`${key}: no banned / unsupported wording`);
  const h1 = (await page.textContent('h1')).replace(/\s/g, '');
  const heroCta = (await page.textContent('.hero a[data-track="hero_cta_click"]')).trim();
  if (h1 !== c.h1 || heroCta !== c.cta) fail(`${key}: hero ${h1} / ${heroCta}`); else ok(`${key}: hero H1 and CTA "${c.cta}"`);
  const miss = c.must.filter((w) => !text.includes(w));
  const wrong = c.mustNot.filter((w) => text.includes(w));
  if (miss.length || wrong.length) fail(`${key}: copy missing ${miss.join(',')} / should not appear ${wrong.join(',')}`); else ok(`${key}: positioning copy present, other service's wording absent`);
  const ctas = await page.locator('main a[href$="#form"], .site-footer__cta a[href$="#form"]').count();
  if (ctas < c.minCtas) fail(`${key}: CTA count to #form ${ctas}`); else ok(`${key}: CTAs to the form: ${ctas}`);
  if (await page.locator('a[href^="tel:"]').count()) fail(`${key}: phone link shown without a configured number`); else ok(`${key}: no phone CTA while phone is not configured`);
}

// ---- 案件相談フォーム（デモモード）：3ステップ・入力チェック・写真・下書き・計測 ----
const events = [];
await page.exposeFunction('__qaEvent', (n) => events.push(n));
await page.addInitScript(() => document.addEventListener('osd:track', (e) => window.__qaEvent(e.detail.name + '|' + e.detail.params.site_type)));
await page.goto(SALE, { waitUntil: 'networkidle' });
await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
await page.reload({ waitUntil: 'networkidle' });
await page.click('.hero a[href="#form"]');
await page.waitForTimeout(400);
const formTop = await page.evaluate(() => document.getElementById('form').getBoundingClientRect().top);
if (Math.abs(formTop) > 120) fail('hero CTA does not scroll to form: ' + formTop); else ok('hero CTA scrolls to the form');
const stickyHidden = await page.evaluate(() => document.querySelector('.mobile-cta').classList.contains('is-hidden'));
if (!stickyHidden) fail('sticky CTA still shown over the form'); else ok('sticky CTA hides while the form is on screen');
await page.click('[data-next="2"]');
if (!(await page.isVisible('[data-step="1"]')) || !(await page.textContent('#services-err'))) fail('step 1 not validated'); else ok('step 1 requires a service, error under field');
await page.locator('label.choice:has(input[value="残置物・片付け"])').click();
await page.locator('label.choice:has(input[value="草刈り・外回り"])').click();
if (await page.textContent('#services-err')) fail('service error not cleared');
await page.click('[data-next="2"]');
if (!(await page.isVisible('[data-step="2"]'))) fail('did not move to step 2'); else ok('moves to step 2 on the same page');
const realJpg = (await import('node:fs')).readFileSync(new URL('../src/assets/photos/akiya_kitchen-l.jpg', import.meta.url));
await page.setInputFiles('#photos', [1, 2, 3, 4, 5, 6].map((i) => ({ name: `p${i}.jpg`, mimeType: 'image/jpeg', buffer: realJpg })).concat([{ name: 'doc.pdf', mimeType: 'application/pdf', buffer: Buffer.from('x') }]));
await page.waitForFunction(() => document.querySelectorAll('.js-thumbs li').length === 6, null, { timeout: 8000 }).catch(() => {});
const nThumb = await page.locator('.js-thumbs li img').count();
if (nThumb !== 6) fail('photo previews ' + nThumb); else ok('6 photos previewed (multi-select), non-photo rejected');
await page.setInputFiles('#photos', [7, 8, 9, 10, 11].map((i) => ({ name: `q${i}.jpg`, mimeType: 'image/jpeg', buffer: realJpg })));
await page.waitForTimeout(1500);
const nThumb2 = await page.locator('.js-thumbs li').count();
const capMsg = await page.textContent('#photos-err');
if (nThumb2 !== 10 || !/上限/.test(capMsg)) fail(`photo cap: ${nThumb2} ${capMsg}`); else ok('photo cap of 10 enforced with message');
await page.click('[data-next="3"]');
if (!(await page.textContent('#area-err'))) fail('area required not enforced'); else ok('step 2 requires area');
await page.selectOption('#area', '松山市');
await page.locator('label.choice:has(input[name="ptype"][value="戸建"])').click();
await page.click('[data-next="3"]');
await page.fill('#company', 'テスト不動産');
// 途中で再読み込みしても入力が残る
await page.reload({ waitUntil: 'networkidle' });
const restored = await page.evaluate(() => ({ step: [...document.querySelectorAll('.cstep')].find((f) => !f.hidden)?.dataset.step, company: document.getElementById('company').value, svc: [...document.querySelectorAll('[name=services]:checked')].map((x) => x.value).join(','), area: document.getElementById('area').value, note: !document.getElementById('draft-note').hidden }));
if (restored.step !== '3' || restored.company !== 'テスト不動産' || restored.svc !== '残置物・片付け,草刈り・外回り' || restored.area !== '松山市' || !restored.note) fail('draft not restored: ' + JSON.stringify(restored)); else ok('draft restored after reload (step, text, checkboxes, select)');
await page.fill('#name', '山田');
await page.click('#case-form button[type="submit"]');
if (!/どちらか/.test(await page.textContent('#contact-err'))) fail('tel-or-email rule not enforced'); else ok('either phone or email is required');
await page.fill('#email', 'bad');
await page.click('#case-form button[type="submit"]');
if (!/形式/.test(await page.textContent('#contact-err'))) fail('email format'); else ok('email format checked');
await page.fill('#email', 'info@example.co.jp');
await page.click('#case-form button[type="submit"]');
await page.waitForTimeout(300);
const demo = await page.evaluate(() => ({ shown: !document.getElementById('case-done').hidden, id: document.getElementById('case-id').textContent, text: document.getElementById('case-text').textContent, stepper: document.querySelector('.stepper').offsetParent !== null }));
if (!demo.shown || !/^MAT-\d{8}-001$/.test(demo.id) || !/デモ|送信されていません/.test(demo.text) || demo.stepper) fail('demo done panel: ' + JSON.stringify(demo)); else ok('demo mode: honest not-sent message with case number format example');
for (const ev of ['hero_cta_click', 'form_start', 'service_select', 'photo_upload', 'form_submit']) {
  if (!events.includes(ev + '|sale_support')) fail('event not fired: ' + ev + ' ' + events.join(',')); else ok('event fired with site_type=sale_support: ' + ev);
}
{
  const p3 = await ctx.newPage();
  const ev2 = [];
  await p3.exposeFunction('__qaEvent', (n) => ev2.push(n));
  await p3.addInitScript(() => document.addEventListener('osd:track', (e) => window.__qaEvent(e.detail.name)));
  await p3.goto(SALE, { waitUntil: 'networkidle' });
  await p3.click('.mobile-cta a[href$="#form"]');
  if (!ev2.includes('sticky_cta_click')) fail('sticky_cta_click not fired'); else ok('event fired: sticky_cta_click');
  await p3.close();
}

// ---- 本番接続（送信先を差し替え）：保存先へ届く内容・案件番号・失敗時の扱い ----
// site: 'sale'（売却前おまかせデスク）または 'repair'（愛媛修繕デスク）。どちらも同じフォームのエンジンと送信先を使う
async function caseSend(handler, site = 'sale') {
  const p2 = await ctx.newPage();
  await p2.addInitScript((u) => { window.EHIME_FORM_ENDPOINT = u; try { localStorage.clear(); } catch (e) {} }, BASE + '__qa_endpoint');
  const bodies = [];
  const evs = [];
  await p2.exposeFunction('__qaEv', (n) => evs.push(n));
  await p2.addInitScript(() => document.addEventListener('osd:track', (e) => window.__qaEv(e.detail.name + '|' + e.detail.params.site_type)));
  await p2.route('**/__qa_endpoint', async (route) => { bodies.push(route.request().postData() || ''); await handler(route); });
  if (site === 'sale') {
    await p2.goto(SALE + '?utm_source=qa&utm_campaign=sales-test', { waitUntil: 'networkidle' });
    await p2.click('.hero a[data-track="hero_cta_click"]');
    await p2.locator('label.choice:has(input[name="status"][value="媒介中"])').click();
    await p2.locator('label.choice:has(input[value="空室清掃"])').click();
    await p2.locator('label.choice:has(input[value="小修繕"])').click();
    await p2.locator('label.choice:has(input[name="timing"][value="急ぎ"])').click();
    await p2.fill('#note', '内覧前に清掃したい');
  } else {
    await p2.goto(REPAIR + 'kanri/', { waitUntil: 'networkidle' });
    await p2.click('.phero a.btn--primary');
    await p2.waitForLoadState('networkidle');
    await p2.click('.hero a[data-track="hero_cta_click"]');
    await p2.locator('label.choice:has(input[value="建具・設備まわり"])').click();
    await p2.locator('label.choice:has(input[name="reason"][value="繁忙で手が回らない"])').click();
    await p2.locator('label.choice:has(input[name="urgency"][value="早めに対応したい"])').click();
    await p2.fill('#note', '退去後のドア調整');
  }
  await p2.click('[data-next="2"]');
  await p2.setInputFiles('#photos', [1, 2].map((i) => ({ name: `room${i}.jpg`, mimeType: 'image/jpeg', buffer: realJpg })));
  await p2.waitForFunction(() => document.querySelectorAll('.js-thumbs li').length === 2, null, { timeout: 8000 }).catch(() => {});
  await p2.selectOption('#area', '伊予市');
  await p2.fill('#address', '伊予市米湊');
  await p2.click('[data-next="3"]');
  await p2.fill('#company', site === 'sale' ? '伊予不動産' : '伊予管理'); await p2.fill('#name', '佐藤'); await p2.fill('#tel', '（089）912−3456');
  const btn = p2.locator('#case-form button[type="submit"]');
  await btn.click(); await btn.click({ force: true }).catch(() => {});
  await p2.waitForTimeout(900);
  const out = await p2.evaluate((line) => ({ done: !document.getElementById('case-done').hidden, id: document.getElementById('case-id').textContent, err: document.querySelector('[data-status-for="case-form"]').hidden ? '' : document.querySelector('[data-status-for="case-form"]').textContent, draft: (() => { try { return localStorage.getItem('osd-case-draft-v1-' + line); } catch (e) { return 'x'; } })(), thumbs: document.querySelectorAll('.js-thumbs li').length, disabled: document.querySelector('#case-form button[type="submit"]').disabled }), site === 'sale' ? 'sale_support' : 'repair_desk');
  await p2.close();
  return { out, bodies, evs };
}
const live = await caseSend((route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, caseId: 'MAT-20261005-007' }) }));
if (live.bodies.length !== 1) fail('live send count ' + live.bodies.length); else ok('one request per submit (double submit guarded)');
{
  let j = {};
  try { j = JSON.parse(live.bodies[0] || '{}'); } catch (e) { fail('payload is not JSON'); }
  const okPayload = j.formType === 'case' && j.business_line === 'sale_support' && j.site_type === 'sale_support' && /utm_source=qa&utm_campaign=sales-test/.test(j.entry) && j.company === '伊予不動産' && j.name === '佐藤' && j.tel === '0899123456' && j.area === '伊予市' && j.address === '伊予市米湊' && j.status === '媒介中' && j.timing === '急ぎ' && j.note === '内覧前に清掃したい'
    && Array.isArray(j.services) && j.services.join() === '空室清掃,小修繕' && Array.isArray(j.photos) && j.photos.length === 2 && /^data:image\/jpeg;base64,/.test(j.photos[0].dataUrl) && !('website' in j);
  if (!okPayload) fail('payload content: ' + JSON.stringify({ ...j, photos: (j.photos || []).length })); else ok('sale payload: business_line=sale_support, entry (utm), all fields, services array, 2 compressed photos, normalized phone');
  const kb = Math.round((j.photos?.[0]?.dataUrl.length || 0) / 1024);
  if (kb > 900) fail('photo not compressed: ' + kb + 'KB'); else ok(`photo compressed before sending (~${kb}KB base64)`);
}
if (!live.out.done || live.out.id !== 'MAT-20261005-007') fail('case number not shown: ' + JSON.stringify(live.out)); else ok('case number from backend shown after submit');
if (live.out.draft) fail('draft not cleared after successful send'); else ok('draft cleared after successful send');
const l500 = await caseSend((route) => route.fulfill({ status: 500, body: 'x' }));
if (l500.out.done || !/送信できませんでした/.test(l500.out.err) || l500.out.thumbs !== 2 || l500.out.disabled) fail('server error handling: ' + JSON.stringify(l500.out)); else ok('server error: message shown, photos kept, button re-enabled');
const lbad = await caseSend((route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: false, error: 'invalid' }) }));
if (lbad.out.done) fail('backend rejection treated as success'); else ok('backend {ok:false} is not treated as success');
const lnet = await caseSend((route) => route.abort('failed'));
if (!/通信に失敗/.test(lnet.out.err)) fail('network failure message: ' + lnet.out.err); else ok('network failure message shown');

// ---- 結合：2サイトの送信内容を、同じバックエンド（Code.gs を模擬環境で実行）へ渡す ----
{
  const { makeEnv } = await import('./test-backend.mjs');
  const be = makeEnv();
  const today = be.env.Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyyMMdd');
  const toBackend = (route) => route.fulfill({ status: 200, contentType: 'application/json', body: be.env.doPost({ postData: { contents: route.request().postData() } }).text });
  const rs = await caseSend(toBackend, 'sale');
  const rr = await caseSend(toBackend, 'repair');
  const [sr, rrow] = be.rows['案件'];
  const okSale = sr && be.col(sr, 'サービス') === '売却前おまかせデスク' && be.col(sr, 'サービス区分') === 'sale_support' && be.col(sr, '会社名') === '伊予不動産' && be.col(sr, '売却工程') === '媒介中' && be.col(sr, '相談内容') === '空室清掃、小修繕' && be.col(sr, '写真枚数') === 2 && /utm_source=qa/.test(be.col(sr, '流入元'));
  const okRepair = rrow && be.col(rrow, 'サービス') === '愛媛修繕デスク' && be.col(rrow, 'サービス区分') === 'repair_desk' && be.col(rrow, '会社名') === '伊予管理' && be.col(rrow, '業種') === '管理会社' && be.col(rrow, '普段の施工会社で対応できない理由') === '繁忙で手が回らない' && be.col(rrow, '相談内容') === '建具・設備まわり';
  if (!okSale || !okRepair || be.rows['案件'].length !== 2) fail('backend sheet rows: ' + JSON.stringify(be.rows['案件'].map((r) => r.slice(0, 20)))); else ok('contract: both sites land in the same sheet, told apart by サービス (sale_support / repair_desk); seg preset and utm entry saved');
  if (be.files.length !== 4 || !be.files.every((f) => f.type === 'image/jpeg')) fail('backend drive files: ' + JSON.stringify(be.files.map((f) => [f.folder, f.type]))); else ok('contract: photos from both sites saved per case folder in Drive');
  if (be.mails.length !== 2 || !/【案件相談｜売却前おまかせデスク】/.test(be.mails[0].subject) || !/【案件相談｜愛媛修繕デスク】/.test(be.mails[1].subject)) fail('backend mail: ' + JSON.stringify(be.mails.map((m) => m.subject))); else ok('contract: notification mail subject names the service');
  if (rs.out.id !== `MAT-${today}-001` || rr.out.id !== `MAT-${today}-002`) fail('contract case ids on page: ' + JSON.stringify([rs.out, rr.out])); else ok('contract: case numbers issued by the shared backend are shown on each site');
  for (const ev of ['hero_cta_click', 'form_start', 'photo_upload', 'form_submit']) {
    if (!rr.evs.includes(ev + '|repair')) fail('repair event not fired: ' + ev + ' ' + rr.evs.join(',')); else ok('event fired with site_type=repair: ' + ev);
  }
}

// ---- 電話番号を設定したビルド：電話CTAの表示と phone_click（ローカル実行時のみ） ----
if (!arg) {
  const { execFileSync } = await import('node:child_process');
  const { mkdtempSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const dir = mkdtempSync(tmpdir() + '/osd-phone-');
  execFileSync(process.execPath, [new URL('../build.mjs', import.meta.url).pathname], { env: { ...process.env, OUT_DIR: dir, SITE_CONFIG_OVERRIDE: JSON.stringify({ operator: { phone: '089-912-3456', phoneHours: '平日 9:00〜18:00' } }) }, stdio: 'ignore' });
  const srv2 = await serve(4174, dir + '/');
  const p4 = await ctx.newPage();
  const ev4 = [];
  await p4.exposeFunction('__qaEv', (n) => ev4.push(n));
  await p4.addInitScript(() => document.addEventListener('osd:track', (e) => window.__qaEv(e.detail.name + '|' + e.detail.params.site_type)));
  await p4.goto('http://localhost:4174/ehime-shuzen-desk/sale-support/', { waitUntil: 'networkidle' });
  const tel = await p4.evaluate(() => ({ n: document.querySelectorAll('a[href="tel:0899123456"]').length, sticky: [...document.querySelectorAll('.mobile-cta a')].map((a) => a.textContent.trim()).join('|'), two: document.querySelector('.mobile-cta').classList.contains('mobile-cta--two') }));
  if (tel.n < 3 || tel.sticky !== '電話で相談|写真を送って相談' || !tel.two) fail('phone build: ' + JSON.stringify(tel)); else ok(`phone build: tel links shown (${tel.n}) incl. sticky 電話で相談`);
  await p4.evaluate(() => document.addEventListener('click', (e) => { if (e.target.closest('a[href^="tel:"]')) e.preventDefault(); }));
  await p4.click('.mobile-cta a[href^="tel:"]');
  if (!ev4.includes('phone_click|sale_support')) fail('phone_click not fired ' + ev4); else ok('event fired with site_type=sale_support: phone_click');
  await p4.goto('http://localhost:4174/ehime-shuzen-desk/repair/', { waitUntil: 'networkidle' });
  await p4.evaluate(() => document.addEventListener('click', (e) => { if (e.target.closest('a[href^="tel:"]')) e.preventDefault(); }));
  await p4.click('.mobile-cta a[href^="tel:"]');
  if (!ev4.includes('phone_click|repair')) fail('repair phone_click not fired ' + ev4); else ok('event fired with site_type=repair: phone_click');
  await p4.close(); srv2.close(); rmSync(dir, { recursive: true, force: true });
}

await page.goto(BASE + 'partner/', { waitUntil: 'networkidle' });
await page.click('#partner-form button[type="submit"]');
const pErr = await page.locator('#partner-form .is-invalid').count();
if (pErr < 6) fail('partner empty submit invalid ' + pErr); else ok('partner form validation ' + pErr);

// home header transparency over hero, solid after scroll
await page.goto(SALE, { waitUntil: 'networkidle' });
const over = await page.evaluate(() => document.querySelector('.site-header').classList.contains('is-over'));
await page.evaluate(() => window.scrollTo(0, 800));
await page.waitForTimeout(200);
const solid = await page.evaluate(() => !document.querySelector('.site-header').classList.contains('is-over'));
if (!over || !solid) fail('header over-hero state'); else ok('header transparent on hero, solid after scroll');
// partner mobile CTA
await page.goto(BASE + 'partner/', { waitUntil: 'networkidle' });
const pm = await page.getAttribute('.mobile-cta a', 'href');
if (pm !== '#entry') fail('partner mobile cta ' + pm); else ok('partner mobile CTA goes to #entry');

// keyboard focus visibility
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.keyboard.press('Tab');
const skipVisible = await page.evaluate(() => document.activeElement.classList.contains('skip') && document.activeElement.getBoundingClientRect().left >= 0);
if (!skipVisible) fail('skip link not focusable/visible'); else ok('skip link visible on focus');
if (errs.length) fail('page errors ' + errs.join(' | '));

await browser.close();
if (srv) srv.close();
if (WRITE) writeFileSync(new URL('../harness/qa-result.json', import.meta.url), JSON.stringify(results, null, 2));
results.failures.forEach((f) => console.log('FAIL', f));
console.log(`checks ok: ${results.checks.length}, failures: ${results.failures.length}`);
process.exit(results.failures.length ? 1 : 0);

```


---

# フォームの受け側（Google Apps Script）

## ファイル：backend/google-apps-script/README.md

## 案件受付バックエンド（Google Apps Script）

2つのサイト（`/repair/` 愛媛修繕デスク、`/sale-support/` 売却前おまかせデスク）の案件相談フォームから届いた内容を、**1つの受け側**で次の流れで受け付ける最小構成です。サイトごとに受け側を複製しません。

1. 案件番号を発番（例：`MAT-20261005-001`。2サイト共通の日ごとの連番）
2. Google スプレッドシート「愛媛修繕デスク・売却前おまかせデスク 案件台帳」の「案件」シートに1行追加。**「サービス」列（愛媛修繕デスク／売却前おまかせデスク）と「サービス区分」列（`repair_desk`／`sale_support`）で、どちらのサイトの案件かを判別**できます
3. 写真を Google ドライブの「愛媛修繕デスク・売却前おまかせデスク 案件写真／案件番号」フォルダに保存
4. 通知メールを送信
5. 案件番号をサイトへ返し、送信完了画面に表示

協力事業者の登録フォームも同じ仕組みで「協力事業者」シートに保存します（受付番号 `PTN-…`）。

### 設定手順（初回のみ・約10分）

1. 運用に使う Google アカウントで https://script.google.com を開き、「新しいプロジェクト」を作成します。
2. `Code.gs` の中身を、エディタの `コード.gs` に貼り付けます。
3. 左の「プロジェクトの設定」で「appsscript.json マニフェスト ファイルをエディタで表示する」をオンにし、`appsscript.json` の中身を貼り付けます。
4. エディタ上部の関数選択で `setup` を選んで「実行」します。権限の確認が表示されたら許可します。台帳スプレッドシートと写真フォルダが自動で作成されます。
5. 「プロジェクトの設定」→「スクリプト プロパティ」で、次を追加します。
   - `NOTIFY_EMAIL`：通知を受け取るメールアドレス（複数はカンマ区切り）
   - `CASE_PREFIX`：案件番号の先頭（既定は `MAT`。変更する場合のみ）
6. 「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」。
   - 次のユーザーとして実行：自分
   - アクセスできるユーザー：全員
7. 表示された「ウェブアプリの URL」（`https://script.google.com/macros/s/…/exec`）を、リポジトリの `site.config.json` の `formEndpoint` に設定して push します。サイトが再ビルドされ、フォームが本番接続されます。

### 動作確認

- ウェブアプリの URL をブラウザで開き、`{"ok":true,...}` が表示されることを確認します。
- サイトのフォームからテスト送信し、台帳に行が追加され、写真フォルダと通知メールが届くことを確認します。テスト行は確認後に削除してください（連番は戻りません）。

### 仕様

- 受信形式：JSON（`Content-Type: text/plain`）。ブラウザの事前確認（CORS プリフライト）なしで送れる形式です。
- 必須チェック：会社名・ご担当者名・電話番号またはメールアドレス・物件エリア・相談内容（1つ以上）。満たさない場合は `{"ok":false}` を返し、保存しません。
- 写真：最大10枚。サイト側で長辺1600pxの JPEG に縮小して送ります（ブラウザで縮小できない HEIC などは元のまま）。1枚8MBを超えるものは保存しません。
- スパム対策：画面に表示されない入力欄（`website`）が入力されている送信は、保存せずに破棄します。
- 同時送信：`LockService` で発番を排他制御します。
- サービスの判別：サイトは送信データに `business_line`（`repair_desk` / `sale_support`）を付けて送ります。想定外の値は「不明（unknown）」として保存します。
- 流入元：営業メール等で送ったURLの `utm_*` / `ref` と参照元を「流入元」列に保存します（`docs/sales-test.md`）。
- 台帳の列：受付日時・案件番号・サービス・サービス区分・会社名・ご担当者名・電話番号・メールアドレス・業種・物件エリア・物件住所・物件・建物種別・使用状況・売却工程・物件の状況・緊急度・普段の施工会社で対応できない理由・希望時期・相談内容・補足説明・写真枚数・写真フォルダ・流入元・送信元ページ・**対応状況・見積日・見積金額・成約・成約金額・粗利・再依頼・メモ**（太字の列は営業の比較用に人が記入します）。
- 既存の台帳を以前の版で作っていた場合は、1行目の見出しを `Code.gs` の `CASE_HEADERS` に合わせて作り直してください（まだ本番接続前のため、通常は不要です）。

### ローカルでの検証

`node scripts/test-backend.mjs` で、Google のサービスを模した環境で `Code.gs` を実行し、発番・保存・写真保存・通知・入力チェック・スパム対策を検証します。実際の Google 環境での確認は、上の「動作確認」で行ってください。

### 制約・注意

- Apps Script の実行時間・メール送信数には、Google アカウントの種類ごとの上限があります（無料アカウントは1日のメール送信数に上限あり）。案件数が増えた場合は、フォームサービスや自社サーバーへの移行を検討してください。
- 台帳と写真には個人情報が含まれます。共有範囲は必要な担当者に限定してください。


## ファイル：backend/google-apps-script/Code.gs

```gs
/**
 * 愛媛修繕デスク／売却前おまかせデスク — 案件受付（Google Apps Script ウェブアプリ・2サイト共通）
 *
 * 2つのサイトのフォームから届いた案件を、どちらのサイトから来たか（business_line）を付けて
 *   1) 案件番号（例：MAT-20261005-001）を発番し
 *   2) スプレッドシートの「案件」シートに1行追加し
 *   3) 写真を Google ドライブの案件ごとのフォルダに保存し
 *   4) 通知メールを送り
 *   5) 案件番号をサイトへ返す
 * 最小構成です。設定手順は同じフォルダの README.md を参照してください。
 */

var TZ = 'Asia/Tokyo';
var MAX_PHOTOS = 10;
var MAX_PHOTO_BYTES = 8 * 1024 * 1024;
// 案件台帳の列。前半はフォームから自動で入り、「対応状況」以降は営業比較のために人が記入する
var CASE_HEADERS = [
  '受付日時', '案件番号', 'サービス', 'サービス区分', '会社名', 'ご担当者名', '電話番号', 'メールアドレス', '業種',
  '物件エリア', '物件住所', '物件・建物種別', '使用状況', '売却工程', '物件の状況', '緊急度', '普段の施工会社で対応できない理由',
  '希望時期', '相談内容', '補足説明', '写真枚数', '写真フォルダ', '流入元', '送信元ページ',
  '対応状況', '見積日', '見積金額', '成約', '成約金額', '粗利', '再依頼', 'メモ'
];
// サイトから届く business_line と、台帳に表示するサービス名
var BUSINESS_LINES = { repair_desk: '愛媛修繕デスク', sale_support: '売却前おまかせデスク' };
var PARTNER_HEADERS = ['受付日時', '受付番号', '会社名・屋号', 'ご担当者名', '電話番号', 'メールアドレス', '所在地', '対応できる作業', '保有している許可・資格', '対応可能なエリア', 'その他', '送信元ページ'];

function props_() { return PropertiesService.getScriptProperties(); }
function prop_(k, dflt) { var v = props_().getProperty(k); return v === null || v === undefined || v === '' ? dflt : v; }
function json_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function str_(v, max) { v = v === undefined || v === null ? '' : String(v); return v.slice(0, max || 2000); }
function list_(v) { return Array.isArray(v) ? v.map(function (x) { return str_(x, 100); }) : (v ? [str_(v, 100)] : []); }

/** 初回のみ実行：台帳スプレッドシートと写真フォルダを作成し、設定を保存する */
function setup() {
  var p = props_();
  if (!p.getProperty('SHEET_ID')) {
    var ss = SpreadsheetApp.create('愛媛修繕デスク・売却前おまかせデスク 案件台帳');
    var cases = ss.getSheets()[0];
    cases.setName('案件');
    cases.appendRow(CASE_HEADERS);
    cases.setFrozenRows(1);
    var partners = ss.insertSheet('協力事業者');
    partners.appendRow(PARTNER_HEADERS);
    partners.setFrozenRows(1);
    p.setProperty('SHEET_ID', ss.getId());
  }
  if (!p.getProperty('PHOTO_FOLDER_ID')) {
    p.setProperty('PHOTO_FOLDER_ID', DriveApp.createFolder('愛媛修繕デスク・売却前おまかせデスク 案件写真').getId());
  }
  if (!p.getProperty('CASE_PREFIX')) p.setProperty('CASE_PREFIX', 'MAT');
  return { sheetId: p.getProperty('SHEET_ID'), photoFolderId: p.getProperty('PHOTO_FOLDER_ID') };
}

/** 日ごとの連番で受付番号を発番する（同時送信に備えてロックする） */
function nextId_(prefix, now) {
  var day = Utilities.formatDate(now, TZ, 'yyyyMMdd');
  var key = 'SEQ_' + prefix + '_' + day;
  var n = Number(prop_(key, '0')) + 1;
  props_().setProperty(key, String(n));
  var seq = String(n);
  while (seq.length < 3) seq = '0' + seq;
  return prefix + '-' + day + '-' + seq;
}

function validateCase_(d) {
  var errors = [];
  if (!str_(d.company).trim()) errors.push('company');
  if (!str_(d.name).trim()) errors.push('name');
  if (!str_(d.tel).trim() && !str_(d.email).trim()) errors.push('contact');
  if (!str_(d.area).trim()) errors.push('area');
  if (!list_(d.services).length) errors.push('services');
  if (Array.isArray(d.photos) && d.photos.length > MAX_PHOTOS) errors.push('photos');
  return errors;
}

function savePhotos_(caseId, photos) {
  if (!Array.isArray(photos) || !photos.length) return { count: 0, url: '' };
  var root = DriveApp.getFolderById(prop_('PHOTO_FOLDER_ID'));
  var folder = root.createFolder(caseId);
  var count = 0;
  photos.slice(0, MAX_PHOTOS).forEach(function (p, i) {
    var m = /^data:([\w\/+.-]+);base64,(.+)$/.exec(str_(p && p.dataUrl, 30 * 1024 * 1024));
    if (!m) return;
    var bytes = Utilities.base64Decode(m[2]);
    if (bytes.length > MAX_PHOTO_BYTES) return;
    var ext = m[1] === 'image/jpeg' ? '.jpg' : '';
    var name = String(i + 1).padStart ? String(i + 1).padStart(2, '0') : ('0' + (i + 1)).slice(-2);
    folder.createFile(Utilities.newBlob(bytes, m[1], name + '_' + str_(p.name, 80).replace(/[\\\/:*?"<>|]/g, '_') + (ext && !/\.jpe?g$/i.test(p.name || '') ? ext : '')));
    count++;
  });
  return { count: count, url: folder.getUrl() };
}

function notify_(subject, lines) {
  var to = prop_('NOTIFY_EMAIL', '');
  if (!to) return false;
  MailApp.sendEmail({ to: to, subject: subject, body: lines.join('\n') });
  return true;
}

function handleCase_(d, now) {
  var errors = validateCase_(d);
  if (errors.length) return { ok: false, error: 'invalid', fields: errors };
  var line = BUSINESS_LINES[d.business_line] ? d.business_line : 'unknown';
  var lineName = BUSINESS_LINES[line] || '不明';
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  var caseId;
  try { caseId = nextId_(prop_('CASE_PREFIX', 'MAT'), now); } finally { lock.releaseLock(); }
  var photos = savePhotos_(caseId, d.photos);
  var services = list_(d.services).join('、');
  var v = {
    '受付日時': Utilities.formatDate(now, TZ, 'yyyy/MM/dd HH:mm:ss'), '案件番号': caseId, 'サービス': lineName, 'サービス区分': line,
    '会社名': str_(d.company, 200), 'ご担当者名': str_(d.name, 100), '電話番号': str_(d.tel, 30), 'メールアドレス': str_(d.email, 200), '業種': str_(d.segment, 50),
    '物件エリア': str_(d.area, 50), '物件住所': str_(d.address, 300), '物件・建物種別': str_(d.ptype, 30), '使用状況': str_(d.occupancy, 30),
    '売却工程': str_(d.status, 30), '物件の状況': list_(d.features).join('、'), '緊急度': str_(d.urgency, 50), '普段の施工会社で対応できない理由': list_(d.reason).join('、'),
    '希望時期': str_(d.timing, 30), '相談内容': services, '補足説明': str_(d.note, 3000), '写真枚数': photos.count, '写真フォルダ': photos.url,
    '流入元': str_(d.entry, 500), '送信元ページ': str_(d.page, 300), '対応状況': '未対応'
  };
  var row = CASE_HEADERS.map(function (h) { return v[h] === undefined ? '' : v[h]; });
  SpreadsheetApp.openById(prop_('SHEET_ID')).getSheetByName('案件').appendRow(row);
  var lines = ['【' + lineName + '】に案件相談が届きました。', ''];
  // 入力のあった項目だけを載せる（サービスごとに質問が異なるため）
  CASE_HEADERS.slice(0, 24).forEach(function (h) { if (['受付日時', 'サービス区分', '写真フォルダ'].indexOf(h) < 0 && v[h] !== '' && v[h] !== undefined) lines.push(h + '：' + v[h]); });
  lines.push('写真フォルダ：' + (photos.url || '－'), '', '台帳：https://docs.google.com/spreadsheets/d/' + prop_('SHEET_ID') + '/edit');
  notify_('【案件相談｜' + lineName + '】' + caseId + '｜' + str_(d.company, 60) + '｜' + services, lines);
  return { ok: true, caseId: caseId };
}

function handlePartner_(d, now) {
  if (!str_(d.p_company).trim() || !str_(d.p_name).trim() || !str_(d.p_tel).trim() || !str_(d.p_email).trim() || !list_(d.p_trades).length) return { ok: false, error: 'invalid' };
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  var id;
  try { id = nextId_('PTN', now); } finally { lock.releaseLock(); }
  var row = [Utilities.formatDate(now, TZ, 'yyyy/MM/dd HH:mm:ss'), id, str_(d.p_company, 200), str_(d.p_name, 100), str_(d.p_tel, 30), str_(d.p_email, 200), str_(d.p_city, 100), list_(d.p_trades).join('、'), str_(d.p_license, 2000), list_(d.p_area).join('、'), str_(d.p_note, 2000), str_(d.page, 300)];
  SpreadsheetApp.openById(prop_('SHEET_ID')).getSheetByName('協力事業者').appendRow(row);
  notify_('【協力事業者の登録相談】' + id + '｜' + row[2], ['協力事業者の登録相談が届きました。', '', '受付番号：' + id, '会社名・屋号：' + row[2], 'ご担当者名：' + row[3], '電話番号：' + row[4], 'メールアドレス：' + row[5], '対応できる作業：' + row[7], '保有している許可・資格：' + (row[8] || '－')]);
  return { ok: true, caseId: id };
}

function doPost(e) {
  try {
    var d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (d.website) return json_({ ok: true });              // スパム対策：人には見えない欄が入力されていたら黙って破棄
    var now = new Date();
    if (d.formType === 'case') return json_(handleCase_(d, now));
    if (d.formType === 'partner') return json_(handlePartner_(d, now));
    return json_({ ok: false, error: 'unknown_form' });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server' });
  }
}

/** ブラウザで URL を開いたときの動作確認用 */
function doGet() { return json_({ ok: true, service: '愛媛修繕デスク・売却前おまかせデスク 案件受付' }); }

```

## ファイル：scripts/test-backend.mjs

```js
// backend/google-apps-script/Code.gs を、Google のサービスを模したオブジェクトの上で実行して検証する。
// 実際の Google 環境での動作確認（デプロイ後）は backend/google-apps-script/README.md の手順で行う。
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

export function makeEnv() {
  const props = { SHEET_ID: 'sheet1', PHOTO_FOLDER_ID: 'folder1', CASE_PREFIX: 'MAT', NOTIFY_EMAIL: 'desk@example.com' };
  const rows = { 案件: [], 協力事業者: [] };
  const files = [];
  const mails = [];
  let locked = false;
  const env = {
    console: { error: () => {}, log: console.log },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => (k in props ? props[k] : null), setProperty: (k, v) => { props[k] = v; } }) },
    LockService: { getScriptLock: () => ({ waitLock: () => { assert.equal(locked, false); locked = true; }, releaseLock: () => { locked = false; } }) },
    Utilities: {
      formatDate: (d, tz, f) => {
        const j = new Date(d.getTime() + 9 * 3600e3);
        const p = (n) => String(n).padStart(2, '0');
        return f.replace('yyyy', j.getUTCFullYear()).replace('MM', p(j.getUTCMonth() + 1)).replace('dd', p(j.getUTCDate())).replace('HH', p(j.getUTCHours())).replace('mm', p(j.getUTCMinutes())).replace('ss', p(j.getUTCSeconds()));
      },
      base64Decode: (b) => Buffer.from(b, 'base64'),
      newBlob: (bytes, type, name) => ({ bytes, type, name }),
    },
    SpreadsheetApp: { openById: (id) => { assert.equal(id, 'sheet1'); return { getSheetByName: (n) => ({ appendRow: (r) => rows[n].push(r) }) }; } },
    DriveApp: { getFolderById: (id) => ({ createFolder: (name) => ({ createFile: (blob) => files.push({ folder: name, ...blob }), getUrl: () => 'https://drive.example/' + name }) }) },
    MailApp: { sendEmail: (m) => mails.push(m) },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (t) => ({ text: t, setMimeType() { return this; } }) },
  };
  vm.createContext(env);
  vm.runInContext(readFileSync(new URL('../backend/google-apps-script/Code.gs', import.meta.url), 'utf8'), env);
  const post = (obj) => JSON.parse(env.doPost({ postData: { contents: JSON.stringify(obj) } }).text);
  // 台帳の列は位置ではなく列名で参照する（列の追加に強くするため）
  const col = (row, header) => row[env.CASE_HEADERS.indexOf(header)];
  return { env, post, rows, files, mails, props, col };
}

if (process.argv[1] === new URL(import.meta.url).pathname) runTests();
function runTests() {
const png = 'data:image/jpeg;base64,' + Buffer.from('fake-jpeg-bytes').toString('base64');
const base = { formType: 'case', business_line: 'sale_support', company: '松山不動産', name: '山田', tel: '0899123456', email: '', area: '松山市', services: ['残置物・片付け', '空室清掃'], note: '相続物件', page: 'https://example/#form' };
let passed = 0;
const t = (name, fn) => { fn(); passed++; console.log('ok -', name); };

const { post, rows, files, mails, props, col } = makeEnv();
t('valid case returns sequential case number', () => {
  const r1 = post({ ...base, photos: [{ name: 'a.jpg', dataUrl: png }, { name: 'b.jpg', dataUrl: png }] });
  assert.equal(r1.ok, true);
  assert.match(r1.caseId, /^MAT-\d{8}-001$/);
  const r2 = post({ ...base, tel: '', email: 'info@example.co.jp' });
  assert.match(r2.caseId, /^MAT-\d{8}-002$/);
});
t('case row is saved with all fields', () => {
  assert.equal(rows['案件'].length, 2);
  const r = rows['案件'][0];
  assert.equal(col(r, '会社名'), '松山不動産'); assert.equal(col(r, '物件エリア'), '松山市'); assert.equal(col(r, '相談内容'), '残置物・片付け、空室清掃');
  assert.equal(col(r, '写真枚数'), 2); assert.equal(col(r, '対応状況'), '未対応');
  assert.equal(col(r, 'サービス'), '売却前おまかせデスク'); assert.equal(col(r, 'サービス区分'), 'sale_support');
});
t('repair desk cases are labelled and keep repair-only fields', () => {
  const r = post({ ...base, business_line: 'repair_desk', company: '松山管理', services: ['建具・設備まわり'], reason: ['繁忙で手が回らない', '対応外の工種'], urgency: '早めに対応したい', segment: '管理会社', entry: 'utm_source=mail | landing=/repair/' });
  assert.equal(r.ok, true);
  const row = rows['案件'].at(-1);
  assert.equal(col(row, 'サービス'), '愛媛修繕デスク'); assert.equal(col(row, 'サービス区分'), 'repair_desk');
  assert.equal(col(row, '普段の施工会社で対応できない理由'), '繁忙で手が回らない、対応外の工種'); assert.equal(col(row, '緊急度'), '早めに対応したい');
  assert.equal(col(row, '業種'), '管理会社'); assert.equal(col(row, '流入元'), 'utm_source=mail | landing=/repair/');
  assert.match(mails.at(-1).subject, /【案件相談｜愛媛修繕デスク】/);
  rows['案件'].pop(); mails.pop();
});
t('unknown business line is still saved, marked as unknown', () => {
  const r = post({ ...base, business_line: 'evil' });
  assert.equal(r.ok, true);
  assert.equal(col(rows['案件'].at(-1), 'サービス区分'), 'unknown');
  rows['案件'].pop(); mails.pop();
});
t('sales KPI columns exist for manual tracking', () => {
  const headers = makeEnv().env.CASE_HEADERS;
  assert.equal(rows['案件'][0].length, headers.length);
  for (const h of ['見積日', '見積金額', '成約', '成約金額', '粗利', '再依頼']) assert.ok(headers.includes(h), h);
});
t('photos are stored in a per-case folder', () => {
  assert.equal(files.length, 2);
  assert.match(files[0].folder, /^MAT-\d{8}-001$/);
  assert.equal(files[0].type, 'image/jpeg');
});
t('notification email is sent with the case number', () => {
  assert.equal(mails.length, 2);
  assert.equal(mails[0].to, 'desk@example.com');
  assert.match(mails[0].subject, /MAT-\d{8}-001/);
  assert.match(mails[0].body, /相談内容：残置物・片付け、空室清掃/);
});
t('missing contact (no tel and no email) is rejected', () => {
  const r = post({ ...base, tel: '', email: '' });
  assert.equal(r.ok, false); assert.deepEqual(r.fields, ['contact']);
  assert.equal(rows['案件'].length, 2);
});
t('missing services / area are rejected', () => {
  const r = post({ ...base, services: [], area: '' });
  assert.equal(r.ok, false); assert.ok(r.fields.includes('services') && r.fields.includes('area'));
});
t('honeypot submissions are dropped silently', () => {
  const r = post({ ...base, website: 'spam' });
  assert.equal(r.ok, true); assert.equal(r.caseId, undefined); assert.equal(rows['案件'].length, 2);
});
t('more than 10 photos is rejected', () => {
  const r = post({ ...base, photos: Array.from({ length: 11 }, (_, i) => ({ name: i + '.jpg', dataUrl: png })) });
  assert.equal(r.ok, false);
});
t('partner registration is stored in its own sheet', () => {
  const r = post({ formType: 'partner', p_company: '草刈り屋', p_name: '佐藤', p_tel: '0899000000', p_email: 'a@b.jp', p_trades: ['草刈り・外回り'], p_city: '松山市' });
  assert.equal(r.ok, true); assert.match(r.caseId, /^PTN-\d{8}-001$/);
  assert.equal(rows['協力事業者'].length, 1);
});
t('sequence counter is stored per day', () => {
  assert.ok(Object.keys(props).some((k) => /^SEQ_MAT_\d{8}$/.test(k) && props[k] === '4'));
});
t('broken JSON returns an error, not an exception', () => {
  const { env } = makeEnv();
  const r = JSON.parse(env.doPost({ postData: { contents: '{bad' } }).text);
  assert.equal(r.ok, false);
});
console.log(`backend tests passed: ${passed}`);
}

```


---

# スタイル

## ファイル：src/assets/style.css

```css
/* 愛媛修繕デスク・売却前おまかせデスク — 共通デザインシステム
   2つのサービスで部品（文字・余白・ボタン・フォーム）を共有し、色だけを body のクラスで切り替える。
   .theme-sale   売却前おまかせデスク：既定（深緑・生成り・テラコッタ）
   .theme-repair 愛媛修繕デスク：ネイビー・白・青 */
:root {
  --ink: #23292a;
  --ink-2: #454f4d;
  --muted: #6a7370;
  --line: #d9d5cc;
  --line-2: #e9e6df;
  --paper: #f4f2ed;
  --paper-2: #ebe8e0;
  --white: #fff;
  --green: #1e3d38;
  --green-2: #2e5650;
  --green-soft: #e3eae7;
  --accent: #b0521e;
  --accent-dark: #8c3f12;
  --accent-soft: #f5e7dc;
  --error: #b42318;
  --shade: 16 22 21;
  --shade-2: 20 34 31;
  --hi: #f0b994;
  --hi-2: #f3d3bd;
  --footer: #1d2322;
  --footer-ink: #c9d0cd;
  --footer-muted: #9aa5a1;
  --footer-link: #e9eeec;
  --footer-line: #333c3a;
  --line-strong: #b7b1a5;
  --sans: "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
  --serif: "Shippori Mincho B1", "Yu Mincho", "YuMincho", "Hiragino Mincho ProN", serif;
  --w: 1240px;
  --gutter: 24px;
  --header-h: 84px;
}

*, *::before, *::after { box-sizing: border-box; }
[hidden] { display: none !important; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; scroll-padding-top: calc(var(--header-h) + 16px); }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
body { margin: 0; font-family: var(--sans); font-size: 16px; line-height: 1.9; letter-spacing: .03em; color: var(--ink); background: var(--white); overflow-wrap: anywhere; line-break: strict; }
img, svg { max-width: 100%; display: block; }
img { height: auto; }
a { color: var(--green-2); text-underline-offset: 3px; }
a:hover { color: var(--accent-dark); }
h1, h2, h3, h4 { margin: 0; font-weight: 600; line-height: 1.5; letter-spacing: .04em; font-feature-settings: "palt" 1; }
h1, h2, h3, .intro__lead { word-break: auto-phrase; text-wrap: balance; }
.nw { white-space: nowrap; }
p { margin: 0 0 1em; }
ul, ol { margin: 0; padding: 0; }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
.skip { position: absolute; left: -9999px; top: 8px; z-index: 300; background: var(--ink); color: #fff; padding: 8px 14px; }
.skip:focus { left: 8px; color: #fff; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.container { width: 100%; max-width: calc(var(--w) + var(--gutter) * 2); margin: 0 auto; padding: 0 var(--gutter); }
.br-pc { display: none; }
@media (min-width: 768px) { .br-pc { display: inline; } .br-sp { display: none; } }
@media (max-width: 767px) { :root { --gutter: 20px; } }

/* ---------- buttons & links ---------- */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 14px; min-height: 56px; padding: 12px 28px; font-weight: 700; font-size: 15px; line-height: 1.4; letter-spacing: .06em; text-decoration: none; border: 1px solid transparent; border-radius: 0; cursor: pointer; transition: background-color .2s, color .2s, border-color .2s; font-family: var(--sans); }
.btn::after { content: ""; width: 26px; height: 7px; flex: none; background: currentColor; clip-path: polygon(0 calc(100% - 1px), calc(100% - 7px) calc(100% - 1px), calc(100% - 7px) 0, 100% 100%, 0 100%); transition: transform .2s; }
.btn:hover::after { transform: translateX(4px); }
.btn--primary { background: var(--accent); color: #fff; }
.btn--primary:hover { background: var(--accent-dark); color: #fff; }
.btn--block { width: 100%; }
.btn-row { display: flex; flex-wrap: wrap; align-items: center; gap: 16px 32px; }
.more { display: inline-flex; align-items: center; justify-content: space-between; gap: 40px; min-width: 260px; min-height: 48px; padding: 8px 0; border-bottom: 1px solid currentColor; color: var(--ink); text-decoration: none; font-size: 15px; letter-spacing: .06em; }
.more::after { content: ""; width: 30px; height: 7px; flex: none; background: currentColor; clip-path: polygon(0 calc(100% - 1px), calc(100% - 7px) calc(100% - 1px), calc(100% - 7px) 0, 100% 100%, 0 100%); transition: transform .2s; }
.more:hover { color: var(--accent-dark); }
.more:hover::after { transform: translateX(5px); }
.more--light { color: #fff; }
.more--light:hover { color: var(--hi-2); }

/* ---------- header ---------- */
.site-header { position: sticky; top: 0; z-index: 100; background: #fff; border-bottom: 1px solid var(--line-2); transition: background-color .3s, border-color .3s; }
.site-header__inner { display: flex; align-items: center; gap: 28px; height: var(--header-h); max-width: calc(1360px + var(--gutter) * 2); margin: 0 auto; padding: 0 var(--gutter); }
.logo { display: inline-flex; align-items: center; gap: 12px; color: var(--green); text-decoration: none; flex: none; }
.logo:hover { color: var(--green); }
.logo__mark { width: 38px; height: 38px; }
.logo__text { display: flex; flex-direction: column; line-height: 1.25; }
.logo__name { font-family: var(--serif); font-weight: 700; font-size: 21px; letter-spacing: .1em; color: var(--ink); }
.logo__sub { font-size: 9.5px; letter-spacing: .26em; color: var(--muted); font-weight: 500; }
.gnav { margin-left: auto; display: flex; align-items: center; gap: 24px; }
.gnav__list { display: flex; list-style: none; gap: 4px; }
.gnav__list a { display: block; padding: 10px 12px; font-size: 14px; white-space: nowrap; color: var(--ink); text-decoration: none; letter-spacing: .06em; position: relative; }
.gnav__list a::after { content: ""; position: absolute; left: 12px; right: 12px; bottom: 4px; height: 1px; background: currentColor; transform: scaleX(0); transition: transform .2s; transform-origin: left; }
.gnav__list a:hover::after, .gnav__list a[aria-current="page"]::after { transform: scaleX(1); }
.gnav__list a[aria-current="page"] { color: var(--accent-dark); }
.gnav__cta { min-height: 48px; padding: 8px 20px; font-size: 14px; white-space: nowrap; }
.menu-btn { display: none; }

/* home: header sits over the hero photo until scrolled */
.page-home .site-header { position: fixed; left: 0; right: 0; }
.page-home .site-header.is-over { background: transparent; border-bottom-color: transparent; }
.page-home .site-header.is-over .logo, .page-home .site-header.is-over .logo__name, .page-home .site-header.is-over .gnav__list a { color: #fff; }
.page-home .site-header.is-over .logo__sub { color: rgba(255,255,255,.8); }
.page-home .site-header.is-over .menu-btn { color: #fff; border-color: rgba(255,255,255,.6); }

@media (max-width: 1240px) {
  :root { --header-h: 68px; }
  .menu-btn { display: inline-flex; flex-direction: column; align-items: center; justify-content: center; margin-left: auto; width: 64px; height: 56px; padding: 0 0 2px; background: none; border: 1px solid var(--line); cursor: pointer; color: var(--ink); }
  .menu-btn__bars, .menu-btn__bars::before, .menu-btn__bars::after { display: block; width: 24px; height: 1.5px; background: currentColor; position: relative; transition: transform .2s, background-color .2s; }
  .menu-btn__bars::before, .menu-btn__bars::after { content: ""; position: absolute; left: 0; }
  .menu-btn__bars::before { top: -7px; } .menu-btn__bars::after { top: 7px; }
  .menu-btn__bars { margin-top: 6px; }
  .menu-btn__label { font-size: 10px; line-height: 1; letter-spacing: .08em; margin-top: 12px; }
  .menu-btn[aria-expanded="true"] .menu-btn__bars { background: transparent; }
  .menu-btn[aria-expanded="true"] .menu-btn__bars::before { transform: translateY(7px) rotate(45deg); }
  .menu-btn[aria-expanded="true"] .menu-btn__bars::after { transform: translateY(-7px) rotate(-45deg); }
  .gnav { position: fixed; inset: var(--header-h) 0 0 0; z-index: 99; display: none; flex-direction: column; align-items: stretch; gap: 0; background: #fff; padding: 8px var(--gutter) 40px; overflow-y: auto; border-top: 1px solid var(--line); }
  .gnav.is-open { display: flex; }
  .gnav__list { flex-direction: column; gap: 0; }
  .gnav__list a, .page-home .site-header.is-over .gnav__list a { padding: 20px 4px; font-size: 16px; border-bottom: 1px solid var(--line-2); display: flex; justify-content: space-between; color: var(--ink); }
  .gnav__list a::after { content: "→"; position: static; transform: none; background: none; height: auto; color: var(--accent); }
  .gnav__cta { margin-top: 28px; min-height: 60px; font-size: 16px; }
  body.nav-open { overflow: hidden; }
  body.nav-open .site-header.is-over { background: #fff; border-bottom-color: var(--line-2); }
  body.nav-open .site-header.is-over .logo, body.nav-open .site-header.is-over .logo__name { color: var(--ink); }
  body.nav-open .site-header.is-over .logo__sub { color: var(--muted); }
  body.nav-open .site-header.is-over .menu-btn { color: var(--ink); border-color: var(--line); }
}
@media (max-width: 380px) { .logo__name { font-size: 18px; } .logo__mark { width: 32px; height: 32px; } }

/* ---------- section scaffolding ---------- */
.section { padding: 128px 0; }
.section--paper { background: var(--paper); }
.section--tight { padding: 80px 0; }
.eyebrow { display: block; font-size: 12px; font-weight: 500; letter-spacing: .24em; color: var(--accent-dark); margin-bottom: 18px; }
.sec-title { font-family: var(--serif); font-size: clamp(28px, 3.3vw, 44px); font-weight: 600; line-height: 1.55; }
.sec-lead { margin-top: 24px; color: var(--ink-2); max-width: 40em; }
.sec-head { margin-bottom: 64px; }
.sec-head--split { display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); gap: 24px 80px; align-items: end; }
.sec-head--split .sec-lead { margin: 0; }
@media (max-width: 1023px) { .sec-head--split { grid-template-columns: 1fr; } }
@media (max-width: 767px) { .section { padding: 64px 0; } .section--tight { padding: 44px 0; } .sec-head { margin-bottom: 32px; } }

.photo { position: relative; overflow: hidden; background: var(--paper-2); margin: 0; }
.photo img { width: 100%; height: 100%; object-fit: cover; }
.photo__cap { position: absolute; z-index: 2; right: 12px; bottom: 12px; font-size: 11px; letter-spacing: .08em; background: rgba(255,255,255,.92); color: var(--ink-2); padding: 3px 10px; line-height: 1.6; }
.photo__cap--dark { background: rgb(var(--shade) / .72); color: #fff; }

/* ---------- home hero ---------- */
.hero { position: relative; min-height: max(640px, min(100svh, 920px)); display: flex; flex-direction: column; justify-content: flex-end; color: #fff; overflow: hidden; background: var(--footer); }
.hero__bg { position: absolute; inset: 0; margin: 0; }
.hero__bg img { width: 100%; height: 100%; object-fit: cover; object-position: 60% 50%; }
.hero__bg img { filter: saturate(.9); }
.hero__bg::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgb(var(--shade) / .8) 0%, rgb(var(--shade) / .58) 45%, rgb(var(--shade) / .32) 80%), linear-gradient(0deg, rgb(var(--shade) / .55) 0%, rgb(var(--shade) / 0) 40%); }
.hero__inner { position: relative; padding-top: calc(var(--header-h) + 72px); padding-bottom: 56px; }
.hero__eyebrow { display: inline-block; font-size: 13.5px; letter-spacing: .14em; margin-bottom: 28px; padding-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,.6); }
.hero__title { font-family: var(--serif); font-size: clamp(36px, 5.2vw, 72px); font-weight: 600; line-height: 1.5; letter-spacing: .08em; text-shadow: 0 2px 24px rgba(0,0,0,.25); }
.hero__lead { margin-top: 28px; font-size: 16.5px; line-height: 2.05; max-width: 33em; color: rgba(255,255,255,.92); }
.hero__actions { margin-top: 40px; }
.hero__foot { position: relative; border-top: 1px solid rgba(255,255,255,.28); background: rgb(var(--shade) / .5); }
.hero__foot-inner { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 32px; min-height: 84px; }
.hero__foot-label { font-size: 12.5px; letter-spacing: .16em; padding-right: 28px; border-right: 1px solid rgba(255,255,255,.4); }
.hero__segs { list-style: none; display: flex; flex-wrap: wrap; gap: 4px 40px; }
.hero__segs a { color: #fff; text-decoration: none; font-size: 15px; letter-spacing: .06em; display: inline-flex; align-items: center; gap: 12px; padding: 10px 0; }
.hero__segs a::after { content: "→"; color: var(--hi); transition: transform .2s; }
.hero__segs a:hover { color: var(--hi-2); }
.hero__segs a:hover::after { transform: translateX(4px); }
.hero .photo__cap { position: static; justify-self: end; }
@media (max-width: 1023px) {
  .hero__foot-inner { grid-template-columns: 1fr; gap: 0; padding-top: 16px; padding-bottom: 20px; }
  .hero__foot-label { border: 0; padding: 0; }
}
@media (max-width: 767px) {
  .hero { min-height: 0; }
  .hero__bg img { object-position: 85% 60%; }
  .hero__bg::after { background: linear-gradient(0deg, rgb(var(--shade) / .88) 0%, rgb(var(--shade) / .64) 55%, rgb(var(--shade) / .38) 100%); }
  .hero__inner { padding-top: calc(var(--header-h) + 112px); padding-bottom: 36px; }
  .hero__eyebrow { font-size: 12.5px; margin-bottom: 20px; }
  .hero__lead { font-size: 15px; margin-top: 20px; }
  .hero__actions { margin-top: 28px; }
  .hero__actions .btn { width: 100%; }
  .hero__segs { flex-direction: column; gap: 0; }
  .hero__segs li { border-top: 1px solid rgba(255,255,255,.2); }
  .hero__segs a { display: flex; justify-content: space-between; padding: 14px 0; }
}

/* ---------- facts (micro trust) ---------- */
.facts { background: var(--paper); border-bottom: 1px solid var(--line-2); }
.facts__list { list-style: none; display: grid; grid-template-columns: repeat(4, 1fr); }
.facts__item { padding: 30px 28px; border-left: 1px solid var(--line); display: grid; gap: 6px; align-content: start; }
.facts__item:first-child { border-left: 0; padding-left: 0; }
.facts__k { font-size: 12px; letter-spacing: .16em; color: var(--accent-dark); }
.facts__v { font-weight: 700; font-size: 15.5px; line-height: 1.7; }
@media (max-width: 1023px) {
  .facts__list { grid-template-columns: 1fr 1fr; }
  .facts__item { padding: 22px 18px; border-left: 0; border-top: 1px solid var(--line); }
  .facts__item:nth-child(odd) { padding-left: 0; }
  .facts__item:nth-child(even) { border-left: 1px solid var(--line); }
  .facts__item:nth-child(-n+2) { border-top: 0; }
}
@media (max-width: 430px) { .facts__item { padding: 18px 12px; } .facts__v { font-size: 14px; } .facts__k { font-size: 11px; letter-spacing: .1em; } }

/* ---------- intro statement ---------- */
.intro { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); gap: 48px 96px; }
.intro__title { font-family: var(--serif); font-size: clamp(30px, 3.6vw, 48px); font-weight: 600; line-height: 1.6; }
.intro__lead { font-family: var(--serif); font-size: clamp(18px, 1.6vw, 21px); line-height: 2.1; font-weight: 500; margin-bottom: 32px; }
.intro__body { color: var(--ink-2); font-size: 15.5px; line-height: 2.1; }
.intro__note { margin-top: 28px; font-size: 13.5px; color: var(--muted); }
@media (max-width: 1023px) { .intro { grid-template-columns: 1fr; } }
@media (max-width: 767px) { .intro { gap: 28px; } }

/* ---------- problems ---------- */
.problems { list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 0 64px; border-top: 1px solid var(--ink); }
.problems li { display: grid; grid-template-columns: 52px 1fr; padding: 30px 0; border-bottom: 1px solid var(--line); }
.problems__no { font-family: var(--serif); font-size: 15px; color: var(--accent-dark); padding-top: 3px; }
.problems h3 { font-size: 18px; margin-bottom: 6px; font-weight: 700; }
.problems p { margin: 0; color: var(--ink-2); font-size: 15px; }
@media (max-width: 767px) { .problems { grid-template-columns: 1fr; } .problems li { grid-template-columns: 36px 1fr; padding: 20px 0; } .problems h3 { font-size: 16px; } .problems p { font-size: 14.5px; } }

/* ---------- photo + overlapping panel ---------- */
.overlap { position: relative; display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); align-items: center; }
.overlap__photo { grid-column: 1 / 2; grid-row: 1; aspect-ratio: 4 / 3; min-height: 420px; }
.overlap__panel { grid-column: 1 / 3; grid-row: 1; justify-self: end; width: min(560px, 46%); background: #fff; padding: 64px 60px; position: relative; z-index: 2; margin-top: 200px; box-shadow: 0 0 0 1px var(--line-2); }
.overlap__panel h2 { font-family: var(--serif); font-size: clamp(26px, 2.8vw, 38px); line-height: 1.6; margin-bottom: 28px; }
.overlap__panel p { color: var(--ink-2); font-size: 15.5px; }
.overlap__photo .photo__cap { right: auto; left: 12px; }
@media (max-width: 1023px) {
  .overlap { grid-template-columns: 1fr; }
  .overlap__photo { grid-column: 1; min-height: 0; aspect-ratio: 16 / 10; }
  .overlap__photo .photo__cap { top: 12px; bottom: auto; }
  .overlap__panel { grid-column: 1; grid-row: 2; width: auto; margin: -64px var(--gutter) 0; padding: 40px 32px; justify-self: stretch; }
}
@media (max-width: 600px) { .overlap__panel { margin: -40px 12px 0; padding: 32px 22px; } }

/* concept detail */
.concept-detail { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 56px 80px; margin-top: 112px; }
.concept-detail h3 { font-family: var(--serif); font-size: 21px; margin-bottom: 18px; }
.not-list { list-style: none; border-top: 1px solid var(--ink); }
.not-list li { padding: 16px 0 16px 36px; position: relative; border-bottom: 1px solid var(--line); font-size: 15px; }
.not-list li::before, .not-list li::after { content: ""; position: absolute; left: 6px; top: 50%; width: 14px; height: 1.5px; background: var(--accent-dark); }
.not-list li::before { transform: rotate(45deg); }
.not-list li::after { transform: rotate(-45deg); }
.not-list--ok li::before { width: 7px; height: 12px; left: 9px; top: calc(50% - 8px); background: none; border-right: 1.5px solid var(--green-2); border-bottom: 1.5px solid var(--green-2); transform: rotate(45deg); }
.not-list--ok li::after { display: none; }
.not-note { margin-top: 14px; font-size: 13.5px; color: var(--muted); }
@media (max-width: 1023px) { .concept-detail { grid-template-columns: 1fr; margin-top: 72px; } }
@media (max-width: 767px) { .concept-detail { margin-top: 56px; } }

/* relation diagram */
.rel { display: grid; text-align: center; font-weight: 700; }
.rel small { display: block; font-size: 11.5px; font-weight: 500; color: var(--muted); letter-spacing: .04em; line-height: 1.5; margin-bottom: 4px; }
.rel__you { background: var(--ink); color: #fff; padding: 16px; font-size: 17px; }
.rel__you small { color: #c6cfcc; margin: 2px 0 0; }
.rel__lines { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; height: 32px; }
.rel__lines span { justify-self: center; width: 0; height: 100%; }
.rel__solid { border-left: 1.5px solid var(--ink); }
.rel__dash { border-left: 2px dashed var(--accent); }
.rel__pair { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.rel__box { border: 1px solid var(--ink); padding: 14px 10px; background: #fff; font-size: 15.5px; line-height: 1.5; display: flex; flex-direction: column; justify-content: center; }
.rel__box--desk { border: 2px solid var(--accent); background: var(--accent-soft); color: var(--accent-dark); }
.rel__desk-col { display: grid; }
.rel__drop { justify-self: center; height: 20px; border-left: 2px dashed var(--accent); }
.rel__partners { display: grid; gap: 6px; border-top: 2px dashed var(--accent); padding-top: 10px; }
.rel__partners span { border: 1px solid var(--line); background: var(--paper); font-size: 12.5px; padding: 8px 4px; line-height: 1.5; font-weight: 500; }
.rel__usual-col { display: grid; align-content: start; }
.rel__usual-note { font-size: 12px; font-weight: 500; color: var(--muted); padding-top: 14px; line-height: 1.6; }
.rel-cap { font-size: 12.5px; color: var(--muted); margin-top: 14px; }

/* ---------- services rows ---------- */
.svc-rows { border-top: 1px solid var(--ink); }
.svc-row { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); gap: 16px 64px; padding: 44px 0; border-bottom: 1px solid var(--line); }
.svc-row h3 { font-family: var(--serif); font-size: 24px; line-height: 1.5; }
.svc-row .en { display: block; font-size: 11px; letter-spacing: .22em; color: var(--accent-dark); margin-top: 8px; font-family: var(--sans); font-weight: 500; }
.svc-row p { color: var(--ink-2); font-size: 15.5px; margin-bottom: 16px; }
.svc-row ul { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; }
.svc-row li { font-size: 13.5px; padding: 4px 12px; border: 1px solid var(--line); background: #fff; }
.mark { color: var(--accent-dark); font-weight: 700; margin-left: 2px; }
.svc-note { margin-top: 32px; padding: 22px 26px; background: var(--paper); border: 1px solid var(--line-2); font-size: 14.5px; color: var(--ink-2); }
.svc-note p:last-child { margin: 0; }
@media (max-width: 767px) { .svc-row { grid-template-columns: 1fr; padding: 24px 0; gap: 8px; } .svc-row h3 { font-size: 20px; } .svc-row div > p:not(:only-child) { display: none; } .svc-row ul { gap: 6px; } .svc-row li { font-size: 13px; padding: 3px 10px; } }

/* ---------- segments tiles ---------- */
.segments { padding-top: 128px; }
.segments__head .sec-head { margin-bottom: 56px; }
@media (max-width: 767px) { .segments { padding-top: 64px; } .segments__head .sec-head { margin-bottom: 32px; } }
.tiles { display: grid; grid-template-columns: repeat(3, 1fr); }
.tile { position: relative; display: flex; flex-direction: column; justify-content: flex-end; min-height: 580px; padding: 48px 40px 40px; color: #fff; text-decoration: none; overflow: hidden; background: var(--ink); }
.tile img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .6s; }
.tile::before { content: ""; position: absolute; inset: 0; z-index: 1; background: linear-gradient(0deg, rgb(var(--shade) / .9) 0%, rgb(var(--shade) / .62) 55%, rgb(var(--shade) / .2) 100%); }
.tile > *:not(img) { position: relative; z-index: 2; }
.tile:hover { color: #fff; }
.tile:hover img { transform: scale(1.04); }
.tile__en { font-size: 11.5px; letter-spacing: .22em; color: rgba(255,255,255,.88); margin-bottom: 10px; text-shadow: 0 1px 8px rgba(0,0,0,.5); }
.tile h3 { font-family: var(--serif); font-size: clamp(24px, 2.3vw, 32px); line-height: 1.5; }
.tile p { margin: 14px 0 26px; font-size: 14.5px; line-height: 1.9; color: rgba(255,255,255,.9); }
.tile .more { min-width: 0; width: 100%; color: #fff; }
.tile > .photo__cap { position: absolute; top: 14px; right: 14px; bottom: auto; }
@media (max-width: 1023px) { .tiles { grid-template-columns: 1fr; } .tile { min-height: 400px; padding: 40px var(--gutter) 32px; } }
@media (max-width: 600px) { .tile { min-height: 290px; padding-top: 32px; } .tile p { margin: 8px 0 16px; } }

/* ---------- flow rows ---------- */
.flow-wrap { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 48px 96px; }
.flow-wrap__head { position: sticky; top: calc(var(--header-h) + 40px); align-self: start; }
.flow { list-style: none; counter-reset: step; border-top: 1px solid var(--ink); }
.flow li { counter-increment: step; display: grid; grid-template-columns: 64px 1fr; gap: 0 12px; padding: 28px 0; border-bottom: 1px solid var(--line); }
.flow li::before { content: counter(step, decimal-leading-zero); font-family: var(--serif); font-size: 20px; color: var(--accent-dark); line-height: 1.5; }
.flow h3 { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
.flow p { font-size: 15px; color: var(--ink-2); margin: 0; }
.flow li > div { min-width: 0; }
main li, main p, main dd, main span, main small, main td, .faq summary { word-break: auto-phrase; text-wrap: pretty; }
.flow__opt { display: inline-block; font-size: 11px; font-weight: 700; padding: 0 8px; border: 1px solid var(--green-2); color: var(--green-2); margin-left: 10px; vertical-align: 2px; letter-spacing: .04em; line-height: 1.8; }
.flow-note { margin-top: 24px; font-size: 13.5px; color: var(--muted); }
@media (max-width: 1023px) { .flow-wrap { grid-template-columns: 1fr; } .flow-wrap__head { position: static; } }
@media (max-width: 600px) { .flow li { grid-template-columns: 44px 1fr; padding: 18px 0; } .flow li::before { font-size: 17px; } .flow h3 { font-size: 16px; } .flow p { font-size: 14px; } }

/* ---------- area ---------- */
.area { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 56px 80px; align-items: center; }
.area__map { background: #fff; border: 1px solid var(--line); padding: 20px; margin: 0; }
.area__map figcaption { font-size: 12px; color: var(--muted); margin-top: 8px; }
.area__table { width: 100%; border-collapse: collapse; border-top: 1px solid var(--ink); }
.area__table th, .area__table td { text-align: left; padding: 22px 0; border-bottom: 1px solid var(--line); vertical-align: top; }
.area__table th { width: 9em; font-size: 14px; font-weight: 500; color: var(--accent-dark); padding-right: 16px; letter-spacing: .08em; }
.area__table th { word-break: keep-all; }
.area__table td strong { font-size: 19px; font-family: var(--serif); font-weight: 600; }
.area__table td > span { display: block; font-size: 14px; color: var(--ink-2); margin-top: 6px; }
@media (max-width: 1023px) { .area { grid-template-columns: 1fr; } }
@media (max-width: 600px) { .area__table th { width: 7.8em; font-size: 13px; letter-spacing: 0; white-space: nowrap; padding-right: 12px; } .area__table td strong { font-size: 17px; } .area__map { padding: 8px; } .area__map svg { max-height: 260px; } }

/* ---------- faq ---------- */
.faq-wrap { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); gap: 40px 80px; }
.faq-for { font-size: 14px; color: var(--accent-dark); letter-spacing: .08em; margin-bottom: 10px; }
.faq { border-top: 1px solid var(--ink); }
.faq details { border-bottom: 1px solid var(--line); }
.faq summary { list-style: none; cursor: pointer; display: grid; grid-template-columns: 40px 1fr 24px; gap: 8px; align-items: start; padding: 24px 0; font-weight: 700; font-size: 16.5px; line-height: 1.7; }
.faq summary::-webkit-details-marker { display: none; }
.faq summary::before { content: "Q."; font-family: var(--serif); font-size: 19px; color: var(--accent-dark); line-height: 1.5; }
.faq summary::after { content: ""; width: 14px; height: 14px; margin-top: 7px; justify-self: end; background: linear-gradient(var(--ink), var(--ink)) center/14px 1.5px no-repeat, linear-gradient(var(--ink), var(--ink)) center/1.5px 14px no-repeat; transition: transform .2s; }
.faq details[open] summary::after { transform: rotate(45deg); }
.faq summary:hover { color: var(--accent-dark); }
.faq__a { display: grid; grid-template-columns: 40px 1fr; gap: 8px; padding: 0 32px 26px 0; color: var(--ink-2); font-size: 15.5px; }
.faq__a::before { content: "A."; font-family: var(--serif); font-size: 19px; color: var(--green-2); line-height: 1.6; }
.faq__a p { margin: 0; }
.faq__a p + p, .faq__a ul { margin-top: .6em; }
.faq__a ul { padding-left: 1.2em; }
@media (max-width: 1023px) { .faq-wrap { grid-template-columns: 1fr; } }
@media (max-width: 600px) { .faq summary { grid-template-columns: 32px 1fr 20px; font-size: 15.5px; } .faq__a { grid-template-columns: 32px 1fr; padding-right: 0; } }

/* ---------- final cta ---------- */
.cta { position: relative; color: #fff; overflow: hidden; background: var(--green); }
.cta__bg { position: absolute; inset: 0; margin: 0; }
.cta__bg img { width: 100%; height: 100%; object-fit: cover; }
.cta__bg::after { content: ""; position: absolute; inset: 0; background: rgb(var(--shade-2) / .84); }
.cta__inner { position: relative; display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); gap: 56px 80px; align-items: center; padding-top: 120px; padding-bottom: 120px; }
.cta .eyebrow { color: var(--hi); }
.cta h2 { font-family: var(--serif); font-size: clamp(28px, 3.4vw, 46px); line-height: 1.6; }
.cta__lead { color: rgba(255,255,255,.88); margin: 24px 0 0; }
.cta__box { background: #fff; color: var(--ink); padding: 40px; }
.cta__box h3 { font-size: 16px; margin-bottom: 14px; }
.cta__box ol { list-style: none; counter-reset: c; margin-bottom: 28px; border-top: 1px solid var(--line); }
.cta__box li { counter-increment: c; padding: 11px 0 11px 36px; position: relative; border-bottom: 1px solid var(--line-2); font-size: 15px; }
.cta__box li::before { content: counter(c, decimal-leading-zero); position: absolute; left: 0; top: 12px; font-family: var(--serif); color: var(--accent-dark); font-size: 15px; }
.cta__box small { display: block; margin-top: 14px; color: var(--muted); font-size: 12.5px; line-height: 1.8; }
.cta .photo__cap { right: 16px; bottom: 16px; }
@media (max-width: 1023px) { .cta__inner { grid-template-columns: 1fr; padding-top: 88px; padding-bottom: 88px; } }
@media (max-width: 600px) { .cta__box { padding: 28px 20px; } }

/* ---------- sub page hero ---------- */
.phero { background: var(--paper); border-bottom: 1px solid var(--line-2); }
.phero__inner { display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 6fr); gap: 48px 72px; align-items: center; padding-top: 40px; padding-bottom: 96px; }
.crumbs { font-size: 12.5px; color: var(--muted); padding-top: 28px; letter-spacing: .06em; }
.crumbs ol { list-style: none; display: flex; flex-wrap: wrap; gap: 4px; }
.crumbs li + li::before { content: "／"; margin-right: 4px; color: var(--line); }
.crumbs a { color: var(--muted); display: inline-block; padding: 12px 0; margin: -12px 0; }
.phero h1 { font-family: var(--serif); font-size: clamp(27px, 2.9vw, 42px); line-height: 1.62; }
.phero__lead { margin-top: 26px; color: var(--ink-2); font-size: 16px; line-height: 2.05; }
.phero .btn-row { margin-top: 36px; }
.phero__photo { aspect-ratio: 4 / 3; }
.phero--text .phero__inner { grid-template-columns: 1fr; padding-bottom: 64px; }
.phero--text .phero__lead { max-width: 46em; }
@media (max-width: 1023px) { .phero__inner { grid-template-columns: 1fr; padding-bottom: 64px; } .phero__photo { order: -1; aspect-ratio: 16 / 10; } }
@media (max-width: 767px) { .phero .btn-row .btn { width: 100%; } .phero__photo { margin: 0 calc(var(--gutter) * -1); } }

/* scenes with photos (needs) */
.needs { display: grid; gap: 40px; }
.need { display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); background: #fff; border: 1px solid var(--line-2); }
.need:nth-child(even) { grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); }
.need:nth-child(even) .need__photo { order: 2; }
.need__photo { min-height: 340px; }
.need__body { padding: 56px 52px; align-self: center; }
.need__tag { display: inline-block; font-size: 12px; letter-spacing: .14em; color: var(--accent-dark); margin-bottom: 14px; }
.need h3 { font-family: var(--serif); font-size: clamp(21px, 2vw, 27px); line-height: 1.55; margin-bottom: 16px; }
.need p { color: var(--ink-2); font-size: 15.5px; margin: 0; }
@media (max-width: 1023px) { .need, .need:nth-child(even) { grid-template-columns: 1fr; } .need:nth-child(even) .need__photo { order: 0; } .need__photo { min-height: 0; aspect-ratio: 16 / 10; } .need__body { padding: 32px 24px 36px; } }

.scenes { list-style: none; display: grid; grid-template-columns: repeat(3, 1fr); gap: 0 48px; border-top: 1px solid var(--ink); margin-top: 56px; }
.scenes li { padding: 28px 0; border-bottom: 1px solid var(--line); }
.scenes__tag { display: inline-block; font-size: 12px; letter-spacing: .1em; color: var(--accent-dark); margin-bottom: 8px; }
.scenes h3 { font-size: 17px; font-weight: 700; margin-bottom: 6px; }
.scenes p { margin: 0; font-size: 14.5px; color: var(--ink-2); }
@media (max-width: 1023px) { .scenes { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) { .scenes { grid-template-columns: 1fr; } }
.scenes--4 { grid-template-columns: repeat(2, 1fr); }
@media (max-width: 600px) { .scenes--4 { grid-template-columns: 1fr; } }

.points { display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px; counter-reset: pt; list-style: none; }
.points li { counter-increment: pt; border-top: 1px solid var(--ink); padding-top: 28px; }
.points li::before { content: counter(pt, decimal-leading-zero); display: block; font-family: var(--serif); font-size: 26px; color: var(--accent-dark); margin-bottom: 12px; line-height: 1; }
.points h3 { font-family: var(--serif); font-size: 21px; margin-bottom: 12px; line-height: 1.55; }
.points p { margin: 0; font-size: 15px; color: var(--ink-2); }
@media (max-width: 1023px) { .points { grid-template-columns: 1fr; gap: 36px; } }

.prep { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 48px 64px; align-items: start; }
.prep__list { list-style: none; border-top: 1px solid var(--ink); }
.prep__list li { display: grid; grid-template-columns: 9.5em 1fr; gap: 16px; padding: 18px 0; border-bottom: 1px solid var(--line); font-size: 15px; }
.prep__list b { color: var(--green); }
.photo-tips { background: #fff; padding: 32px; border: 1px solid var(--line); }
.photo-tips h3 { font-size: 17px; margin-bottom: 14px; }
.photo-tips ul { list-style: none; }
.photo-tips li { padding: 9px 0 9px 26px; position: relative; font-size: 14.5px; border-top: 1px solid var(--line-2); }
.photo-tips li:first-child { border-top: 0; }
.photo-tips li::before { content: ""; position: absolute; left: 2px; top: 17px; width: 12px; height: 7px; border-left: 1.5px solid var(--accent); border-bottom: 1.5px solid var(--accent); transform: rotate(-45deg); }
@media (max-width: 1023px) { .prep { grid-template-columns: 1fr; } }
@media (max-width: 600px) { .prep__list li { grid-template-columns: 1fr; gap: 2px; } .photo-tips { padding: 24px 20px; } }

.notice { border: 1px solid var(--line); border-left: 3px solid var(--accent); background: #fff; padding: 22px 26px; font-size: 15px; }
.notice h3 { font-size: 16px; margin-bottom: 6px; }
.notice p:last-child, .notice ul:last-child { margin-bottom: 0; }
.notice p { word-break: normal; }
.notice ul { padding-left: 1.2em; }
.notice--muted { background: var(--paper); border-left-color: var(--green-2); }
[data-space="m"] { margin-top: 32px; }
[data-space="l"] { margin-top: 56px; }

.inline-cta { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px 32px; margin-top: 72px; padding: 36px 40px; background: var(--green); color: #fff; }
.inline-cta p { margin: 0; font-family: var(--serif); font-size: 21px; font-weight: 600; }
.inline-cta small { display: block; font-weight: 400; font-family: var(--sans); font-size: 13.5px; color: rgba(255,255,255,.8); margin-top: 6px; }
@media (max-width: 600px) { .inline-cta { padding: 28px 20px; } .inline-cta .btn { width: 100%; } }

.trade-table { width: 100%; border-collapse: collapse; border-top: 1px solid var(--ink); font-size: 15px; }
.trade-table th, .trade-table td { padding: 20px 16px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
.trade-table th { width: 28%; font-weight: 700; background: var(--paper); }
.section--paper .trade-table th { background: #fff; }
.trade-table td small { display: block; color: var(--accent-dark); font-size: 13px; margin-top: 6px; }
@media (max-width: 600px) { .trade-table th, .trade-table td { display: block; width: 100%; } .trade-table th { border-bottom: 0; padding-bottom: 6px; } .trade-table td { padding-top: 8px; } }

/* ---------- forms ---------- */
.form-wrap { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 64px; align-items: start; }
.form-aside { position: sticky; top: calc(var(--header-h) + 24px); display: grid; gap: 20px; }
.form-aside .notice { font-size: 14px; }
@media (max-width: 1023px) { .form-wrap { grid-template-columns: 1fr; gap: 40px; } .form-aside { position: static; } }
.form-intro { margin-bottom: 28px; font-size: 14.5px; color: var(--ink-2); }
.form-intro p { margin-bottom: 0; }
.form-intro .notice { margin-top: 14px; font-size: 14px; }
.form-scope { margin-top: 10px; font-size: 13.5px; color: var(--accent-dark); }
.form { border-top: 1px solid var(--ink); }
.fset { border: 0; margin: 0; padding: 0; }
.fset__legend { display: block; width: 100%; font-family: var(--serif); font-weight: 600; font-size: 21px; padding: 36px 0 8px; color: var(--ink); }
.fset__legend span { font-size: 11px; font-family: var(--sans); color: var(--accent-dark); font-weight: 500; margin-left: 12px; letter-spacing: .2em; }
.field { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 8px 28px; padding: 22px 0; border-bottom: 1px solid var(--line-2); }
.field__label { font-weight: 700; font-size: 15px; padding-top: 12px; display: flex; flex-wrap: wrap; align-items: flex-start; gap: 4px 10px; }
.req, .opt { font-size: 11px; font-weight: 700; padding: 1px 8px; line-height: 1.7; letter-spacing: .06em; flex: none; margin-top: 3px; }
.req { background: var(--accent); color: #fff; }
.opt { background: var(--paper-2); color: var(--muted); }
.field__hint { font-size: 13px; color: var(--muted); margin: 6px 0 0; line-height: 1.7; }
.field__err { font-size: 13.5px; color: var(--error); margin: 6px 0 0; font-weight: 700; }
.field__err:empty { display: none; }
.input, .select, .textarea { width: 100%; font: inherit; font-size: 16px; letter-spacing: .02em; color: var(--ink); background: #fff; border: 1px solid var(--line-strong); border-radius: 0; padding: 12px 14px; min-height: 52px; }
.textarea { min-height: 150px; resize: vertical; line-height: 1.8; }
.select { appearance: none; background-image: linear-gradient(45deg, transparent 50%, var(--ink) 50%), linear-gradient(135deg, var(--ink) 50%, transparent 50%); background-position: calc(100% - 20px) 50%, calc(100% - 15px) 50%; background-size: 5px 5px; background-repeat: no-repeat; padding-right: 40px; }
.input:focus, .select:focus, .textarea:focus { outline: 2px solid var(--accent); outline-offset: 0; border-color: var(--accent); }
.is-invalid .input, .is-invalid .select, .is-invalid .textarea { border-color: var(--error); background: #fff7f6; }
.choices { display: flex; flex-wrap: wrap; gap: 8px; border: 0; padding: 0; margin: 0; }
.choice { position: relative; }
.choice input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.choice span { display: inline-flex; align-items: center; min-height: 48px; padding: 8px 16px 8px 42px; border: 1px solid var(--line-strong); background: #fff; cursor: pointer; font-size: 15px; position: relative; line-height: 1.4; }
.choice span::before { content: ""; position: absolute; left: 14px; top: 50%; width: 17px; height: 17px; margin-top: -8.5px; border: 1.5px solid #8d877b; background: #fff; }
.choice input[type="radio"] + span::before { border-radius: 50%; }
.choice input:checked + span { border-color: var(--green); background: var(--green-soft); font-weight: 700; }
.choice input:checked + span::before { border-color: var(--green); background: var(--green); box-shadow: inset 0 0 0 3px #fff; }
.choice input:focus-visible + span { outline: 3px solid var(--accent); outline-offset: 2px; }
.is-invalid .choice span { border-color: var(--error); }
.upload { border: 1.5px dashed var(--line-strong); background: var(--paper); padding: 28px 24px; text-align: center; position: relative; }
.upload.is-drag { border-color: var(--accent); background: var(--accent-soft); }
.upload input[type="file"] { position: absolute; width: 1px; height: 1px; opacity: 0; }
.upload__btn { display: inline-flex; align-items: center; gap: 8px; min-height: 50px; padding: 10px 22px; border: 1px solid var(--ink); background: #fff; font-weight: 700; cursor: pointer; font-size: 15px; }
.upload input:focus-visible + .upload__btn { outline: 3px solid var(--accent); outline-offset: 2px; }
.upload__txt { font-size: 13.5px; color: var(--muted); margin: 12px 0 0; }
.thumbs { list-style: none; display: grid; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: 10px; margin-top: 14px; }
.thumbs:empty { display: none; }
.thumbs li { position: relative; border: 1px solid var(--line); background: #fff; }
.thumbs img { width: 100%; aspect-ratio: 1; object-fit: cover; }
.thumbs span { display: block; font-size: 11px; padding: 4px 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.thumbs button { position: absolute; top: 4px; right: 4px; width: 32px; height: 32px; border: 0; background: rgb(var(--shade) / .85); color: #fff; font-size: 18px; line-height: 1; cursor: pointer; }
.thumbs__file { aspect-ratio: 1; display: grid; place-items: center; background: var(--paper-2); font-weight: 700; color: var(--muted); }
.consent { padding: 28px 0 24px; font-size: 14.5px; }
.consent__row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; }
.consent__row a { display: inline-block; padding: 10px 0; font-size: 13.5px; }
.consent .req { margin-top: 0; }
.consent .choice span { min-height: 0; padding: 4px 0 4px 28px; border: 0; background: none; font-weight: 500; }
.consent .choice span::before { left: 0; }
.consent .choice input:checked + span { background: none; }
.form__submit { padding: 8px 0 0; }
.form__submit .btn { min-width: 340px; min-height: 64px; font-size: 16.5px; }
.form__submit .btn[disabled] { opacity: .6; cursor: progress; }
.form-status { margin: 0 0 20px; padding: 20px 22px; border: 1px solid var(--line); background: var(--paper); font-size: 15px; }
.form-status[hidden] { display: none; }
.form-status--error { border-color: var(--error); background: #fff7f6; color: var(--error); }
.form-status--done { border-color: var(--green); background: var(--green-soft); color: var(--green); margin-top: 20px; }
.form-status h3 { font-size: 16.5px; margin-bottom: 6px; }
.form-status p:last-child { margin: 0; }
.form-status ul { margin: 6px 0 0 1.2em; }
.form-status a { color: var(--error); font-weight: 700; }
#partner-form { max-width: 1000px; }
.mini-flow { list-style: none; counter-reset: m; margin: 8px 0 0; }
.mini-flow li { counter-increment: m; position: relative; padding: 6px 0 6px 30px; font-size: 14px; line-height: 1.7; }
.mini-flow li::before { content: counter(m); position: absolute; left: 0; top: 8px; width: 20px; height: 20px; display: grid; place-items: center; background: var(--green); color: #fff; font-size: 11px; font-weight: 700; }
@media (max-width: 767px) {
  .field { grid-template-columns: 1fr; padding: 18px 0; gap: 8px; }
  .field__label { padding-top: 0; }
  .form__submit .btn { min-width: 0; width: 100%; }
}

/* ---------- text pages ---------- */
.doc { max-width: 820px; }
.doc h2 { font-family: var(--serif); font-size: 22px; margin: 48px 0 14px; padding-bottom: 10px; border-bottom: 1px solid var(--line); }
.doc h2:first-child { margin-top: 0; }
.doc p, .doc li { color: var(--ink-2); font-size: 15.5px; }
.doc ul { padding-left: 1.3em; margin-bottom: 1em; }
.doc .credits { list-style: none; padding-left: 0; border-top: 1px solid var(--ink); }
.credit { display: grid; grid-template-columns: 200px minmax(0, 1fr); gap: 16px 32px; padding: 24px 0; border-bottom: 1px solid var(--line); }
.credit img { width: 200px; height: 150px; object-fit: cover; }
.credit dl { display: grid; grid-template-columns: 8em minmax(0, 1fr); gap: 4px 16px; margin: 0; font-size: 14px; }
.credit dt { color: var(--muted); }
.credit dd { margin: 0; }
.credit a { display: inline-block; padding: 10px 0; margin: -10px 0; }
.credits-note { margin-top: 20px; font-size: 13.5px; color: var(--muted); }
@media (max-width: 600px) { .credit { grid-template-columns: 1fr; } .credit dl { grid-template-columns: 8em minmax(0, 1fr); } }
.credit dt { white-space: nowrap; }

/* ---------- footer ---------- */
.site-footer { background: var(--footer); color: var(--footer-ink); padding: 80px 0 0; font-size: 14px; }
.site-footer .logo, .site-footer .logo__name { color: #fff; }
.site-footer .logo__sub { color: var(--footer-muted); }
.site-footer__inner { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 48px; padding-bottom: 56px; }
.site-footer__brand p { margin: 20px 0 0; }
.site-footer__area { color: var(--footer-muted); font-size: 13px; }
.site-footer__nav { list-style: none; display: grid; grid-template-columns: repeat(2, auto); gap: 2px 48px; }
.site-footer__nav a { color: var(--footer-link); text-decoration: none; display: inline-block; padding: 7px 0; }
.site-footer__nav a:hover { color: var(--hi); text-decoration: underline; }
.site-footer__note { border-top: 1px solid var(--footer-line); padding-top: 22px; padding-bottom: 30px; font-size: 12.5px; color: var(--footer-muted); display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 32px; }
.site-footer__note p { margin: 0; }
@media (max-width: 767px) { .site-footer { padding-top: 56px; padding-bottom: 80px; } .site-footer__inner { grid-template-columns: 1fr; } .site-footer__nav { grid-template-columns: 1fr 1fr; gap: 0 16px; } }

/* ---------- mobile fixed cta ---------- */
.mobile-cta { display: none; }
@media (max-width: 767px) {
  .mobile-cta { display: block; position: fixed; left: 0; right: 0; bottom: 0; z-index: 90; padding: 10px var(--gutter) calc(10px + env(safe-area-inset-bottom)); background: rgba(255,255,255,.97); border-top: 1px solid var(--line); transition: transform .25s; }
  .mobile-cta .btn { width: 100%; min-height: 52px; }
  .mobile-cta.is-hidden { transform: translateY(110%); }
  .page-contact .mobile-cta, .page-privacy .mobile-cta, .page-credits .mobile-cta { display: none; }
  .page-contact .site-footer, .page-privacy .site-footer, .page-credits .site-footer { padding-bottom: 0; }
}

/* ---------- 404 ---------- */
.nf { padding: 160px 0 120px; }
.nf h1 { font-family: var(--serif); font-size: clamp(26px, 3.4vw, 40px); margin-bottom: 16px; }
.nf__code { font-size: 13px; letter-spacing: .24em; color: var(--accent-dark); margin-bottom: 12px; }
.nf ul { list-style: none; margin-top: 40px; border-top: 1px solid var(--ink); max-width: 560px; }
.nf li a { display: flex; justify-content: space-between; padding: 18px 0; border-bottom: 1px solid var(--line); text-decoration: none; color: var(--ink); font-weight: 700; }
.nf li a::after { content: "→"; color: var(--accent); }
.nf li a:hover { color: var(--accent-dark); }

.draw { width: 100%; height: auto; font-family: var(--sans); }

/* =====================================================================
   売却前おまかせデスク（v3）— 追加コンポーネント
   ===================================================================== */
.btn--lg { min-height: 64px; padding: 14px 36px; font-size: 17px; }
.btn--back { background: #fff; color: var(--ink); border-color: var(--line); }
.btn--back:hover { border-color: var(--ink); color: var(--ink); }
.btn--back::after { display: none; }
.btn--line { background: transparent; color: #fff; border-color: rgba(255,255,255,.7); }
.btn--line:hover { background: #fff; color: var(--ink); }
.btn--tel { background: #fff; color: var(--green); border-color: var(--green); }
.btn--tel::after { display: none; }
.btn[disabled] { opacity: .6; cursor: progress; }
.linklike { background: none; border: 0; padding: 8px 0; color: var(--green-2); text-decoration: underline; text-underline-offset: 3px; font: inherit; font-size: 14px; cursor: pointer; }
.gnav__tel { font-weight: 700; color: var(--green); text-decoration: none; white-space: nowrap; padding: 10px 4px; }

/* hero */
.hero__bg::after { background: linear-gradient(90deg, rgb(var(--shade) / .78) 0%, rgb(var(--shade) / .5) 42%, rgb(var(--shade) / .08) 78%), linear-gradient(0deg, rgb(var(--shade) / .5) 0%, rgb(var(--shade) / 0) 36%); }
.hero__bg img { filter: saturate(.95) brightness(1.06); }
.hero__sub { margin: 24px 0 0; font-size: 14px; color: #fff; letter-spacing: .08em; font-weight: 500; }
@media (max-width: 767px) {
  .hero__bg::after { background: linear-gradient(0deg, rgb(var(--shade) / .86) 0%, rgb(var(--shade) / .6) 55%, rgb(var(--shade) / .3) 100%); }
  .hero__sub { font-size: 12.5px; letter-spacing: .02em; text-align: center; }
  .hero__foot-inner .photo__cap { justify-self: start; margin-top: 10px; }
}

.hero__title { font-size: clamp(30px, 4.2vw, 60px); }
.hero__lead { max-width: 38em; }
.hero__eyebrow { font-size: 15px; font-weight: 500; }
@media (max-width: 767px) { .hero__eyebrow { font-size: 13.5px; } }
@media (max-width: 767px) { .hero__title { font-size: clamp(28px, 8vw, 34px); letter-spacing: .04em; line-height: 1.55; } }
.rel__box--desk span { word-break: keep-all; }
@media (max-width: 600px) { .rel__box { font-size: 14px; } }

.hero__roles { list-style: none; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.hero__roles li { display: grid; grid-template-columns: auto 1fr; align-items: baseline; gap: 0 14px; padding: 6px 32px; border-left: 1px solid rgba(255,255,255,.28); }
.hero__roles li:first-child { border-left: 0; padding-left: 0; }
.hero__roles li span { grid-column: 1 / -1; font-size: 12px; letter-spacing: .1em; color: rgba(255,255,255,.7); }
.hero__roles b { font-size: 17px; letter-spacing: .06em; white-space: nowrap; }
.hero__roles em { grid-column: 1 / -1; }
.hero__roles em { font-style: normal; font-size: 13px; color: var(--hi-2); letter-spacing: .04em; }
.hero__roles li:last-child b { color: var(--hi-2); }
.hero__roles li:last-child em { color: rgba(255,255,255,.8); }
@media (max-width: 767px) {
  .hero__roles { grid-template-columns: 1fr; gap: 10px; margin-top: 8px; }
  .hero__roles li, .hero__roles li:first-child { border: 0; padding: 0; }
  .hero__roles b { font-size: 15px; }
}

.overlap__panel .split { display: grid; gap: 8px; margin: 20px 0 12px; padding: 16px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.overlap__panel .split span { display: grid; grid-template-columns: 7.5em 1fr; gap: 12px; font-size: 15px; color: var(--ink); font-weight: 700; }
.overlap__panel .split small { font-size: 12.5px; color: var(--accent-dark); font-weight: 700; letter-spacing: .06em; }
@media (max-width: 767px) { .hero__foot-inner .photo__cap { justify-self: end; margin-top: 12px; } .hero__roles li { display: grid; grid-template-columns: 1fr; } .hero__roles em { font-size: 12.5px; } }

/* services */
.svc-policy { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 7fr); gap: 8px 40px; margin: -16px 0 40px; padding: 24px 28px; background: var(--paper); }
.svc-policy h3 { font-family: var(--serif); font-size: 18px; margin: 0; }
.svc-policy p { margin: 0; font-size: 15px; color: var(--ink-2); }
.svc-when { display: block; font-size: 12px; font-weight: 700; letter-spacing: .08em; color: var(--green-2); margin-bottom: 2px; }
.svc-cta { margin: 28px 0 0; text-align: right; }
@media (max-width: 767px) { .svc-policy { grid-template-columns: 1fr; margin: 0 0 24px; padding: 20px 18px; } .svc-policy p { font-size: 14px; } .svc-row div > p:not(:only-child) { display: block; font-size: 13.5px; margin-bottom: 8px; } .svc-cta { text-align: left; } }

.cta__only { margin: 0 0 14px; font-size: 12.5px; font-weight: 700; letter-spacing: .1em; color: var(--accent-dark); }

/* services footnote */
.svc-foot { margin: 20px 0 0; font-size: 13px; color: var(--muted); line-height: 1.85; }

/* inline CTA */
.ctaline { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px 32px; margin-top: 56px; padding: 28px 32px; border: 1px solid var(--line); border-left: 4px solid var(--accent); background: #fff; }
.ctaline__text { margin: 0; font-family: var(--serif); font-size: 19px; font-weight: 600; }
.ctaline__act { display: grid; justify-items: center; gap: 6px; }
@media (max-width: 767px) { .ctaline { padding: 22px 18px; margin-top: 40px; } .ctaline__act, .ctaline__act .btn { width: 100%; } }

/* examples */
.examples { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; }
.example { background: #fff; display: grid; grid-template-rows: auto 1fr; }
.example__photo { aspect-ratio: 16 / 9; }
.example__body { padding: 26px 28px 30px; }
.example__label { margin: 0 0 6px; font-size: 12.5px; font-weight: 700; color: var(--accent-dark); letter-spacing: .1em; }
.example__q { font-family: var(--serif); font-size: clamp(19px, 1.8vw, 22px); line-height: 1.6; margin-bottom: 18px; }
.chain { list-style: none; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; counter-reset: ch; }
.chain li { position: relative; font-size: 14.5px; font-weight: 700; padding: 2px 0; }
.chain li + li { margin-left: 30px; }
.chain li + li::before { content: "→"; position: absolute; left: -22px; top: 50%; transform: translateY(-50%); color: var(--accent); font-weight: 700; }
.chain__goal { color: var(--green); border-bottom: 2px solid var(--green); }
@media (max-width: 1023px) { .examples { grid-template-columns: 1fr; } }
@media (max-width: 600px) {
  .example__body { padding: 20px 18px 24px; }
  .chain { gap: 6px 0; }
}


/* form section */
.form-section { background: var(--paper); }
.form-section__inner { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 7fr); gap: 40px 72px; align-items: start; }
.form-section__head { position: sticky; top: calc(var(--header-h) + 32px); }
.form-lead { font-family: var(--serif); font-size: 19px; line-height: 1.9; margin: 22px 0 0; }
.form-note { font-size: 14px; color: var(--muted); margin: 14px 0 0; }
.case { background: #fff; border: 1px solid var(--line); padding: 32px 36px 36px; min-width: 0; }
@media (max-width: 1023px) { .form-section__inner { grid-template-columns: 1fr; } .form-section__head { position: static; } }
@media (max-width: 600px) { .case { padding: 20px 16px 24px; margin: 0 calc(var(--gutter) * -1 + 4px); } }

.stepper { list-style: none; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; margin-bottom: 24px; }
.stepper__item { display: flex; align-items: center; gap: 8px; padding: 10px 8px; border-bottom: 3px solid var(--line-2); color: var(--muted); font-size: 13.5px; font-weight: 700; }
.stepper__no { flex: none; width: 26px; height: 26px; display: grid; place-items: center; border: 1.5px solid currentColor; font-size: 13px; }
.stepper__item[aria-current="step"] { color: var(--ink); border-bottom-color: var(--accent); }
.stepper__item[aria-current="step"] .stepper__no { background: var(--accent); border-color: var(--accent); color: #fff; }
.stepper__item.is-done { color: var(--green); border-bottom-color: var(--green); }
.stepper__item.is-done .stepper__no { background: var(--green); border-color: var(--green); color: #fff; }
@media (max-width: 430px) { .stepper__item { flex-direction: column; align-items: flex-start; gap: 4px; font-size: 12px; padding: 8px 2px; } }

.cstep { border: 0; padding: 0; margin: 0; min-width: 0; }
.cstep__legend { font-family: var(--serif); font-weight: 600; font-size: 20px; padding: 0; margin-bottom: 4px; }
.cstep__legend:focus { outline: none; }
.cstep__nav { display: flex; gap: 12px; margin-top: 28px; }
.cstep__nav .btn--primary { flex: 1; }
.cstep__nav .btn--back { flex: none; min-width: 96px; }
.field--stack { grid-template-columns: 1fr; gap: 10px; padding: 20px 0; }
.field--stack .field__label { padding-top: 0; }
.choices--grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.choices--grid .choice span { width: 100%; min-height: 54px; font-weight: 700; }
.contact-pair { display: grid; gap: 6px; }
.sublabel { font-size: 13.5px; color: var(--ink-2); margin-top: 6px; }
.hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
.form-privacy { font-size: 13px; color: var(--muted); margin: 18px 0 0; }
.draft-note { font-size: 13.5px; color: var(--green); margin: 0 0 12px; display: flex; flex-wrap: wrap; gap: 4px 12px; align-items: center; }
.draft-note[hidden] { display: none; }
.case .form-status { margin-bottom: 16px; }

.case-done { text-align: center; padding: 24px 8px; }
.case-done:focus { outline: none; }
.case-done__label { font-family: var(--serif); font-size: 22px; font-weight: 600; margin: 0 0 18px; color: var(--green); }
.case-done.is-demo .case-done__label { color: var(--ink); }
.case-done__text { font-size: 15px; color: var(--ink-2); max-width: 30em; margin: 0 auto 22px; }
.case-done__ref { display: inline-flex; flex-wrap: wrap; align-items: baseline; justify-content: center; gap: 4px 12px; margin: 0 0 26px; padding: 10px 18px; background: var(--paper); font-size: 13px; color: var(--muted); }
.case-done__id-label { letter-spacing: .1em; }
.case-done__id { font-size: 15px; font-weight: 700; color: var(--ink); letter-spacing: .06em; font-variant-numeric: tabular-nums; }
.case-done__ref .linklike { padding: 0; font-size: 13px; }
.case-done.is-demo .case-done__id { color: var(--muted); }

/* mobile sticky CTA with optional phone */
.mobile-cta--two { display: none; }
@media (max-width: 767px) {
  .mobile-cta--two { display: grid; grid-template-columns: auto 1fr; gap: 8px; }
  body { padding-bottom: 0; }
  .site-footer { padding-bottom: 96px; }
}
.site-footer__tel a { color: #fff; }
.menu-btn { flex: none; }
.logo { min-width: 0; }
@media (max-width: 430px) {
  .logo__name { font-size: 18px; letter-spacing: .06em; }
  .logo__sub { font-size: 9px; letter-spacing: .08em; }
  .logo__mark { width: 32px; height: 32px; }
  .logo { gap: 8px; }
}
@media (max-width: 360px) { .logo__sub { display: none; } }
.site-footer__cta { margin-top: 24px; display: grid; justify-items: start; gap: 6px; }
.site-footer__cta p { margin: 0; font-size: 12.5px; color: var(--footer-muted); }
@media (max-width: 767px) { .site-footer__cta { justify-items: stretch; } .site-footer__cta .btn { width: 100%; } }

/* ---------- 愛媛修繕デスク：ネイビー・白系 ---------- */
.theme-repair {
  --ink: #1d2633;
  --ink-2: #414d5c;
  --muted: #677385;
  --line: #d3d9e1;
  --line-2: #e6eaf0;
  --paper: #f1f4f8;
  --paper-2: #e5eaf1;
  --green: #17283f;
  --green-2: #27466d;
  --green-soft: #e3e9f2;
  --accent: #2b5d9b;
  --accent-dark: #1f4675;
  --accent-soft: #e5edf7;
  --shade: 13 22 36;
  --shade-2: 16 30 50;
  --hi: #9fc1ea;
  --hi-2: #cfe0f5;
  --footer: #121c2b;
  --footer-ink: #c4ccd8;
  --footer-muted: #8e9aab;
  --footer-link: #e6ebf2;
  --footer-line: #2a3546;
  --line-strong: #a9b3c1;
}


/* ---------- 共通部品の追加分 ---------- */
.logo__door { fill: var(--logo-door, #c8662f); }
.theme-repair { --logo-door: #6f9fd8; }
.logo__sub--en { letter-spacing: .26em; }
.logo--hub .logo__name { font-size: 16px; letter-spacing: .06em; }
@media (max-width: 430px) { .logo--hub .logo__name { font-size: 12px; letter-spacing: 0; } .logo--hub .logo__sub { display: none; } }
.site-footer__op { display: grid; grid-template-columns: auto 1fr; gap: 2px 14px; margin: 20px 0 0; font-size: 13px; }
.site-footer__op dt { color: var(--footer-muted); }
.site-footer__op dd { margin: 0; }
.site-footer__op a { color: var(--footer-link); }
.overlap__msg { font-family: var(--serif); font-size: clamp(17px, 1.6vw, 20px); font-weight: 600; line-height: 1.8; color: var(--ink) !important; padding-left: 14px; border-left: 3px solid var(--accent); }

/* ---------- 分岐ページ（/） ---------- */
.hub { background: var(--paper); padding: 80px 0 96px; }
.hub__eyebrow { margin: 0 0 8px; font-size: 14px; letter-spacing: .14em; color: var(--accent-dark); font-weight: 700; }
.hub__title { font-family: var(--serif); font-size: clamp(30px, 4vw, 46px); }
.hub__lead { margin: 16px 0 44px; color: var(--ink-2); max-width: 40em; }
.hub__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px; }
.hub-card { display: grid; grid-template-rows: auto auto auto 1fr auto; background: #fff; color: var(--ink); text-decoration: none; border-top: 4px solid var(--hub-c); box-shadow: 0 0 0 1px var(--line-2); transition: box-shadow .2s; }
.hub-card:hover { color: var(--ink); box-shadow: 0 0 0 1px var(--hub-c), 0 12px 32px rgb(0 0 0 / .08); }
.hub-card--repair { --hub-c: #2b5d9b; }
.hub-card--sale { --hub-c: #b0521e; }
.hub-card__photo { aspect-ratio: 16 / 9; }
.hub-card__for { display: block; margin: 26px 30px 0; font-size: 13.5px; font-weight: 700; letter-spacing: .06em; color: var(--hub-c); }
.hub-card__name { margin: 6px 30px 0; font-family: var(--serif); font-size: clamp(24px, 2.4vw, 30px); }
.hub-card__text { margin: 12px 30px 0; color: var(--ink-2); font-size: 15px; }
.hub-card__go { margin: 22px 30px 30px; justify-self: start; font-weight: 700; font-size: 15px; padding-bottom: 4px; border-bottom: 2px solid var(--hub-c); }
.hub-card__go::after { content: " →"; color: var(--hub-c); }
.hub__note { margin: 28px 0 0; font-size: 13px; color: var(--muted); }
@media (max-width: 767px) {
  .hub { padding: 44px 0 64px; }
  .hub__grid { grid-template-columns: 1fr; gap: 20px; }
  .hub-card__for, .hub-card__name, .hub-card__text { margin-left: 20px; margin-right: 20px; }
  .hub-card__go { margin: 18px 20px 24px; }
}
@media (max-width: 767px) {
  .hero__sub { display: flex; flex-wrap: wrap; justify-content: center; gap: 2px 14px; }
  .hero__sub .sub-sep { display: none; }
}

```


---

# 写真の出典データ

## ファイル：src/assets/photos/photos.json

```json
{
 "cta": {
  "lw": 1600,
  "lh": 1200,
  "sw": 800,
  "source": "pexels",
  "page": "https://www.pexels.com/photo/8082324/",
  "creator": "Pexels（撮影者名の表示は任意）",
  "license": "Pexels License",
  "licenseUrl": "https://www.pexels.com/license/",
  "title": "Bright empty attic room"
 },
 "washitsu": {
  "lw": 913,
  "lh": 685,
  "sw": 800,
  "source": "flickr",
  "page": "https://www.flickr.com/photos/9160678@N06/4202082712",
  "creator": "scarletgreen",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
  "title": "House in Kita-ku 08"
 },
 "akiya_garden": {
  "lw": 906,
  "lh": 680,
  "sw": 800,
  "source": "flickr",
  "page": "https://www.flickr.com/photos/152342724@N04/29228918358",
  "creator": "GEEK KAZU",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
  "title": "空き家バンク 唐津 七山 (1)"
 },
 "akiya_ext": {
  "lw": 910,
  "lh": 683,
  "sw": 800,
  "source": "flickr",
  "page": "https://www.flickr.com/photos/152342724@N04/42382961554",
  "creator": "GEEK KAZU",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
  "title": "空き家バンク 唐津 七山 (2)"
 },
 "akiya_kitchen": {
  "lw": 904,
  "lh": 678,
  "sw": 800,
  "source": "flickr",
  "page": "https://www.flickr.com/photos/152342724@N04/29228917858",
  "creator": "GEEK KAZU",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
  "title": "空き家バンク 唐津 七山 (5)"
 },
 "hero": {
  "lw": 913,
  "lh": 685,
  "sw": 800,
  "source": "flickr",
  "page": "https://www.flickr.com/photos/9160678@N06/4201330141",
  "creator": "scarletgreen",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
  "title": "House in Kita-ku 16"
 },
 "kitaroom": {
  "lw": 913,
  "lh": 685,
  "sw": 800,
  "source": "flickr",
  "page": "https://www.flickr.com/photos/9160678@N06/4202082386",
  "creator": "scarletgreen",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
  "title": "House in Kita-ku 01"
 },
 "wall": {
  "lw": 1022,
  "lh": 767,
  "sw": 800,
  "source": "flickr",
  "page": "https://www.flickr.com/photos/36824782@N00/120869477",
  "creator": "Qole Pejorian",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
  "title": "Baby Room, sanded walls"
 },
 "building": {
  "lw": 1600,
  "lh": 1200,
  "sw": 800,
  "source": "flickr",
  "page": "https://www.flickr.com/photos/72396314@N00/1412767312",
  "creator": "OiMax",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
  "title": "apartment"
 },
 "apartments": {
  "lw": 1600,
  "lh": 1200,
  "sw": 800,
  "source": "flickr",
  "page": "https://www.flickr.com/photos/76758469@N00/3820595970",
  "creator": "Yuya Tamai",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
  "title": "集合住宅 apartment buildings"
 },
 "shop": {
  "lw": 1536,
  "lh": 1152,
  "sw": 800,
  "source": "flickr",
  "page": "https://www.flickr.com/photos/91873384@N04/54379225600",
  "creator": "dalecruse",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
  "title": "Timeless Streets of Kanazawa"
 },
 "shop2": {
  "lw": 1600,
  "lh": 1200,
  "sw": 800,
  "source": "flickr",
  "page": "https://www.flickr.com/photos/42033648@N00/236658788",
  "creator": "PhillipC",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
  "title": "Interior, Cafe Makara, Wellington, New Zealand"
 },
 "kitchen": {
  "lw": 913,
  "lh": 685,
  "sw": 800,
  "source": "flickr",
  "page": "https://www.flickr.com/photos/9160678@N06/4201328535",
  "creator": "scarletgreen",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
  "title": "House in Kita-ku 02"
 },
 "tatami": {
  "lw": 1600,
  "lh": 1200,
  "sw": 800,
  "source": "flickr",
  "page": "https://www.flickr.com/photos/82365211@N00/5953281164",
  "creator": "kalleboo",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
  "title": "Apartment tatami room"
 },
 "washitsu2": {
  "lw": 1600,
  "lh": 1200,
  "sw": 800,
  "source": "flickr",
  "page": "https://www.flickr.com/photos/13910409@N05/2886383047",
  "creator": "TANAKA Juuyoh (田中十洋)",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
  "title": "Japanese house traditional style interior design / 和室(わしつ)の内装(ないそう)"
 },
 "fusuma": {
  "lw": 913,
  "lh": 685,
  "sw": 800,
  "source": "flickr",
  "page": "https://www.flickr.com/photos/9160678@N06/4202084114",
  "creator": "scarletgreen",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
  "title": "House in Kita-ku 13"
 },
 "vacant": {
  "lw": 1600,
  "lh": 1200,
  "sw": 800,
  "source": "flickr",
  "page": "https://www.flickr.com/photos/199901739@N04/54281560155",
  "creator": "incorrectsummary",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
  "title": "空室"
 }
}

```
