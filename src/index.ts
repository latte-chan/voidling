import { configDotenv } from 'dotenv';
import { getProfile } from './requests';
import { parseMatches } from './crawler';
import { MongoClient, ServerApiVersion } from 'mongodb';

configDotenv();

export const riotKey = process.env.RIOT_KEY!;

const region = process.env.REGION;
const group = process.env.GROUP;
const username = process.env.USERNAME;

const encodedUsername = encodeURIComponent(process.env.DB_USERNAME!);
const encodedPassword = encodeURIComponent(process.env.DB_PASSWORD!);
const clusterURI = process.env.CLUSTER_URI!;

const uri = `mongodb+srv://${encodedUsername}:${encodedPassword}@${clusterURI}/?retryWrites=true&w=majority`;

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

client.db('chalicar').command({ ping: 1 });

export const puuids: string[] = [];
export const parsedMatchIds: string[] = [];

async function crawlMatches(
  region: string,
  group: string,
  seedUsername: string
) {
  const profileRes = await getProfile(region, seedUsername);
  if (!profileRes.data) {
    console.log(profileRes.error);
    return;
  }
  const puuid = profileRes.data.puuid;
  puuids.push(puuid);

  while (puuids.length !== 0) {
    const nextPuuid = puuids.pop();
    if (!nextPuuid) return;
    await parseMatches(group, nextPuuid);
  }
}

if (region && group && username) {
  crawlMatches(region, group, username);
} else {
  console.log('Missing region, group, or username from env');
}
