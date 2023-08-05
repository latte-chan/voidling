import { parsedMatchIds, puuids } from '.';
import { addMatches } from './database';
import { Match } from './models';
import { getMatch, getMatches, getProfile } from './requests';

export const count = 100;
const total = 1000;

export async function parseMatches(group: string, puuid: string) {
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

    const currentMatches: Match[] = [];

    for (const matchId of matches) {
      process.stdout.write('.');
      const matchRes = await getMatch(group, matchId);
      const match = matchRes.data;
      if (!match) {
        console.log(matchRes.error);
        return;
      }
      parsedMatchIds.push(match.metadata.matchId);
      const participants = match.metadata.participants;
      puuids.push(...participants);
      currentMatches.push(match);
    }
    await addMatches(currentMatches);
    console.log('done');
  }
  console.log(`completed parsing puuid: ${puuid}`);
}
