export interface Player {
  id: string;
  name: string;
  role: 'admin' | 'user';
  money: number;
  position: number;
  assets: Property[];
  color: string;
  loans: number;
}

export interface Property {
  id: number;
  name: string;
  price: number;
  rent: number;
  owner: string | null;
  level: number;
  upgradeCost: number;
}

export interface BoardSquare {
  id: number;
  type: 'property' | 'special';
  name: string;
  price?: number;
  rent?: number;
  color?: string;
  description?: string;
  upgradeCost?: number;
}

export interface GameState {
  players: Player[];
  currentPlayer: number;
  properties: Property[];
  gameStarted: boolean;
  lastDiceRoll: number | null;
  round: number;
  maxRounds: number;
}

export interface TradeOffer {
  fromPlayerId: string;
  toPlayerId: string;
  offeredProperties: Property[];
  requestedProperties: Property[];
  offeredMoney: number;
  requestedMoney: number;
}