# GPT（ChatGPT 等）でのレビュー手順

このサイトを、制作者とは別の AI に精査してもらうための手順です。

## 方法A：ファイルを添付する（確実）

1. 次のファイルをダウンロードします。
   - レビュー用バンドル（ドキュメント・全ソース・最新監査を1ファイルに集約）
     https://raw.githubusercontent.com/luckys4900/ehime-shuzen-desk/main/docs/gpt-review/review-bundle.md
   - 必要に応じてスクリーンショット（`docs/screenshots/` の PNG）
2. ChatGPT にファイルを添付し、下の「依頼文」を貼り付けて送信します。

## 方法B：URLを渡す（ブラウズ機能がある場合）

下の「依頼文」の先頭に次の1行を加えて送信します。

```
次のURLの内容を読み込んでからレビューしてください：https://raw.githubusercontent.com/luckys4900/ehime-shuzen-desk/main/docs/gpt-review/review-bundle.md
公開サイト：https://luckys4900.github.io/ehime-shuzen-desk/
```

## 依頼文（コピーして使用）

```
あなたは、日本の BtoB 建物修繕サービスのWebサイトを審査する独立レビュアーです。
添付（またはURL）の「愛媛修繕デスク」営業提案用サイトのバンドルを読み、以下の観点で厳しく精査してください。

前提
- 松山市周辺の管理会社・買取再販事業者・店舗施設運営者向けの「第二施工店（もう一つの修繕窓口）」の提案用モックアップです。
- 事実確認ができない実績・顧客・レビュー・件数・資格・許認可・沿革・スタッフ・拠点・対応スピード・保証・24時間対応は掲載しない方針です（真実性ポリシー）。
- 写真は商用利用可のライセンス素材で、「写真はイメージです」と表示しています。電話番号は未確定のため掲載していません。

観点と配点（合計100点）
1. Visual（20）：中堅施工会社が制作会社に依頼した水準か。テンプレート感・不要な装飾はないか
2. Reference Fidelity（15）：参照サイト分析（reference-freeze）の構造原則を反映しているか
3. Conversion（20）：相談フォームまでの導線、フォームの使いやすさ、離脱要因
4. Credibility（15）：誇張・誤認表現がないか、法人顧客が知りたい情報が足りているか
5. Mobile（15）：スマートフォンでの読みやすさ・操作性
6. Technical（10）：HTML/CSS/JS の品質、アクセシビリティ、フォームのエッジケース
7. Copy（5）：日本語として自然か、約束と読める表現がないか

出力形式
- 観点ごとの点数と理由
- HARD_FAIL（真実性ポリシー違反、資格が必要な工事を無資格で受けられると誤認させる記述、プレースホルダ等）の有無と根拠（ファイル名・該当箇所）
- 優先度順の改善提案（どのファイルのどこを、どう変えるか）
- 事業者に確認すべき事項

社内の独立監査（13回）では 99/100 でした。その結果に引きずられず、独自の視点で評価してください。
```

## 参考リンク

- リポジトリ：https://github.com/luckys4900/ehime-shuzen-desk
- 最終監査：https://github.com/luckys4900/ehime-shuzen-desk/blob/main/docs/audit-final.md
- 事業者確認事項：https://github.com/luckys4900/ehime-shuzen-desk/blob/main/docs/business-assumptions.md
