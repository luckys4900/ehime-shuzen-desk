# 評価ハーネス（harness）

## 実装進捗（implementation_percent）

| 区分 | 配点 | 判定基準 |
|---|---|---|
| Routes | 20 | 6ルート（/ /kanri /kaitori /shop /partner /contact）が200で表示される |
| Components | 10 | ヘッダー・フッター・CTA・FAQ・フロー等の共通部品 |
| Content | 15 | 要件の全セクション、捏造なしの本文 |
| Responsive | 15 | 390/430/768/1024/1440 で横スクロールなし |
| Nav-CTA | 10 | グローバルナビ・モバイルナビ・各CTAが機能 |
| Contact | 10 | 必須項目・バリデーション・写真UI・送信分離 |
| Tech | 10 | meta/OGP/favicon/sitemap/robots/404/a11y |
| Deploy | 10 | 公開URLで表示・検証済み |

SITE_IMPLEMENTATION_70 = 上記合計 70 以上。

## 品質スコア（Harness Score）

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

## HARD_FAIL 条件

- 架空の実績・顧客・レビュー・件数・資格・許認可・沿革・スタッフ・拠点・対応スピード・保証・24時間対応の掲載
- 資格が必要な工事を、無資格でも受注・施工できると誤認させる記述
- プレースホルダ・ダミー情報（架空の電話番号等）
- 必須ルートの404、横スクロール、フォームが機能しない

## 検証方法

- 自動：`scripts/qa.mjs`（Playwright。全ルート×5幅の横はみ出し、コンソールエラー、リンク切れ、alt・ラベル、meta、h1、タップ領域、ダミー文字列、モバイルナビ、Escキー、フォーム検証、写真の形式チェック、送信分離、スキップリンク、404）
- 独立監査：制作に関与していない Claude subagent が REJECT 権限付きで採点（`audit-round*.md`、最終結果は `audit-final.md`）
- 公開URL：GitHub Actions の `verify` ジョブで同じQAを公開URLに対して実行
