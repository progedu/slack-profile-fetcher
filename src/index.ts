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
      await sleep(20);
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

    const outputMembersFilename = 'members.json';
    fs.writeFileSync(outputMembersFilename, JSON.stringify(members));
    console.log(
      `[INFO] メンバー情報取得が終了しました。 ${outputMembersFilename} にて確認下さい。`
    );

    const outputProfileFilename = 'user_profiles.json';
    const userProfiles = new Map();
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
      userProfiles.set(member.id, usersProfileGetResponse);

      fs.writeFileSync(
        outputProfileFilename,
        JSON.stringify(Array.from(userProfiles))
      );
    }
    console.log(
      `[INFO] プロフィール情報取得が終了しました。 ${outputProfileFilename} にて確認下さい。`
    );
  } catch (err) {
    console.log(`[ERROR] エラーが発生しました。 err:`);
    console.log(err);
  }
})();
