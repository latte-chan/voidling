import { configDotenv } from 'dotenv';
import { getMatch, getMatches, getProfile } from './requests';
import { exit } from 'process';
import { analyzeMatch } from './analysis';
import fs from 'fs/promises';

configDotenv();

export const riotKey = process.env.RIOT_KEY!;

const region = process.env.REGION;
const group = process.env.GROUP;
const username = process.env.USERNAME;

export const count = 100;
const total = 1000;

async function crawlMatches(region: string, group: string, username: string) {
  const profileRes = await getProfile(region, username);
  if (!profileRes.data) {
    console.log(profileRes.error);
    return;
  }
  const puuid = profileRes.data.puuid;

  let output = [];
  for (let start = 0; start < total; start = start + count) {
    process.stdout.write('batch-' + (start / count + 1));
    const matchesRes = await getMatches(group, puuid, 420, start);
    const matches = matchesRes.data;
    if (!matches) {
      console.log(matchesRes.error);
      return;
    }

    if (matches.length === 0) break;

    for (const matchId of matches) {
      process.stdout.write('.');
      const matchRes = await getMatch(group, matchId);
      const match = matchRes.data;
      if (!match) {
        console.log(matchRes.error);
        return;
      }
      const analysis = analyzeMatch(match, puuid)!;
      output.push(analysis);
    }
    console.log('done');
  }
  try {
    await fs.writeFile(`output/${username}.json`, JSON.stringify(output));
  } catch (error) {
    console.log(error);
  }
  console.log('complete!');
}

if (region && group && username) {
  crawlMatches(region, group, username);
} else {
  console.log('Missing region, group, or username from env');
}
