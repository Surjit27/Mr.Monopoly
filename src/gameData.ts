import { BoardSquare, Property } from './types';

// Game Data
export const BOARD_SQUARES: BoardSquare[] = [
  // Side 1 (Top)
  { id: 0, type: 'special', name: 'START', description: 'Collect $1,000 as you pass' },
  { id: 1, type: 'property', name: 'Google', price: 2000, rent: 200, color: 'blue', upgradeCost: 1000 },
  { id: 2, type: 'property', name: 'Sony', price: 2500, rent: 250, color: 'blue', upgradeCost: 1100 },
  { id: 3, type: 'property', name: 'Microsoft', price: 2200, rent: 220, color: 'blue', upgradeCost: 1100 },
  { id: 4, type: 'special', name: 'Chance', description: 'Draw a chance card' },
  { id: 5, type: 'property', name: 'Apple', price: 2400, rent: 240, color: 'green', upgradeCost: 1200 },
  { id: 6, type: 'special', name: 'Jail', description: 'Just visiting' },

  // Side 2 (Right)
  { id: 7, type: 'property', name: 'Amazon', price: 2600, rent: 260, color: 'green', upgradeCost: 1300 },
  { id: 8, type: 'property', name: 'Oracle', price: 2700, rent: 270, color: 'green', upgradeCost: 1350 },
  { id: 9, type: 'property', name: 'Meta', price: 2800, rent: 280, color: 'orange', upgradeCost: 1400 },
  { id: 10, type: 'special', name: 'Chance', description: 'Collect bonus money!' },
  { id: 11, type: 'property', name: 'Netflix', price: 3000, rent: 300, color: 'orange', upgradeCost: 1500 },
  { id: 12, type: 'special', name: 'Auction', description: 'Trade your properties' },

  // Side 3 (Bottom)
  { id: 13, type: 'property', name: 'Tesla', price: 3200, rent: 320, color: 'red', upgradeCost: 1600 },
  { id: 14, type: 'special', name: 'Chance', description: 'Draw a chance card' },
  { id: 15, type: 'property', name: 'SpaceX', price: 3400, rent: 340, color: 'red', upgradeCost: 1700 },
  { id: 16, type: 'property', name: 'Boeing', price: 3500, rent: 350, color: 'red', upgradeCost: 1750 },
  { id: 17, type: 'property', name: 'Uber', price: 3600, rent: 360, color: 'purple', upgradeCost: 1800 },
  { id: 18, type: 'property', name: 'Lyft', price: 3700, rent: 370, color: 'purple', upgradeCost: 1850 },

  // Side 4 (Left)
  { id: 19, type: 'property', name: 'Intel', price: 3800, rent: 380, color: 'yellow', upgradeCost: 1900 },
  { id: 20, type: 'special', name: 'Tax Office', description: 'Pay 10% of your money' },
  { id: 21, type: 'property', name: 'AMD', price: 3900, rent: 390, color: 'yellow', upgradeCost: 1950 },
  { id: 22, type: 'special', name: 'Chance', description: 'Draw a chance card' },
  { id: 23, type: 'property', name: 'NVIDIA', price: 4000, rent: 400, color: 'yellow', upgradeCost: 2000 }
];

export const initialProperties: Property[] = BOARD_SQUARES
  .filter(square => square.type === 'property')
  .map(prop => ({
    id: prop.id,
    name: prop.name,
    price: prop.price!,
    rent: prop.rent!,
    owner: null,
    level: 1,
    upgradeCost: prop.upgradeCost!
  }));
