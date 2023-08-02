import { riotKey } from '.';
import { Match, MatchId, PlayerData } from './models';
import { RiotResponse, decodeRiotData } from './utils';

export async function getProfile(
  region: string,
  username: string
): Promise<RiotResponse<PlayerData>> {
  let url = new URL(
    `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}`
  );

  const req = new Request(url, { headers: { 'X-Riot-Token': riotKey } });

  let res = await fetch(req);
  return await decodeRiotData(res);
}

export async function getMatches(
  group: string,
  puuid: string,
  queue: number | null,
  start: number
): Promise<RiotResponse<MatchId[]>> {
  let url = new URL(
    `https://${group}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`
  );
  url.searchParams.append('start', String(start));
  url.searchParams.append('count', '100');
  if (queue) url.searchParams.append('queue', String(queue));

  const req = new Request(url, { headers: { 'X-Riot-Token': riotKey } });

  let res = await fetch(req);
  return await decodeRiotData(res);
}

export async function getMatch(
  group: string,
  id: MatchId
): Promise<RiotResponse<Match>> {
  let url = new URL(
    `https://${group}.api.riotgames.com/lol/match/v5/matches/${id}`
  );
  const req = new Request(url, { headers: { 'X-Riot-Token': riotKey } });

  let res = await fetch(req);
  return await decodeRiotData(res);
}
