import * as fs from 'fs';
// WebAPI Method について → https://api.slack.com/methods
// Slack SDK WebAPI について → https://slack.dev/node-slack-sdk/web-api
import { WebClient } from '@slack/web-api';
import {
  UsersListResponse,
  UsersProfileGetResponse,
} from 'seratch-slack-types/web-api';

const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec));

(async () => {
  try {
    const token = process.env.SLACK_TOKEN;
    if (!token) {
      console.log(`[ERROR] 環境変数 SLACK_TOKEN が設定されていません。`);
      return;
    }
    const web = new WebClient(token);
    let cursor: string | undefined = '';
    let members: any[] | undefined = [];
    let usersListResponse: UsersListResponse;

    do {
      console.log(`[INFO] users.list APIを呼び出します。 cursor: ${cursor}`);
      usersListResponse = (await web.users.list({
        cursor,
        limit: 200,
      })) as UsersListResponse;
      members = members?.concat(usersListResponse.members);
      console.log(
        `[INFO] リスト情報を取得しました。 memberCount: ${members.length}`
      );
      cursor = usersListResponse.response_metadata?.next_cursor;
    } while (cursor);

    if (!members) {
      console.log(`[ERROR] membersがありませんでした。`);
      return;
    }

    const outputFilename = 'user_profiles.json';
    const userProfiles = [];
    let counter = 1;
    for (const member of members) {
      await sleep(20);
      console.log(
        `[INFO] ${counter++}人目/${members.length}人中 id: ${member.id} name: ${
          member.name
        } を取得します。`
      );

      const usersProfileGetResponse = (await web.users.profile.get({
        user: member.id,
      })) as UsersProfileGetResponse;
      userProfiles.push(usersProfileGetResponse);

      fs.writeFileSync(outputFilename, JSON.stringify(userProfiles));
    }
    console.log(
      `[INFO] プロフィール情報取得が終了しました。 ${outputFilename} にて確認下さい。`
    );
  } catch (err) {
    console.log(`[ERROR] エラーが発生しました。 err:`);
    console.log(err);
  }
})();
