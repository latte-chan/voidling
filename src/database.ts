import { client } from '.';
import { Match } from './models';

export async function addMatches(matches: Match[]) {
  try {
    const database = client.db('chalicar');
    const matchesCollection = database.collection('matches');
    const result = await matchesCollection.insertMany(matches);
    console.log(`${result.insertedCount} documents were inserted.`);
  } catch (error) {
    console.log(error);
  }
}
