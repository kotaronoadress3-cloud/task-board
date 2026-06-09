# Task Board Project

## プロジェクト概要

タスク管理ボードアプリケーション。

## デプロイ先

https://kotaronoadress3-cloud.github.io/task-board/

## 技術スタック

| カテゴリ | 採用技術 |
|----------|----------|
| フレームワーク | React 18 |
| ビルドツール | Vite 6 |
| 言語 | JavaScript (JSX) |
| スタイリング | Plain CSS（CSS Modules 不使用） |
| 状態管理 | React `useState` / `useEffect` |
| 永続化 | `localStorage` |
| デプロイ | GitHub Pages（GitHub Actions による自動デプロイ） |

## ディレクトリ構成

```
task-board/
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Pages 自動デプロイ
├── src/
│   ├── components/
│   │   ├── TaskInput.jsx    # タスク入力フォーム
│   │   ├── TaskItem.jsx     # タスク1件の行
│   │   └── TaskList.jsx     # タスク一覧
│   ├── App.jsx              # ルートコンポーネント・状態管理
│   ├── App.css              # アプリ全体のスタイル
│   ├── index.css            # グローバルスタイル
│   └── main.jsx             # エントリーポイント
├── index.html
├── vite.config.js
└── package.json
```

## コンポーネント命名規約

- **ファイル名・コンポーネント名** は PascalCase（例: `TaskItem.jsx`）
- **1ファイル1コンポーネント**、ファイル名とコンポーネント名を一致させる
- **コンポーネントは `src/components/` に配置**、ルートコンポーネント（`App.jsx`）のみ `src/` 直下
- **Props の命名** はキャメルケース。イベントハンドラは `on` プレフィックス（例: `onAdd`, `onToggle`, `onDelete`）
- CSS クラス名はケバブケース（例: `.task-item`, `.delete-btn`）

## 開発コマンド

```bash
npm run dev      # 開発サーバー起動 → http://localhost:5173
npm run build    # 本番ビルド（dist/ に出力）
npm run preview  # ビルド結果をローカルでプレビュー
```

---

## Git 運用ルール

### 基本方針

**コードを変更するたびに、必ず GitHub にプッシュすること。**

### コミット・プッシュの手順

1. 変更をステージング
   ```
   git add <変更ファイル>
   ```
2. コミット（変更内容を端的に記述）
   ```
   git commit -m "変更内容の説明"
   ```
3. GitHub へプッシュ
   ```
   git push origin <ブランチ名>
   ```

### ブランチ戦略

- `main` — 本番相当の安定ブランチ。直接プッシュ禁止。
- `develop` — 開発用の統合ブランチ。
- `feature/<機能名>` — 新機能開発用。
- `fix/<バグ名>` — バグ修正用。

### コミットメッセージ規約

```
<種別>: <変更内容の要約>

例:
feat: タスク追加フォームを実装
fix: 完了済みタスクが削除できないバグを修正
refactor: タスクリストコンポーネントを分割
docs: READMEにセットアップ手順を追記
```

| 種別 | 用途 |
|------|------|
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `refactor` | リファクタリング |
| `docs` | ドキュメント |
| `style` | フォーマット・スタイル |
| `test` | テスト |
| `chore` | ビルド・設定変更 |

### 注意事項

- `.env` ファイルや機密情報は絶対にコミットしない。
- コミット前に `git status` で変更ファイルを確認する。
- プッシュ前にローカルでの動作確認を行う。
