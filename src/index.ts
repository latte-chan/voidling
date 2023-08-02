import { configDotenv } from 'dotenv';
import { getMatch, getMatches, getProfile } from './requests';
import { exit } from 'process';

configDotenv();

export const riotKey = process.env.RIOT_KEY!;

const region = process.env.REGION;
const group = process.env.GROUP;
const username = process.env.USERNAME;

async function crawlMatches(region: string, group: string, username: string) {
  const profileRes = await getProfile(region, username);
  if (!profileRes.data) return;
  const puuid = profileRes.data.puuid;
  console.log(puuid);
  const matchesRes = await getMatches(group, puuid, null, 0);
  if (!matchesRes.data) return;
  console.log(matchesRes.data);
  const firstMatch = matchesRes.data[0];
  const matchRes = await getMatch(group, firstMatch);
  if (!matchRes.data) return;
  console.log(
    matchRes.data.info.participants.filter(
      (participant) => participant.puuid === puuid
    )
  );
}

if (region && group && username) {
  crawlMatches(region, group, username);
} else {
  console.log('Missing region or username from env');
}
