# Condition Monitor PWA

睡眠・HRV・トレーニング負荷の統合モニター — iPhone ホーム画面対応PWA

## ファイル構成

```
condition-monitor-pwa/
├── index.html      ← アプリ本体（CDN + React + Babel）
├── manifest.json   ← PWAメタデータ（アイコン・名前・テーマカラー）
├── sw.js           ← Service Worker（オフラインキャッシュ）
└── README.md       ← このファイル
```

---

## GitHub Pages へのデプロイ手順（5分）

### 1. GitHubリポジトリを作成

1. https://github.com/new にアクセス
2. Repository name: `condition-monitor`（任意）
3. Public を選択 → **Create repository**

### 2. ファイルをアップロード

**方法A — ブラウザのみ（コマンド不要）**

1. 作成したリポジトリページを開く
2. **Add file → Upload files** をクリック
3. `index.html`、`manifest.json`、`sw.js` の3ファイルをドラッグ＆ドロップ
4. Commit changes

**方法B — git CLI**

```bash
cd condition-monitor-pwa
git init
git add .
git commit -m "initial"
git remote add origin https://github.com/<YOUR_USERNAME>/condition-monitor.git
git push -u origin main
```

### 3. GitHub Pages を有効化

1. リポジトリの **Settings** タブ
2. 左メニュー → **Pages**
3. Source: **Deploy from a branch**
4. Branch: `main` / `/ (root)` → **Save**
5. 数秒後に `https://<YOUR_USERNAME>.github.io/condition-monitor/` が生成

### 4. iPhoneのホーム画面に追加

1. Safariで上記URLを開く
2. 下部の**共有ボタン**（□↑）をタップ
3. **「ホーム画面に追加」** をタップ
4. 名前を確認して **追加**

→ ホーム画面にアイコンが追加され、次回から全画面アプリとして起動します。

---

## 機能

| 機能 | 説明 |
|------|------|
| **毎日の手入力** | Zepp等の画面を見ながら入力、localStorage + window.storage に永続保存 |
| **CSVインポート** | Garmin/Zepp/Oura等の一括エクスポートCSVに対応、列を自動推定 |
| **コンディションスコア** | HRV・睡眠・心拍・ストレスを重み付け統合した 0-100 スコア |
| **ラグ相関分析** | 負荷 → 0〜3日後のコンディションへの影響を可視化 |
| **AIコーチ** | 実データに基づく回復・トレーニング助言（Anthropic API） |
| **オフライン動作** | Service Worker によりインターネット不要で閲覧可能 |

## 技術仕様

- React 18 (CDN + Babel standalone)
- Recharts 2.12 / PapaParse 5.4 / Lucide React 0.383
- Tailwind CSS (CDN)
- Service Worker (Cache First + Network First)
- localStorage（Claudeアーティファクト外でのデータ永続化）
- Web App Manifest（PWA）

## データについて

- **データはブラウザのlocalStorageに保存**されます。
- GitHubやAnthropicのサーバーには送信されません。
- AIコーチ機能はAnthropicのAPIを使用するため、インターネット接続が必要です。
- 一般的な健康・トレーニング情報であり医療診断ではありません。
