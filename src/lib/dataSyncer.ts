import { syncDataToMongoDB, getDataFromMongoDB } from './mongodb';
import { GameState } from '../types';

export const syncGameStateToMongoDB = async (
  mongoUri: string,
  gameState: GameState,
  gameId: string
) => {
  return await syncDataToMongoDB(
    mongoUri,
    'game_states',
    gameState,
    gameId
  );
};

export const getGameStateFromMongoDB = async (
  mongoUri: string,
  gameId: string
) => {
  return await getDataFromMongoDB(
    mongoUri,
    'game_states',
    gameId
  );
};