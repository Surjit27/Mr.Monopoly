import { GameState } from '../types';

const STORAGE_KEY = 'business_board_game_state';
const CURRENT_USER_KEY = 'business_board_current_user';

export const saveGameState = (state: GameState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  // Trigger storage event for cross-tab sync
  window.dispatchEvent(new StorageEvent('storage', {
    key: STORAGE_KEY,
    newValue: JSON.stringify(state)
  }));
};

export const loadGameState = (): GameState | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
};

export const saveCurrentUser = (userId: string) => {
  localStorage.setItem(CURRENT_USER_KEY, userId);
  window.dispatchEvent(new StorageEvent('storage', {
    key: CURRENT_USER_KEY,
    newValue: userId
  }));
};

export const loadCurrentUser = (): string | null => {
  return localStorage.getItem(CURRENT_USER_KEY);
};