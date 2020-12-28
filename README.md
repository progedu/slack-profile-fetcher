# slack-profile-fetcher

全ユーザーのカスタムプロフィール入りの JSON ファイル `members,json` と `user_profiles.json` を出力するスクリプト

### 使い方

Node.js の v12.8.1 以上をインストール。コンソールにて

```
$ npm install
$ npm run build
$ env SLACK_TOKEN=xoxp-999999999-999999999-999999999-999999999 node dist/index.js
```

を実行。 SLACK_TOKEN には、

- users:read
- users.profile:read

のスコープが付いている必要がある。
