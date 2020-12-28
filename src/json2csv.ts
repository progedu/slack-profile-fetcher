import * as fs from 'fs';
import stringify from 'csv-stringify';

(async () => {
  const members = JSON.parse(
    fs.readFileSync('members.json', { encoding: 'utf-8' })
  );

  const userProfilesResponses = JSON.parse(
    fs.readFileSync('user_profiles.json', { encoding: 'utf-8' })
  );
  console.log(userProfilesResponses);
  const userProfiles = userProfilesResponses.map((r: any) => r?.profile);
  const fieldObjects = userProfiles.map((p: any) => p?.fields);
  // console.log(fieldObjects);

  const notNullFieldObjects: any[] = [];
  fieldObjects.forEach((e: any) => {
    if (e) notNullFieldObjects.push(e);
  });

  console.log(notNullFieldObjects.slice(-100));

  // console.log(realNames.slice(-5));

  // const profiles = userProfilesResponses.map( (r: any) => r?.profile);

  console.log('Finished.');
})();
