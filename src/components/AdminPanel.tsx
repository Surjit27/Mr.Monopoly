import React, { useState } from 'react';
import { Player, Property, BoardSquare } from '../types';
import { Settings, Users, DollarSign, Map, RotateCcw, Dice1 as Dice, Building2, Download } from 'lucide-react';
import { BOARD_SQUARES } from '../gameData';
import { CompanyPricePanel } from './CompanyPricePanel';

interface AdminPanelProps {
  players: Player[];
  properties: Property[];
  onResetGame: () => void;
  onAddMoney: (playerId: string, amount: number) => void;
  onRemovePlayer: (playerId: string) => void;
  onMovePlayer: (playerId: string, position: number) => void;
  onUndoMove: (playerId: string) => void;
  onCustomRoll: (playerId: string, roll: number) => void;
  onUpdatePropertyPrice: (propertyId: number, newPrice: number, newRent: number) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  players,
  properties,
  onResetGame,
  onAddMoney,
  onRemovePlayer,
  onMovePlayer,
  onUndoMove,
  onCustomRoll,
  onUpdatePropertyPrice,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<number>(0);
  const [showCompanyPanel, setShowCompanyPanel] = useState<boolean>(false);

  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setSelectedPosition(Math.max(0, Math.min(27, value)));
  };

  const handleCustomAmount = (playerId: string) => {
    const amount = parseInt(customAmount);
    if (!isNaN(amount)) {
      onAddMoney(playerId, amount);
      setCustomAmount('');
    }
  };

  const handleDeductMoney = (playerId: string, amount: number) => {
    // Directly pass negative amount to deduct money
    onAddMoney(playerId, -Math.abs(amount));
  };

  const downloadGameHistory = () => {
    const gameHistory = {
      timestamp: new Date().toISOString(),
      players: players.map(player => ({
        name: player.name,
        money: player.money,
        position: player.position,
        assets: player.assets.map(asset => asset.name),
        loans: player.loans
      })),
      properties: properties.map(property => ({
        name: property.name,
        owner: property.owner ? players.find(p => p.id === property.owner)?.name : 'Bank',
        price: property.price,
        rent: property.rent
      }))
    };

    const historyBlob = new Blob(
      [JSON.stringify(gameHistory, null, 2)], 
      { type: 'application/json' }
    );

    const url = URL.createObjectURL(historyBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `game-history-${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="text-gray-700" />
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowCompanyPanel(!showCompanyPanel)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Building2 size={20} />
          {showCompanyPanel ? 'Hide Company Management' : 'Show Company Management'}
        </button>
      </div>

      {showCompanyPanel && (
        <CompanyPricePanel
          properties={properties}
          onUpdatePropertyPrice={onUpdatePropertyPrice}
        />
      )}

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-gray-700" />
          <h3 className="text-xl font-semibold">Players Management</h3>
        </div>
        <div className="space-y-4">
          {players.map((player) => (
            <div key={player.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{player.name}</p>
                    <p className={`text-sm ${player.money < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      Balance: ${player.money}
                      {player.money < 0 && ' (In Debt)'}
                    </p>
                    <p className="text-sm text-gray-600">Position: {player.position}</p>
                  </div>
                  {player.role !== 'admin' && (
                    <button
                      onClick={() => onRemovePlayer(player.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm font-medium">Add/Remove Money</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleDeductMoney(player.id, selectedAmount)}
                        className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm hover:bg-red-200 transition-colors"
                      >
                        -${selectedAmount}
                      </button>
                      <button
                        onClick={() => onAddMoney(player.id, selectedAmount)}
                        className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm hover:bg-green-200 transition-colors"
                      >
                        +${selectedAmount}
                      </button>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          placeholder="Custom amount"
                          className="w-32 px-2 py-1 border rounded text-sm"
                        />
                        <button
                          onClick={() => handleCustomAmount(player.id)}
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm hover:bg-blue-200 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Map className="w-4 h-4" />
                      <span className="text-sm font-medium">Move Player</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        min="0"
                        max="27"
                        value={selectedPosition}
                        onChange={handlePositionChange}
                        className="w-16 px-2 py-1 border rounded text-sm"
                      />
                      <button
                        onClick={() => onMovePlayer(player.id, selectedPosition)}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm hover:bg-blue-200 transition-colors"
                      >
                        Move
                      </button>
                      <button
                        onClick={() => onUndoMove(player.id)}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm hover:bg-gray-200 transition-colors flex items-center gap-1"
                      >
                        <RotateCcw className="w-4 h-4" /> Undo
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Dice className="w-4 h-4" />
                      <span className="text-sm font-medium">Quick Roll</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5, 6].map((roll) => (
                        <button
                          key={roll}
                          onClick={() => onCustomRoll(player.id, roll)}
                          className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm hover:bg-purple-200 transition-colors"
                        >
                          Roll {roll}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Money Amount
        </label>
        <select
          value={selectedAmount}
          onChange={(e) => setSelectedAmount(parseInt(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="100">$100</option>
          <option value="500">$500</option>
          <option value="1000">$1,000</option>
          <option value="5000">$5,000</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          onClick={downloadGameHistory}
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-600 transition-colors"
        >
          <Download size={20} />
          Download Game History
        </button>
      </div>

      <button
        onClick={onResetGame}
        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors w-full mt-4"
      >
        Reset Game
      </button>
    </div>
  );
};