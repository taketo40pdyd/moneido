# 資産手帳 - Moneido

家計簿・資産管理ができるPWA(Progressive Web App)です。バックエンドにFirebase
(Authentication + Firestore)を使用しています。

## GitHub Pagesで公開する手順

1. GitHubで新しいリポジトリを作成する(例: `moneido`)。Public/Privateどちらでも
   GitHub Pagesは使えます(Privateの場合はGitHub Pro以上が必要な場合があります)。
2. このリポジトリの中身(`index.html`、`manifest.json`、`sw.js`、`icon-192.png`、
   `icon-512.png`、`apple-touch-icon.png`、`og-image.png`、`.nojekyll`、
   および `login` フォルダと `signup` フォルダ)を、作成したリポジトリの
   **ルート直下** にそのままアップロードする(フォルダ構造を保ったままドラッグ&ドロップでOK)。
3. リポジトリの「Settings」→ 左メニュー「Pages」を開く。
4. 「Build and deployment」の「Source」で **Deploy from a branch** を選択。
5. 「Branch」で `main`(または使っているブランチ名)と `/ (root)` を選んで「Save」。
6. 数十秒〜数分待つと、ページ上部に公開URLが表示されます。
   このプロジェクトの場合: `https://taketo40pdyd.github.io/moneido/`

## わかりやすいURLでログイン/新規登録画面を開く

- ログイン画面: `https://taketo40pdyd.github.io/moneido/login/`
- 新規登録画面: `https://taketo40pdyd.github.io/moneido/signup/`

これらは `login/index.html`・`signup/index.html` という小さな中継ページで、
開いた瞬間に本体(`../index.html?auth=login` など)へ自動的に転送されます。
GitHub Pagesは純粋な静的ホスティングでサーバー側のURL書き換えができないため、
この「フォルダ+中継ページ」という形で実現しています。フォルダ構造を保ったまま
アップロードすれば、そのまま動作します。

## Firebaseの設定(まだの場合)

`index.html` を開く前に、必ず以下を済ませてください。

- `index.html` 内の `firebaseConfig` に、あなたのFirebase
  プロジェクトの値を設定する(同梱の「Firebase設定手順.md」を参照)。
- Firebaseコンソールの Firestore Database →「ルール」に、同梱の
  `firestore.rules` の内容を貼り付けて公開する。
- **公開URLを確定させたら**、Firebaseコンソールの
  Authentication →「Settings」→「承認済みドメイン」に、GitHub PagesのURL
  のドメイン(このプロジェクトの場合 `taketo40pdyd.github.io`)を追加する。
  これを忘れると、公開先のURLからはGoogleログインが失敗する。
  (Google Cloud Console側の追加設定は不要です。)

## ファイル構成

| ファイル | 役割 |
|---|---|
| `index.html` | アプリ本体(単一HTMLファイル) |
| `manifest.json` | PWAとしてホーム画面に追加するための設定 |
| `sw.js` | オフラインでもアプリの起動画面を開けるようにする最小限のservice worker |
| `icon-192.png` / `icon-512.png` | PWAアイコン |
| `apple-touch-icon.png` | iOSのホーム画面用アイコン |
| `og-image.png` | X/LINEなどSNSでURLを共有したときのプレビュー画像 |
| `login/index.html` | `/login/` というURLでログイン画面を直接開くためのリダイレクトページ |
| `signup/index.html` | `/signup/` というURLで新規登録画面を直接開くためのリダイレクトページ |
| `.nojekyll` | GitHub PagesがJekyllとしてビルドしないようにする空ファイル |
| `firestore.rules` | Firestoreのセキュリティルール(Firebaseコンソール側に設定するもの。リポジトリに含めても含めなくてもOK) |
| `Firebase設定手順.md` | Firebaseプロジェクトの作成〜設定手順 |

## 注意点

- `index.html` は `file://` で直接開くと正しく動作しません。ローカルで確認する
  場合は `python3 -m http.server` などの簡易サーバー経由、または実際に
  GitHub Pagesへ公開したURLで確認してください。
- Firestoreの1ドキュメントは最大1MB程度です。取引データなどが非常に多くなった
  場合、将来的にデータ構造の見直しが必要になる可能性があります。
