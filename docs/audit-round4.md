# 監査レポート Round 4 — 愛媛修繕デスク 営業提案モック（v2.2）

- 監査日: 2026-10-05
- 監査者: 独立監査（制作に関与していない立場、REJECT 権限あり）
- 対象コミット: `a779daa Record form required-field decision; docs`（`5ee55d6`、`fea896a` を含む）
- 実施した検証:
  - `git diff 0503a3a HEAD` で `build.mjs`、`scripts/qa.mjs`、`scripts/photo-fetch.mjs`、`style.css`、各ページ、`photos.json`、`photo-picks.txt`、docs の変更を全件確認した。
  - `node build.mjs` は 8 ページと 404 を生成した。`node scripts/qa.mjs` は 58 checks で失敗 0。
    - QA を実行すると、追跡対象の `docs/screenshots/*.png` と `harness/qa-result.json` が書き換わる。監査後に `git checkout` で元に戻した。
  - 自前の計測スクリプトで、全 8 ルートを 390 / 430 / 768 / 1024 / 1240 / 1440 で描画した。計測した項目は次のとおり。
    - 横スクロール
    - コンソールエラー
    - ページ高さ
    - h1〜h3、summary、th、本文の p と li の行ごとの文字数（Range API）
    - 画像の表示倍率
  - 新しい写真 5 点の原画像と、Openverse の取得メタデータ（`scratchpad/ph5/cand/meta.json`）を照合した。
    - scarletgreen の 4 点は原寸 1024×685。
    - tools は Flickr の大きいサイズから再取得されている。
  - ヒーローの鮮明さを、1440px・DPR2 と 390px・DPR3 で撮影して確認した。
  - 次の箇所を要素ごとに撮影した。
    - TOP: CONCEPT、業種別タイル
    - kanri / kaitori: needs
    - kaitori: ヒーロー
    - partner: ヒーロー（1440 / 390）
    - shop / kaitori: FAQ
    - credits
  - `src/assets/og.png` を目視し、git の履歴も確認した。
  - 真実性に関わる語を全ソースで grep した。

---

## 判定: **PASS（合格）**

| 区分 | 配点 | 最低点 | R1 | R2 | R3 | **R4** |
|---|---|---|---|---|---|---|
| Visual | 20 | 15 | 15 | 16 | 17 | **18** |
| RefFidelity | 15 | – | 11 | 13 | 14 | **15** |
| Conversion | 20 | 15 | 15 | 16 | 17 | **18** |
| Credibility | 15 | – | 10 | 12 | 13 | **13** |
| Mobile | 15 | 12 | 12 | 11 | 13 | **13** |
| Technical | 10 | 8 | 8 | 8 | 9 | **9** |
| Copy | 5 | – | 4 | 4 | 4 | **4** |
| **合計** | **100** | | 75 | 80 | 87 | **90** |

- 合格条件（合計 80 以上、全最低点クリア、HARD_FAIL = 0）をすべて満たしている。
- Round 3 の P0〜P2 は、ほぼすべて対応された。最大の減点要因だった TOP ヒーロー、partner、kanri「入居中」の写真は、国内の写真で文脈にも合うものになった。
- **新たな不備が 1 件ある（P0）。OGP 画像 `src/assets/og.png` が再生成されていない。**
  - og.png にはまだ旧ヒーロー（Pexels 3284980、米国住宅の空室）が写っている。
  - 一方で credits は「scarletgreen『House in Kita-ku 16』を SNS 共有用画像（OGP）に使用」と記載している。
  - その結果、credits の記載が事実と違い、実際に OGP に使っている写真は credits に載っていない。
  - Pexels License は表示が任意なので、ライセンス違反ではない。しかし、Round 3 で直したはずの「クレジットの使用箇所の誤り」と同じ種類の問題が再発している。

---

## HARD_FAIL 一覧

**該当なし（0 件）**

- **捏造**: grep でヒットしたのは `shop.html:39`「拠点」（顧客側の複数拠点の話）、「資格・許可」（注意書きの中だけ）、「改装後」（alt 2 件、後述）のみ。実績・件数・顧客・レビュー・沿革・スタッフ・対応速度・保証・24時間の記述はない。
- **有資格工事**: `partner.html:54-55` の各行の注記と `:59-60` の宣言は維持されている。ヒーロー写真は、ヘルメット姿の設備工事から古い大工道具に変わり、有資格工事の募集と誤読される余地はなくなった。
- **ダミー情報・プレースホルダー**: なし（QA の placeholder 検出は 0）。運営者情報は「本番公開時に掲載」と明記されている。
- **写真の表示**: 写真付きのすべての箇所に「写真はイメージです」がある。credits の注記に「愛媛修繕デスクの施工事例ではありません」が加わった。
- **alt**: 新しい写真の alt 5 件は、写っている内容と合っている。
  - ただし `index.html:2` と `kaitori.html:33` の「改装後の」は、出典から確認できない。
  - Flickr のタイトルは「House in Kita-ku」で、検索語「リフォーム」でヒットした写真ではある。
  - 虚偽とまでは言えないので HARD_FAIL にはしないが、確認できない限定語は外すべき（P1-3）。

---

## Round 3 指摘事項の対応状況

| # | Round 3 の指摘 | 状況 | 確認箇所・備考 |
|---|---|---|---|
| P0-1 | shop・kaitori の FAQ 見出しの崩れ | **解消** | 3 ページとも `<p class="faq-for">…から</p><h2>よくあるご質問</h2>` に変更。`style.css` に `.faq-for` を追加。1024 / 1240 / 1440px で 1 文字だけの行がないことを実測した |
| P1-2 | クレジットの誤り（使用箇所・撮影者・作品名） | **解消（ただし OGP は新たな誤り）** | `build.mjs` の `photoUsage()` がテンプレートから使用箇所を自動生成し、未使用の写真を除外する。Pexels の撮影者欄は「Pexels 投稿者（…任意）」、作品名は「Pexels 写真 ID …（タイトルは出典ページを参照）」になった。ただし「SNS共有用画像（OGP）」の記載は事実と違う（og.png は旧写真のまま） |
| P1-3 | credits の字下げ | 解消 | `.doc .credits { padding-left:0 }`。390 / 1440px で左端がそろっていることを確認 |
| P1-4 | partner のヒーロー写真 | **解消** | `tools`（古いのみ・鉋の刃。刻印から国内の道具と分かる）に変更。誤読の余地はなくなった。ただし錆びた道具の山なので「放置・廃品」の印象もある（P2-9） |
| P1-5 | kanri「入居中」の写真 | **解消** | `fusuma`（引戸・建具）。建具の開閉という本文と合う |
| P1-6 | TOP ヒーローの写真 | **解消（鮮明さに課題）** | 国内の住宅の室内（無垢床・板張りの壁）。1440px・DPR1 では問題ない。DPR2 では約 2.8 倍に拡大され、木目に JPEG のブロックノイズが見える。390px では縦長に切り抜かれ、ぼけた茶色の壁しか写らない（P1-4） |
| P2-7 | 物件種別・希望時期の逃げ道 | 確認済み | 変更なし（対応不要） |
| P2-8 | タイルの英字ラベルのコントラスト | 解消 | `rgba(255,255,255,.88)` と text-shadow を設定し、オーバーレイも強めた。1440px で読めることを確認 |
| P2-9 | freeze との食い違いの記録 | 解消 | `reference-freeze.md:75` に決定事項を追記し、`business-assumptions.md §4` を追加 |
| P2-10 | 本文・表の泣き別れ | **一部** | エリア表とフッターは `.nw` と `keep-all` で解消した。FLOW 05 は解消した。本文の li の末尾 1 文字は次の 5 か所に残っている（P2-6） |
| | | | kanri `:84`「くださ／い」（1440） |
| | | | kanri `:80`「な／ど」（1024） |
| | | | shop `:64`「要／否」（390・1024） |
| | | | shop `:65`「範／囲」（390・1024） |
| | | | contact `:155`「しま／す」（430） |
| P2-11 | QA をデスクトップに拡大 | 解消 | `orphanLines` を全幅の h1/h2 に適用。ただし h3・summary・本文は対象外 |
| P2-12 | CSS の追記ブロックの統合 | 解消 | 末尾のブロックを削除し、各セクションに移した。`.crumbs a` だけ、同じセレクタが 2 行に分かれている（`style.css` 352-353 付近） |
| P2-13 | kaitori の SCENE の片側だけの写真 | 解消 | `kitchen` のカードを追加し、写真付きのカードが 2 枚になった |
| P2-14 | TOP の SP の長さ | **未達** | 390px で 13,984 → 14,010px（わずかに増えた）。problems と svc の余白を詰めたが、セクションが増えた分と相殺した |
| P2-15 | credits のリンクのタップ高 | 解消 | `.credit a { padding:10px 0; margin:-10px 0 }` |

**15 項目中、解消 12 件、一部対応 1 件、未達 1 件、確認のみ 1 件。** 新たな不備は 1 件（OGP 画像）。

---

## カテゴリ別の評価理由

### Visual 18 / 20（+1）
- 良くなった点:
  - TOP ヒーローと CONCEPT（和室・障子）が国内の写真になり、第一印象が「日本の物件の窓口」に変わった。1440px のファーストビューは、イズミ装美（ref 01）の写真主導の構成と同じ水準にある。
  - kanri の needs は 3 枚とも国内らしい写真（洋室、引戸、団地）になった。kaitori の SCENE は 2 枚の写真で構成が整った。
  - タイルのラベルが読めるようになった。
- 減点理由:
  - **ヒーローの鮮明さ**: 原画像は 1024×685 で、4:3 に切り抜くために約 1.12 倍に拡大されている。1440px・DPR2 では約 2.8 倍の表示になり、文字のエッジとの差でぼけが目立つ。暗いオーバーレイである程度は隠れるが、Retina の MacBook で見る商談相手には分かる。
  - **390px のヒーロー**: `object-position: 60% 50%` で縦に切り抜かれ、板張りの壁だけが写る。何の写真か分からない。
  - **Pexels の `room` が残っている**: 欧州式の窓・ラジエーター・グレーの壁の部屋を、kaitori のヒーロー、TOP の買取再販タイル、kanri「退去後」の 3 か所で使い回している。kaitori はページの顔なので影響が大きい。国内の `kitchen`、`hero` 系の写真がすでにあるのに使っていない。
  - partner の錆びた道具の山は、国内の道具ではあるが「廃品」の印象もある。協力会社を募るページの顔としては少し暗い。

### RefFidelity 15 / 15（+1）
- freeze 文書と実装の食い違いが、決定記録として解消された。TOP の必須構造、FLOW の 7 段、エリア、今治の扱い、対応外の事前表示、法人専用の明示をすべて維持している。この区分には、制約の範囲で直せる点が残っていない。

### Conversion 18 / 20（+1）
- 良い点:
  - FAQ 見出しが「〇〇様から／よくあるご質問」の 2 段になり、ページの対象が一目で分かる。
  - SP の固定 CTA の出し入れ、`?type=` による区分の自動選択、エラー要約は、引き続き正しく動く。partner の 390px の初期表示で、固定バーが重複しないことも確認した。
- 減点理由:
  - 電話 CTA がない（制約として受け入れ済み。減点は軽い）。
  - **SNS で共有したときの OGP 画像が、サイト本体と違う米国住宅の写真**。営業提案で URL を共有したとき、最初に見えるのはこの画像になる。

### Credibility 13 / 15（±0。改善 +1、新たな誤り −1）
- 良い点:
  - credits が使用状況から自動生成されるようになった。Pexels の撮影者欄と作品名の表記が正確になった。「施工事例ではありません」の明記が加わった。
  - partner の有資格工事との誤読の余地がなくなった。
- 減点理由:
  - **OGP の記載が事実と違う**: credits は hero を「SNS共有用画像（OGP）」と記載しているが、og.png は旧 Pexels 写真のまま。実際に使っている写真が credits に載っていない。Round 3 の P1-2 と同じ種類の誤り。
  - alt の「改装後の」2 件は、出典で確認できない（`index.html:2`、`kaitori.html:33`）。
  - 地域の窓口でありながら、ページの顔の一つ（kaitori）が欧州風の部屋。

### Mobile 13 / 15（±0）
- 良い点: 全ルート・全幅で横スクロール 0、コンソールエラー 0。見出しの 1 文字だけの行は 0。credits・パンくず・同意欄のタップ領域が改善した。エリア表の泣き別れは解消した。
- 減点理由:
  - TOP は 14,010px（390px）で、短くなっていない。
  - 390px のヒーロー写真が茶色の壁だけで、意味を持たない（Visual でも指摘）。
  - 本文の li で、末尾 1 文字だけの行が 390 / 430px に 3 か所ある（shop×2、contact×1）。

### Technical 9 / 10（±0）
- 良い点:
  - `photoUsage()` が使用箇所を自動生成するようになり、クレジットの手作業での同期が不要になった。
  - CSS の後付けブロックを解消した。QA の `orphanLines` を全幅に適用した。
  - `photo-fetch.mjs` が Flickr の `_k` / `_h` サイズを探すようになり、building、apartments、shop、shop2、office、tools が 1600px になった。
- 減点理由:
  - **派生物の生成漏れ**: `make-images.mjs` が再実行されておらず、og.png が古い。また、`creditsHtml()` は `name === 'hero'` で OGP の使用を決め打ちしており、og.png の実体と照合していない。
  - `photos.json` の `usedOn` と、`photo-picks.txt` の 10 列目が、もう使われていないのに残っている。新しい写真の値は空で、`room`・`wall` の値は事実と違う。誤解のもとになるデータ。
  - 1024px の原画像を 1024×768 に拡大して出力している（`-resize WxH^` で、原寸より大きくしない処理がない）。
  - `qa.mjs` を実行するたびに、追跡対象の `docs/screenshots/` と `harness/qa-result.json` が書き換わり、作業ツリーが汚れる。

### Copy 4 / 5（±0）
- FAQ 見出しは自然になった。誇張はなく、文言の統一も保たれている。
- 減点理由: 本文 li の末尾 1 文字（「くださ／い」「範／囲」「要／否」「しま／す」「な／ど」）。「改装後の」という確認できない限定語。

---

## 優先度付きの残りの修正（100 点にするため）

### P0（提案前に必ず直す）
1. **OGP 画像を再生成する**
   - `node scripts/make-images.mjs` を実行し、`src/assets/og.png` を現在の `hero-l.jpg` から作り直して、コミットする。
   - 再発防止として、`build.mjs` で og.png の更新日時が `src/assets/photos/hero-l.jpg` より古ければ警告を出すか、ビルドを失敗にする。例:
     `if (statSync('src/assets/og.png').mtimeMs < statSync('src/assets/photos/hero-l.jpg').mtimeMs) throw new Error('og.png is stale: run scripts/make-images.mjs');`
     （git checkout で mtime が当てにならない場合は、`photos.json` の hero の `page` を og 生成時に `src/assets/og.json` へ書き出して照合する。）
   - 再生成した og.png は、暗い室内の写真の上に文字が乗る。オーバーレイ（`make-images.mjs` の gradient、左端 .86）で文字が読めることを目視する。

### P1（写真・クレジットの正確さ）
2. **kaitori のヒーローを国内の写真にする**
   - `src/pages/kaitori.html:15` の `{{photo:room|…}}` を `{{photo:kitchen|木の造作キッチンと無垢材の床の室内|phero__photo|写真はイメージです|eager}}` に変える。
   - SCENE の 2 枚目（`kaitori.html:33`）は、`hero` 系以外の写真（例: scarletgreen「House in Kita-ku 11 / 09 / 07」のいずれか）を `photo-picks.txt` に追加して差し替える。
   - TOP タイルの買取再販（`index.html:170` の `room`）も、同じシリーズの写真か `fusuma` に替え、`room` を使うのは kanri の 1 か所だけにする。
3. **確認できない限定語を alt から外す**
   - `src/pages/index.html:2` は `木の壁と無垢材の床の、改装後の明るい室内` から `木の壁と無垢材の床の明るい室内` に変える。
   - `src/pages/kaitori.html:33` は `改装後のキッチンと無垢材の床` から `木の造作キッチンと無垢材の床` に変える。
4. **ヒーロー写真の見せ方（鮮明さと SP の切り抜き）**
   - `style.css` のヒーロー部に `@media (max-width: 767px) { .hero__bg img { object-position: 22% 70%; } }` を追加し、SP でキッチンの島と床が写るようにする。値は 390px で目視して調整する。
   - デスクトップでは、`.hero__bg img` に `filter: saturate(.9)` を加え、`::after` の右側の不透明度を .15 から .3 程度に上げて、拡大のぼけを目立たなくする。
   - あるいは、1600px 以上の原寸がある国内の室内写真を Openverse で探して差し替える。検索語の例: 「和室 リノベーション」「japanese apartment renovation」、size=large。
5. **credits の OGP 記載の決め打ちをやめる**
   - `build.mjs` の `creditsHtml()` にある `if (name === 'hero') where.push('SNS共有用画像（OGP）')` を、`make-images.mjs` が書き出す `src/assets/og.json`（`{ "photo": "hero" }`）を読んで判定する形に変える。

### P2（仕上げ）
6. **本文の末尾 1 文字の行**
   - `style.css` の共通部に `main li, .prep__list span, .notice p { text-wrap: pretty; }` を追加する。
   - あるいは、該当する 5 か所の末尾の語を `<span class="nw">` で囲む。
     - `kanri.html:84` の「お送りください」
     - `kanri.html:80` の「部屋番号など」
     - `shop.html:64` の「要否」
     - `shop.html:65` の「範囲」
     - `contact.html:155` の「お願いします」
   - `scripts/qa.mjs` の `orphanLines` の対象を `'h1, h2, h3, summary, main li'` に広げ、末尾の行が 1 文字のときに失敗にする。
7. **TOP の SP の長さ（14,010px → 12,500px 前後）**
   - 767px 以下で `.section` の上下余白を、現在値から 2 割ほど詰める（例: `padding: 64px 0`）。
   - FLOW の各ステップの `p` を `font-size: 14px; line-height: 1.85` にする。
   - エリアの地図（`.area__map`）を `max-height: 280px` にする。
8. **データの不整合を掃除する**
   - `src/assets/photos/photos.json` の `usedOn` フィールドと、`photo-fetch.mjs` の `usedOn` の出力を削除する。
   - `.github/reference/photo-picks.txt` のヘッダーと 10 列目（used on）を削除する。現在は `room` に存在しない使用箇所が書かれている。
   - `photo-fetch.mjs` の resize を `-resize ${w}x${h}^>` ではなく、原寸より小さいときは `lw = Math.min(1600, ow, Math.floor(oh * 4 / 3))` で拡大を避けるようにする。1024×685 の原画像なら 913×685 で出力し、`photos.json` の `lw` / `lh` も合わせる。
9. **partner のヒーロー写真の印象**
   - 錆びた道具の山を、手入れされた道具や作業中の手元の写真（CC BY、例: 「japanese carpenter plane」「鉋 大工」）に替えられれば替える。
   - 替えられない場合は、`.phero__photo img` に `filter: saturate(.85) brightness(1.05)` をかけ、錆の赤みを抑える。
10. **QA の副作用**: `scripts/qa.mjs` の `SHOT_DIR` と `qa-result.json` の出力を、環境変数（例: `QA_WRITE=1`）があるときだけ書き出すようにする。通常の実行では作業ツリーを汚さないようにする。
11. **CSS の重複**: `style.css` の `.crumbs a { color: var(--muted); }` と、その次の行の `.crumbs a { display:inline-block; … }` を 1 つのルールにまとめる。

---

## 総評
Round 3 の P0 と、写真に関する P1 の大部分が解消した。TOP・CONCEPT・kanri・partner の写真が国内の文脈になったことで、Visual と全体の説得力がはっきり上がった。合計 90 点で、最低点もすべて上回るため **合格** とする。

提案先に見せる前に、次の 3 点を直すことを強く推奨する。
- **P0-1**: OGP 画像が旧写真のままで、credits の記載とも食い違っている。
- **P1-2**: kaitori のヒーローが欧州風の部屋。
- **P1-3**: alt の「改装後」は出典で確認できない。

いずれも短時間で直せる。残りの点差は、ヒーロー写真の解像度（素材の制約）と、SP の長さ・本文の改行といった仕上げに集中している。
