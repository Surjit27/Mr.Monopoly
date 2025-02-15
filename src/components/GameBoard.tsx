import React, { useState, useEffect, useRef } from 'react';
import { Property, Player, BoardSquare } from '../types';
import { Dice6, AlertCircle, TrendingUp, Building2, Wallet, DollarSign, BarChart3, GraduationCap } from 'lucide-react';
import { BOARD_SQUARES } from '../gameData';

interface GameBoardProps {
  properties: Property[];
  players: Player[];
  currentPlayer: number;
  onRollDice: () => void;
  onSkipTurn: () => void;
  lastDiceRoll: number | null;
  isAdmin: boolean;
  isCurrentPlayersTurn: boolean;
  isAllowedToPlay: (playerId: string) => boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  properties,
  players,
  currentPlayer,
  onRollDice,
  onSkipTurn,
  lastDiceRoll,
  isAdmin,
  isCurrentPlayersTurn,
  isAllowedToPlay,
}) => {
  const [showError, setShowError] = useState(false);
  const [movingPlayer, setMovingPlayer] = useState<string | null>(null);
  const currentPlayerData = players[currentPlayer];
  const prevPositionsRef = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    players.forEach(player => {
      const prevPosition = prevPositionsRef.current[player.id];
      if (prevPosition !== undefined && prevPosition !== player.position) {
        setMovingPlayer(player.id);
        setTimeout(() => setMovingPlayer(null), 500);
      }
      prevPositionsRef.current[player.id] = player.position;
    });
  }, [players]);

  const handleRollDice = () => {
    if (!isCurrentPlayersTurn && !isAdmin) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    onRollDice();
  };

  const renderPlayerToken = (player: Player, squareIndex: number) => {
    const isMoving = movingPlayer === player.id;
    const playerNumber = parseInt(player.id.replace('player', ''));
    
    return (
      <div
        key={`token-${player.id}-${squareIndex}`}
        className={`player-token bg-${player.color}-500 ${isMoving ? 'moving' : ''}`}
        style={{
          '--tx': '0px',
          '--ty': '0px'
        } as React.CSSProperties}
        title={player.name}
      >
        {playerNumber}
      </div>
    );
  };

  const renderSquare = (square: BoardSquare, playersHere: Player[], uniqueKey: string) => {
    const property = properties.find(p => p.id === square.id);
    const owner = property?.owner ? players.find(p => p.id === property.owner) : null;
    const colorClass = square.color ? `bg-${square.color}-100` : 'bg-gray-50';
    const borderClass = owner ? `border-${owner.color}-500 border-2` : 'border';

    return (
      <div
        key={uniqueKey}
        className={`${borderClass} p-3 text-sm flex flex-col justify-between min-h-[80px] relative ${
          square.type === 'special' ? 'bg-gray-100' : colorClass
        } hover:shadow-lg transition-shadow duration-200`}
      >
        <div className="font-bold truncate">{square.name}</div>
        {square.type === 'property' && (
          <>
            <div className="text-gray-600">${square.price}</div>
            {owner && (
              <div className={`text-xs text-${owner.color}-600 font-semibold`}>
                Owner: {owner.name}
              </div>
            )}
          </>
        )}
        {square.type === 'special' && (
          <div className="text-gray-600 text-xs italic">{square.description}</div>
        )}
        {playersHere.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1 absolute bottom-2 right-2">
            {playersHere.map(player => renderPlayerToken(player, square.id))}
          </div>
        )}
      </div>
    );
  };

  const renderDiceControls = () => {
    if (!isCurrentPlayersTurn && !isAdmin) {
      return (
        <button
          disabled
          className="w-full bg-gray-300 text-white px-6 py-3 rounded-lg cursor-not-allowed"
        >
          Not Your Turn
        </button>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleRollDice}
            className={`bg-${currentPlayerData.color}-500 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-${currentPlayerData.color}-600 transition-all duration-300 transform hover:scale-105`}
          >
            <Dice6 size={24} className="animate-bounce" />
            Roll Dice
          </button>
          
          <button
            onClick={onSkipTurn}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
          >
            <AlertCircle size={24} />
            Skip Turn
          </button>
        </div>

        {isAdmin && (
          <div className="grid grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((roll) => (
              <button
                key={roll}
                onClick={() => onRollDice(roll)}
                className={`bg-${currentPlayerData.color}-100 text-${currentPlayerData.color}-700 px-3 py-2 rounded hover:bg-${currentPlayerData.color}-200 transition-colors text-sm font-medium`}
              >
                {roll}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCenterContent = () => {
    const playerProperties = properties.filter(p => p.owner === currentPlayerData.id);
    const totalAssets = playerProperties.reduce((sum, prop) => sum + prop.price, 0);
    const totalRentIncome = playerProperties.reduce((sum, prop) => sum + prop.rent, 0);
    const netWorth = currentPlayerData.money + totalAssets;

    return (
      <div className="relative h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-sm rounded-lg shadow-inner" />
        <div className="relative z-10 h-full p-6 flex flex-col">
          <div className="text-center mb-6">
            <h2 className={`text-3xl font-bold text-${currentPlayerData.color}-600`}>
              {currentPlayerData.name}'s Empire
            </h2>
            <p className="text-gray-600 mt-1">Round Overview</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/90 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <Wallet className="w-5 h-5" />
                <span className="font-semibold">Cash Balance</span>
              </div>
              <div className={`text-2xl font-bold ${currentPlayerData.money < 0 ? 'text-red-600' : 'text-green-600'}`}>
                ${currentPlayerData.money}
              </div>
              {currentPlayerData.money < 0 && (
                <p className="text-xs text-red-500 mt-1">1% interest per move</p>
              )}
            </div>

            <div className="bg-white/90 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">Net Worth</span>
              </div>
              <div className={`text-2xl font-bold ${netWorth < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                ${netWorth}
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white/90 rounded-lg shadow-sm p-4 mb-6 overflow-auto">
            <div className="flex items-center gap-2 text-gray-700 mb-4">
              <Building2 className="w-5 h-5" />
              <span className="font-semibold">Properties Owned ({playerProperties.length})</span>
            </div>
            
            {playerProperties.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {playerProperties.map(property => (
                  <div
                    key={property.id}
                    className={`p-3 rounded-lg bg-${currentPlayerData.color}-50 border border-${currentPlayerData.color}-200`}
                  >
                    <div className="font-semibold text-gray-800">{property.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-sm text-gray-600">
                        Value: ${property.price}
                      </div>
                      <div className="text-sm text-green-600 flex items-center">
                        <DollarSign className="w-3 h-3" />
                        {property.rent}/turn
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 italic py-4">
                No properties owned yet
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mb-4 px-4 py-2 bg-white/90 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="font-semibold">Total Rent Income:</span>
            </div>
            <span className="text-xl font-bold text-green-600">${totalRentIncome}/turn</span>
          </div>

          {renderDiceControls()}
        </div>
      </div>
    );
  };

  const renderBoard = () => {
    const size = 7;
    const board = Array(size * size).fill(null);
    const totalSquares = BOARD_SQUARES.length;
    let squareIndex = 0;

    const getBoardIndex = (row: number, col: number) => row * size + col;

    // Top row
    for (let col = 0; col < size; col++) {
      const square = BOARD_SQUARES[squareIndex % totalSquares];
      const playersHere = players.filter(p => p.position === squareIndex);
      board[getBoardIndex(0, col)] = renderSquare(square, playersHere, `square-0-${col}`);
      squareIndex++;
    }

    // Right column
    for (let row = 1; row < size - 1; row++) {
      const square = BOARD_SQUARES[squareIndex % totalSquares];
      const playersHere = players.filter(p => p.position === squareIndex);
      board[getBoardIndex(row, size - 1)] = renderSquare(square, playersHere, `square-${row}-${size - 1}`);
      squareIndex++;
    }

    // Bottom row
    for (let col = size - 1; col >= 0; col--) {
      const square = BOARD_SQUARES[squareIndex % totalSquares];
      const playersHere = players.filter(p => p.position === squareIndex);
      board[getBoardIndex(size - 1, col)] = renderSquare(square, playersHere, `square-${size - 1}-${col}`);
      squareIndex++;
    }

    // Left column
    for (let row = size - 2; row > 0; row--) {
      const square = BOARD_SQUARES[squareIndex % totalSquares];
      const playersHere = players.filter(p => p.position === squareIndex);
      board[getBoardIndex(row, 0)] = renderSquare(square, playersHere, `square-${row}-0`);
      squareIndex++;
    }

    // Center content
    const centerContent = renderCenterContent();
    board[getBoardIndex(3, 3)] = (
      <div
        key="center-content"
        className="col-span-5 row-span-5"
        style={{ 
          gridArea: '2 / 2 / 7 / 7',
        }}
      >
        {centerContent}
      </div>
    );

    return board;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img
                src="https://i.ibb.co/cSwHr4Bd/Whats-App-Image-2025-02-03-at-20-11-43-938f9f3c.jpg"
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
            <span className="font-bold text-lg text-blue-900">Bit By Bit</span>
          </div>
          <div className="h-8 w-px bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-900" />
            <span className="font-bold text-lg text-blue-900">VIT Bhopal</span>
          </div>
        </div>
        {showError && (
          <div className="flex items-center gap-2 text-red-500 animate-fade-in">
            <AlertCircle size={20} />
            <span>You can only roll on your turn</span>
          </div>
        )}
      </div>

      <div className="aspect-square w-full max-w-4xl mx-auto relative">
        <div className="grid grid-cols-7 grid-rows-7 gap-0.5 h-full">
          {renderBoard()}
        </div>
      </div>
    </div>
  );
};