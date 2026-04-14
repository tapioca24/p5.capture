# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git コミット

コミットメッセージは英語で記述すること。

## コマンド

```bash
pnpm build              # TypeScript コンパイル + Vite バンドル → dist/p5.capture.umd.js
pnpm format             # Prettier によるフォーマット
pnpm test:unit          # Vitest ユニットテスト（ウォッチモード）
pnpm test:unit run      # Vitest ユニットテスト（1回実行）
pnpm test:e2e           # Playwright E2E テスト（全ブラウザ）
pnpm test:e2e --project=chromium  # 特定ブラウザのみ E2E テスト
pnpm test:e2e:skipbuild # ビルドをスキップして E2E テスト
pnpm setup              # Playwright ブラウザのインストール（初回のみ）
```

## アーキテクチャ

**p5.capture** は p5.js に組み込んでキャンバスアニメーションを WebM・GIF・MP4・PNG・JPG・WebP として録画する UMD ライブラリ。

### p5.js との統合（`src/index.ts`）

エントリポイントで p5.js のバージョンに応じた方法でプラグインを登録する：

- **v2：** `p5.registerAddon()` で `postsetup` / `postdraw` ライフサイクルフックを使用
- **v1：** `p5.prototype.registerMethod()` で `init` / `post` フックを使用

### 録画のライフサイクル（`src/p5.capture.ts`）

`P5Capture` はシングルトン（`getInstance()` で取得）で録画全体を統括する：

1. ユーザーが録画開始（UI ボタンまたは `capture.start()`）
2. フォーマットに応じた `Recorder` インスタンスを生成
3. フレームごとに `postDraw()` が呼ばれ、Recorder がキャンバスをキャプチャ
4. 停止時（ユーザー操作または `duration` 上限）に Recorder がエンコード
5. `beforeDownload` コールバック実行 → エンコード済み Blob をダウンロード

グローバルデフォルトは静的メソッド `P5Capture.setDefaultOptions()` で設定できる。

### レコーダーシステム（`src/recorders/`）

- `base.ts` — 抽象基底クラス。状態管理（idle → capturing → encoding）・キャンバスリサイズ・フレームカウント・イベント発行（`start`, `stop`, `added`, `progress`, `finished`, `segmented`, `error`）を担う
- `webm-recorder.ts` — `webm-writer` ラッパー
- `gif-recorder.ts` — `gif.js` ラッパー
- `mp4-recorder.ts` — `h264-mp4-encoder` ラッパー
- `image-recorder.ts` — 静止画フォーマットの基底クラス。`fflate` で ZIP 圧縮して出力
- `png-recorder.ts`, `jpg-recorder.ts`, `webp-recorder.ts` — `ImageRecorder` を継承

### UI（`src/ui.ts`）

DOM 要素としてレンダリングされるドラッグ可能なコントロールパネル。Recorder のイベントを購読してフレームカウンタ・経過時間・エンコード進捗バーを更新する。`disableUi` オプションで無効化できる。

### テスト

- **ユニットテスト**（`tests/unit/`）— Vitest + happy-dom。個々のクラス・関数を単体でテスト
- **E2E テスト**（`tests/e2e/`）— Playwright で実ブラウザ（Chromium・Firefox・WebKit）に対して HTML フィクスチャを使って動作確認

### 主要ファイル

| ファイル                | 役割                                             |
| ----------------------- | ------------------------------------------------ |
| `src/index.ts`          | プラグインエントリポイント                       |
| `src/p5.capture.ts`     | メインシングルトンコントローラー                 |
| `src/recorders/base.ts` | 状態・イベントの共通ロジックを持つ抽象レコーダー |
| `src/ui.ts`             | ドラッグ可能な UI パネル                         |
| `index.d.ts`            | 公開 TypeScript API 定義                         |
| `vite.config.js`        | UMD バンドル設定（`@` → `src/` エイリアス）      |
