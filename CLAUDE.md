# IONIC PRO Web — コーディングガイド

Figmaデザイン（IONIC PRO Web）をHTML/CSS/バニラJSで実装するプロジェクト。
このファイルは毎回読み込まれるため、簡潔さを優先し「なぜそうするか」だけ書く。

## 技術スタック

- 使うもの: HTML5 / CSS3（カスタムプロパティ, Flexbox, Grid）/ バニラJS（ES2015+）
- 使わないもの: React/Vue等のフレームワーク, Sass等のプリプロセッサ, webpack/vite等のビルドツール, Bootstrap/Tailwind等のCSSフレームワーク
- 理由: 引き継ぎ相手の学習コストを下げ、依存の陳腐化・ビルド環境差異による不具合を避けるため。静的なLPであり、ビルドが必要な規模ではない。

## ファイル構成

```
.
├── CLAUDE.md
├── index.html          # 全セクションを1ページに実装
├── styles/
│   ├── _tokens.css     # :root カスタムプロパティのみ（値の直書き禁止）
│   └── style.css        # 実際のレイアウト・装飾（BEMクラスに対して記述）
├── js/
│   └── main.js          # ハンバーガーメニューの開閉など、DOM操作
└── images/               # 画像プレースホルダの置き場（実ファイルは後日差し替え）
```

- `_tokens.css` と `style.css` を分けるのは、値（何色・何px）と実装（どこに使うか）の関心を分離し、Figma側の値更新時に`_tokens.css`だけ触れば済むようにするため。
- JSは`main.js`1本に集約。ページ規模的に分割の必要なし（3以上の独立機能ができたら分割を検討）。

## 命名規則

- **クラス名**: BEM（`block__element--modifier`）。Blockはセクション単位（`header`, `fv`, `hamburger-menu`, `cta-button`など）。Figmaのレイヤー名（日本語・England混在）はそのまま使わず、内容を表す英語に翻訳する。
- **CSS変数**: `--color-*`, `--font-*`, `--space-*`, `--bp-*` のようにカテゴリプレフィックスを付けたkebab-case。Figma変数名（例: `text-color01`）は意味が取りづらいため`--color-text-01`のように整形して踏襲する。対応関係は下記「Figmaとの対応」参照。
- **画像ファイル名**: 内容を表す英語kebab-case（例: `logo-lumia.svg`, `icon-hamburger.svg`, `hero-model.jpg`）。「ChatGPT Image 2026...」のような無意味なレイヤー名は使わない。

## CSS設計

- 変数は`_tokens.css`の`:root`にのみ定義し、`style.css`側では`var(--...)`経由でのみ参照する。**色・フォントサイズ・font-familyの直書きは禁止**（Figmaに存在しない値を使う一時的な調整も、まず変数化してから使う）。
- プロパティ記述順: レイアウト（display/position/flex等）→ ボックスモデル（width/margin/padding）→ 装飾（background/border/box-shadow）→ タイポグラフィ（font/color/line-height）→ その他（transition/cursor）。理由: 差分レビュー時に「何が変わったか」を見つけやすくするため。
- 禁止事項: `!important`、インラインstyle属性、ID セレクタでのスタイリング、`!important`を要求するような詳細度の競合を生む多重ネスト。
- メディアクエリは **SPカンプ（393px）を基準値**とし、`min-width: 768px`で拡張していく（モバイルファーストと同方向）。理由: SP・PC双方に実カンプがあるため、狭い方を基準に「足りない分を足す」書き方の方が差分が追いやすい。

## ブレイクポイント

| 範囲 | 振る舞い |
|---|---|
| 〜767px | SPカンプ（393px）準拠の固定値ベース実装 |
| 768〜1279px | タブレット用カンプは存在しないため、**PCカンプをそのまま流体（%, vw, clamp()等）で縮小**する。この帯域だけの新規レイアウトは発明しない |
| 1280px〜 | PCカンプ（1440px）準拠。コンテンツは`max-width: 1440px`で中央寄せし、それ以上は余白が広がる |

## アクセシビリティ

- `alt`: 装飾目的の画像（背景・質感グラフィック等）は`alt=""`。内容を伝える画像は具体的なaltを入れる。レイヤー名が`Image (説明文)`形式ならその説明文をそのまま採用し、`ChatGPT Image ...`のように内容を表さない名前は周辺テキストから内容を推測して記述する。
- 見出し階層: 各セクションで`h1`（FVのIONIC PROロゴ相当の主見出し）→`h2`（各セクションタイトル）→`h3`（カード見出し等）の順序を飛ばさない。装飾テキスト（`SECTION`ラベル等）は見出しにしない。
- フォーカス: `outline`を除去しない。独自スタイルを当てる場合は`:focus-visible`で定義し、キーボード操作時の視認性を確保する。
- ハンバーガーメニュー: 開閉トリガーは`<button>`要素とし、`aria-expanded`（開閉状態）・`aria-controls`（対象メニューのid）・`aria-label`（「メニューを開く/閉じる」）を付与する。開いた状態ではメニュー内にフォーカスをトラップしない簡易実装で可（LP規模のため）。

## Figmaとの対応

File: https://www.figma.com/design/K29sQ2wLh7hYgJdF7lDPum/IONIC-PRO-Web

| セクション | node-id | 備考 |
|---|---|---|
| PC全体（1440px） | 1-20 | Header (1-22) + FV (1-32) を含む |
| SP全体（393px） | 1-387 | フレーム自体にはHeaderを含まない点に注意 |
| SP 固定ヘッダー | 1-753 | ページ最上位の別フレーム。`position: sticky`で実装 |
| SP 固定CTAバー | 1-751 | FV下部（y=570）に重なる固定バー。`position: fixed`で実装 |
| ハンバーガーメニュー（開いた状態） | 1-835 | オーバーレイ全体。ナビ項目6つ + CTA |
| CTAボタン（通常/hover） | 1-924 | `prop1: cta / cta_hover` の2状態 |

- Futuraフォント（FVの「IONIC PRO」ロゴ文字）は無料Webフォントとして配布されていないため、`Jost`（Google Fonts）で代替する。`--font-logo`変数にコメントで代替である旨を記載する。
- 装飾的な質感画像（レイヤー名が`ChatGPT Image ...`のもの）は原則`alt=""`。人物写真のみ周辺文脈から具体的なaltを付与する。
