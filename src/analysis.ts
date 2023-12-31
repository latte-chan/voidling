import { Match } from './models';

export interface MatchAnalysis {
  puuid: string;
  matchId: string;
  championId: number;
  win: boolean;
  pentakill: boolean;
  deathless: boolean;
  mythicItem: number | null;
}

export function analyzeMatch(
  match: Match,
  puuid: string
): MatchAnalysis | null {
  const participant = match.info.participants.find(
    (participant) => participant.puuid === puuid
  );
  if (!participant) return null;
  const matchId = match.metadata.matchId;
  const championId = participant.championId;
  const win = participant.win;
  const pentakill = participant.pentaKills > 0;
  const deathless = participant.deaths === 0;
  const mythicItem = participant.challenges.mythicItemUsed;
  return {
    puuid,
    matchId,
    championId,
    win,
    pentakill,
    deathless,
    mythicItem,
  };
}
