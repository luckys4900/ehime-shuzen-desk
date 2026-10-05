# 営業テストの進め方（2つの事業仮説の比較）

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

## 送るURLに印を付ける（任意・推奨）

URL の末尾に `utm_*` または `ref` を付けると、そのURLから来た相談の「流入元」列に記録されます。

```
https://luckys4900.github.io/ehime-shuzen-desk/sale-support/?utm_source=mail&utm_campaign=2026-10-matsuyama&ref=company-a
https://luckys4900.github.io/ehime-shuzen-desk/repair/kanri/?utm_source=visit&utm_campaign=2026-10-kanri
```

- 記録されるのは、そのブラウザで最初に開いたURLの値です（同じタブ内でページを移動しても保持）。
- 個人名など個人情報はURLに入れないでください（会社ごとの記号程度にとどめます）。

## 比較する指標

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

## 注意

- 案件番号は2サイト共通の連番です（どちらのサイトかは番号ではなく「サービス」列で判断します）。
- 2つのサイトの本文・ヘッダー・フッターは、互いのサイトへリンクしていません（比較を混ぜないため）。両方を案内するのは分岐ページ（`/`）と共通ページ（協力事業者の募集・個人情報の取扱い・写真クレジット）だけです。
