import React from 'react';
import { Player, Property } from '../types';
import { Building2, DollarSign, Banknote as Banknotes, TrendingUp, Wallet, CircleDollarSign } from 'lucide-react';

interface AssetsPanelProps {
  players: Player[];
  properties: Property[];
  currentPlayer: Player;
  onSellProperty?: (propertyId: number, ownerId: string) => void;
  compact?: boolean;
}

export const AssetsPanel: React.FC<AssetsPanelProps> = ({
  players,
  properties,
  currentPlayer,
  onSellProperty,
  compact = false,
}) => {
  const getPlayerProperties = (playerId: string) => {
    return properties.filter(p => p.owner === playerId);
  };

  const calculateTotalValue = (playerProps: Property[]) => {
    return playerProps.reduce((total, prop) => total + prop.price, 0);
  };

  const calculateTotalRent = (playerProps: Property[]) => {
    return playerProps.reduce((total, prop) => total + prop.rent, 0);
  };

  const handleSellProperty = (property: Property, owner: Player) => {
    const sellPrice = Math.floor(property.price * 0.8);
    if (window.confirm(`Are you sure you want to sell ${property.name} back to the bank for $${sellPrice}?`)) {
      onSellProperty?.(property.id, owner.id);
    }
  };

  return (
    <div className={`${compact ? 'bg-opacity-90' : 'bg-gray-50 p-6'} rounded-lg shadow-lg`}>
      <div className="flex items-center gap-2 mb-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-sm">
        <Building2 className="text-blue-600" />
        <h2 className={`${compact ? 'text-xl' : 'text-2xl'} font-bold text-gray-800`}>
          Assets Overview
        </h2>
      </div>

      <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
        {players.map(player => {
          const playerProps = getPlayerProperties(player.id);
          const isInDebt = player.money < 0;
          const totalAssets = calculateTotalValue(playerProps);
          const netWorth = player.money + totalAssets;
          const totalRentIncome = calculateTotalRent(playerProps);

          return (
            <div
              key={player.id}
              className={`
                ${isInDebt ? 'bg-red-50' : 'bg-white'}
                rounded-lg p-4 border-l-4 ${isInDebt ? 'border-l-red-500' : `border-l-${player.color}-500`}
                shadow-sm hover:shadow-md transition-shadow
              `}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className={`text-lg font-bold ${isInDebt ? 'text-red-700' : `text-${player.color}-700`}`}>
                    {player.name}'s Empire
                  </h3>
                  {isInDebt && (
                    <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                      <CircleDollarSign size={14} />
                      <span>In debt: ${Math.abs(player.money)} (1% interest per move)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center gap-1 text-gray-600 text-xs mb-1">
                    <Wallet size={14} />
                    <span>Balance</span>
                  </div>
                  <span className={`text-sm font-bold ${player.money < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${player.money}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center gap-1 text-gray-600 text-xs mb-1">
                    <Building2 size={14} />
                    <span>Assets Value</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">${totalAssets}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center gap-1 text-gray-600 text-xs mb-1">
                    <TrendingUp size={14} />
                    <span>Net Worth</span>
                  </div>
                  <span className={`text-sm font-bold ${netWorth < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    ${netWorth}
                  </span>
                </div>
              </div>

              {playerProps.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {playerProps.map(property => (
                    <div
                      key={property.id}
                      className="bg-gray-50 rounded-lg p-2 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm text-gray-800">{property.name}</h4>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <DollarSign size={12} />
                            <span>{property.rent}/turn</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-xs font-semibold text-gray-700">${property.price}</div>
                          {onSellProperty && (currentPlayer.role === 'admin' || currentPlayer.id === player.id) && (
                            <button
                              onClick={() => handleSellProperty(property, player)}
                              className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded hover:bg-red-200 transition-colors"
                            >
                              <Banknotes size={10} />
                              Sell
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic text-center py-2">
                  No properties owned
                </div>
              )}

              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-end gap-2 text-xs text-gray-600">
                  <DollarSign size={12} />
                  <span>Total Rent Income: ${totalRentIncome}/turn</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};