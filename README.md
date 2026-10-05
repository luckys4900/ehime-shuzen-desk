# 愛媛修繕デスク（営業提案用モックアップ）

愛媛県松山市周辺の法人向け建物修繕受付サービス（第二施工店）の、営業提案用サンプルサイトです。

- 公開URL：https://luckys4900.github.io/ehime-shuzen-desk/
- ページ：トップ / 管理会社様 / 買取再販事業者様 / 店舗・施設運営者様 / 協力会社募集 / 写真を送って相談する（フォーム） / 個人情報の取扱い / 写真クレジット
- 依存パッケージなしの静的サイト。`node build.mjs` で `dist/` を生成し、GitHub Actions で GitHub Pages に公開します。

## ドキュメント

| ファイル | 内容 |
|---|---|
| `docs/reference-analysis.md` / `docs/reference-freeze.md` | 参照サイトの分析と、採用した構造原則（凍結版） |
| `docs/business-assumptions.md` | 事業者に確認が必要な前提・文言 |
| `docs/harness.md` | 評価ハーネス（配点・HARD_FAIL 条件・検証方法） |
| `docs/audit-round*.md` / `docs/audit-final.md` | 独立監査の記録と最終結果 |
| `docs/known-limitations.md` | 既知の制約 |
| `docs/deployment.md` | ビルド・公開・写真差し替えの手順 |
| `docs/screenshots/` | 主要ページのスクリーンショット |

## よく使うコマンド

```bash
node build.mjs                 # dist/ を生成（デモ：noindex）
node scripts/serve.mjs         # http://localhost:4173/ehime-shuzen-desk/
node scripts/qa.mjs            # ブラウザQA（全ルート × 5幅）
node scripts/make-images.mjs   # OGP画像を再生成
```
