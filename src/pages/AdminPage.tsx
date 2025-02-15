import React, { useEffect } from 'react';
import { AdminPanel } from '../components/AdminPanel';
import { Link, useNavigate } from 'react-router-dom';
import { Player, Property, GameState } from '../types';

interface AdminPageProps {
  players: Player[];
  properties: Property[];
  onResetGame: () => void;
  onAddMoney: (playerId: string, amount: number) => void;
  onRemovePlayer: (playerId: string) => void;
  onMovePlayer: (playerId: string, position: number) => void;
  onUndoMove: (playerId: string) => void;
  onCustomRoll: (playerId: string, roll: number) => void;
  onUpdatePropertyPrice: (propertyId: number, newPrice: number, newRent: number) => void;
  onBackToGame: () => void;
  gameState: GameState;
}

declare global {
  interface WindowEventMap {
    'gameStateUpdate': CustomEvent<GameState>;
  }
}

export const AdminPage: React.FC<AdminPageProps> = ({
  players,
  properties,
  onResetGame,
  onAddMoney,
  onRemovePlayer,
  onMovePlayer,
  onUndoMove,
  onCustomRoll,
  onUpdatePropertyPrice,
  onBackToGame,
  gameState,
}) => {
  const navigate = useNavigate();

  // Add useEffect to handle real-time updates
  useEffect(() => {
    // Your AdminPage can now react to gameState changes in real-time
  }, [gameState]);

  const handleBackToGame = () => {
    onBackToGame();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Admin Panel</h1>
          <button
            onClick={handleBackToGame}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Back to Game
          </button>
        </div>

        <AdminPanel
          players={players}
          properties={properties}
          onResetGame={onResetGame}
          onAddMoney={onAddMoney}
          onRemovePlayer={onRemovePlayer}
          onMovePlayer={onMovePlayer}
          onUndoMove={onUndoMove}
          onCustomRoll={onCustomRoll}
          onUpdatePropertyPrice={onUpdatePropertyPrice}
        />
      </div>
    </div>
  );
};