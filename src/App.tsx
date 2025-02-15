import React, { useState, useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { AdminPanel } from './components/AdminPanel';
import { AssetsPanel } from './components/AssetsPanel';
import { Login } from './components/Login';
import { GameState, Player, Property, BoardSquare } from './types';
import { initialProperties, BOARD_SQUARES } from './gameData';
import { saveGameState, loadGameState, saveCurrentUser, loadCurrentUser } from './lib/storage';
import { AlertCircle } from 'lucide-react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AdminPage } from './pages/AdminPage';
import { Notification } from './components/Notification';

const PLAYER_COLORS = {
  admin: 'slate',
  player1: 'rose',
  player2: 'emerald',
  player3: 'amber',
  player4: 'indigo',
  player5: 'cyan',
  player6: 'fuchsia'
};

const DEMO_USERS = {
  admin: { id: 'admin', email: 'admin@example.com', password: 'admin123', role: 'admin' as const },
  players: [
    { id: 'player1', email: 'player1@example.com', password: 'player1', role: 'user' as const },
    { id: 'player2', email: 'player2@example.com', password: 'player2', role: 'user' as const },
    { id: 'player3', email: 'player3@example.com', password: 'player3', role: 'user' as const },
    { id: 'player4', email: 'player4@example.com', password: 'player4', role: 'user' as const },
    { id: 'player5', email: 'player5@example.com', password: 'player5', role: 'user' as const },
    { id: 'player6', email: 'player6@example.com', password: 'player6', role: 'user' as const }
  ]
};

const initialGameState: GameState = {
  players: [
    { id: 'player1', name: 'Player 1', role: 'user', money: 5000, position: 0, assets: [], color: PLAYER_COLORS.player1, loans: 0 },
    { id: 'player2', name: 'Player 2', role: 'user', money: 5000, position: 0, assets: [], color: PLAYER_COLORS.player2, loans: 0 },
    { id: 'player3', name: 'Player 3', role: 'user', money: 5000, position: 0, assets: [], color: PLAYER_COLORS.player3, loans: 0 },
    { id: 'player4', name: 'Player 4', role: 'user', money: 5000, position: 0, assets: [], color: PLAYER_COLORS.player4, loans: 0 },
    { id: 'player5', name: 'Player 5', role: 'user', money: 5000, position: 0, assets: [], color: PLAYER_COLORS.player5, loans: 0 },
    { id: 'player6', name: 'Player 6', role: 'user', money: 5000, position: 0, assets: [], color: PLAYER_COLORS.player6, loans: 0 }
  ],
  currentPlayer: 0,
  properties: initialProperties,
  gameStarted: false,
  lastDiceRoll: null,
  round: 1,
  maxRounds: 30
};

const INTEREST_RATE = 0.1; // 10% interest rate on negative balances

const AUTH_STORAGE_KEY = 'businessGame_auth';

interface AuthStorage {
  currentUser: Player | null;
}

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = loadGameState();
    return saved || initialGameState;
  });
  
  const [currentUser, setCurrentUser] = useState<Player | null>(() => {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedAuth) {
      try {
        return JSON.parse(savedAuth);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [notification, setNotification] = useState<{
    id: number;
    message: string;
  } | null>(null);

  const [playerHistory, setPlayerHistory] = useState<{[key: string]: number[]}>({});
  const [showAssets, setShowAssets] = useState<boolean>(true);
  const [diceHistory, setDiceHistory] = useState<Array<{
    playerId: string,
    roll: number,
    timestamp: number
  }>>([]);

  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const savedState = loadGameState();
        if (savedState) {
          setGameState(savedState);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AUTH_STORAGE_KEY) {
        const savedAuth = e.newValue ? JSON.parse(e.newValue) : null;
        setCurrentUser(savedAuth);
      } else if (e.key === 'gameState') {
        const savedState = e.newValue ? JSON.parse(e.newValue) : null;
        if (savedState) {
          setGameState(savedState);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const showNotification = (message: string) => {
    if (notification) {
      setTimeout(() => {
        setNotification({
          id: Date.now(),
          message
        });
      }, 1000);
    } else {
      setNotification({
        id: Date.now(),
        message
      });
    }
  };

  const handleLogin = (email: string, password: string, role: 'admin' | 'user') => {
    if (email === DEMO_USERS.admin.email && password === DEMO_USERS.admin.password) {
      const adminUser = {
        id: 'admin',
        name: 'Admin',
        role: 'admin' as const,
        money: 0,
        position: -1,
        assets: [],
        color: PLAYER_COLORS.admin,
        loans: 0
      };
      setCurrentUser(adminUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
      saveCurrentUser(adminUser.id);
      showNotification('Welcome, Admin!');
      return;
    }

    const player = DEMO_USERS.players.find(p => p.email === email && p.password === password);
    if (player) {
      const gamePlayer = gameState.players.find(p => p.id === player.id);
      if (gamePlayer) {
        setCurrentUser(gamePlayer);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(gamePlayer));
        saveCurrentUser(gamePlayer.id);
        showNotification(`Welcome, ${gamePlayer.name}!`);
        return;
      }
    }

    alert('Invalid credentials');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    saveCurrentUser('');
    showNotification('Logged out successfully');
  };

  const handlePropertyPurchase = (property: Property, currentPlayerData: Player) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === currentPlayerData.id
          ? {
              ...player,
              money: player.money - property.price,
              assets: [...player.assets, property]
            }
          : player
      ),
      properties: prev.properties.map(p =>
        p.id === property.id
          ? { ...p, owner: currentPlayerData.id }
          : p
      )
    }));

    showNotification(`${currentPlayerData.name} purchased ${property.name} for $${property.price}`);
    
    if (currentPlayerData.money - property.price < 0) {
      showNotification(`${currentPlayerData.name} is in debt! Interest will be charged on moves.`);
    }
  };

  const movePlayer = (playerId: string, position: number) => {
    setGameState(prev => {
      const player = prev.players.find(p => p.id === playerId);
      if (!player) return prev;

      setPlayerHistory(prevHistory => ({
        ...prevHistory,
        [playerId]: [...(prevHistory[playerId] || []), player.position]
      }));

      let interestCharge = 0;
      if (player.money < 0) {
        interestCharge = Math.floor(Math.abs(player.money) * INTEREST_RATE);
        showNotification(`${player.name} paid $${interestCharge} in interest due to negative balance`);
      }

      showNotification(`${player.name} moved to position ${position}`);
      
      return {
        ...prev,
        players: prev.players.map(p =>
          p.id === playerId
            ? { 
                ...p, 
                position: position % BOARD_SQUARES.length,
                money: p.money - (p.money < 0 ? interestCharge : 0)
              }
            : p
        ),
      };
    });
  };

  const handleLandOnProperty = (square: BoardSquare, currentPlayerData: Player) => {
    const property = gameState.properties.find(p => p.id === square.id);
    if (!property) return;
    
    if (!property.owner) {
      if (currentUser?.role === 'admin' || currentPlayerData.id === currentUser?.id) {
        const wantsToBuy = window.confirm(
          `Would you like to purchase ${property.name} for $${property.price}?${
            currentPlayerData.money < property.price 
              ? `\nWarning: This will put you $${property.price - currentPlayerData.money} in debt!`
              : ''
          }`
        );
        if (wantsToBuy) {
          handlePropertyPurchase(property, currentPlayerData);
        }
      }
    } else if (property.owner !== currentPlayerData.id) {
      const owner = gameState.players.find(p => p.id === property.owner);
      if (owner) {
        handleRentPayment(property, currentPlayerData, owner);
      }
    }
  };

  const handleRentPayment = (property: Property, currentPlayer: Player, owner: Player) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player => {
        if (player.id === currentPlayer.id) {
          const newMoney = player.money - property.rent;
          if (newMoney < 0) {
            showNotification(`${player.name} is now in debt! Interest will be charged on moves.`);
          }
          return { ...player, money: newMoney };
        }
        if (player.id === owner.id) {
          return { ...player, money: player.money + property.rent };
        }
        return player;
      })
    }));
    showNotification(
      `${currentPlayer.name} paid $${property.rent} rent to ${owner.name} for ${property.name}`
    );
  };

  const rollDice = (customValue?: number) => {
    if (gameState.isRolling) return;
    
    const currentPlayerData = gameState.players[gameState.currentPlayer];
    
    if (currentUser?.role !== 'admin' && currentPlayerData.id !== currentUser?.id) {
      showNotification("It's not your turn!");
      return;
    }

    const roll = customValue || Math.floor(Math.random() * 6) + 1;
    
    showNotification(`${currentPlayerData.name} rolled a ${roll}`);

    let newPosition = (currentPlayerData.position + roll) % BOARD_SQUARES.length;
    
    if (newPosition < currentPlayerData.position) {
      setGameState(prev => ({
        ...prev,
        players: prev.players.map(p =>
          p.id === currentPlayerData.id
            ? { ...p, money: p.money + 1000 }
            : p
        )
      }));
      showNotification(`${currentPlayerData.name} passed START! Collect $1,000`);
    }

    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p =>
        p.id === currentPlayerData.id
          ? { ...p, position: newPosition }
          : p
      ),
      lastDiceRoll: roll,
      isRolling: true
    }));

    const landedSquare = BOARD_SQUARES[newPosition];
    if (landedSquare.type === "property") {
      setTimeout(() => {
        handleLandOnProperty(landedSquare, {
          ...currentPlayerData,
          position: newPosition
        });
      }, 100);
    }

    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        currentPlayer: (prev.currentPlayer + 1) % prev.players.length,
        round: prev.currentPlayer + 1 >= prev.players.length ? prev.round + 1 : prev.round,
        isRolling: false
      }));
    }, 1000);
  };

  const handleUpdatePropertyPrice = (propertyId: number, newPrice: number, newRent: number) => {
    setGameState(prev => ({
      ...prev,
      properties: prev.properties.map(property =>
        property.id === propertyId
          ? { ...property, price: newPrice, rent: newRent }
          : property
      )
    }));
    showNotification(`Updated price and rent for property #${propertyId}`);
  };

  const resetGame = () => {
    if (window.confirm('Are you sure you want to reset the game? All progress will be lost.')) {
      setGameState(initialGameState);
      setPlayerHistory({});
      showNotification('Game has been reset!');
    }
  };

  const addMoney = (playerId: string, amount: number) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === playerId
          ? { ...player, money: player.money + amount }
          : player
      ),
    }));
    const player = gameState.players.find(p => p.id === playerId);
    showNotification(`${amount >= 0 ? 'Added' : 'Removed'} $${Math.abs(amount)} ${amount >= 0 ? 'to' : 'from'} ${player?.name}`);
  };

  const removePlayer = (playerId: string) => {
    if (gameState.players.length <= 2) {
      showNotification('Cannot remove player. Minimum 2 players required.');
      return;
    }
    
    setGameState(prev => {
      const playerToRemove = prev.players.find(p => p.id === playerId);
      showNotification(`${playerToRemove?.name} has been removed from the game`);
      
      return {
        ...prev,
        players: prev.players.filter(player => player.id !== playerId),
        currentPlayer: prev.currentPlayer >= prev.players.length - 1 ? 0 : prev.currentPlayer,
        properties: prev.properties.map(property =>
          property.owner === playerId ? { ...property, owner: null } : property
        ),
      };
    });
  };

  const handleUndoMove = (playerId: string) => {
    const history = playerHistory[playerId];
    if (!history?.length) {
      showNotification('No moves to undo for this player');
      return;
    }

    const lastPosition = history[history.length - 1];
    setPlayerHistory(prev => ({
      ...prev,
      [playerId]: history.slice(0, -1)
    }));

    movePlayer(playerId, lastPosition);
    showNotification('Move undone');
  };

  const handleCustomRoll = (playerId: string, roll: number) => {
    if (roll < 1 || roll > 6) {
      showNotification('Invalid roll number. Must be between 1 and 6.');
      return;
    }

    if (gameState.isRolling) return;

    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    setGameState(prev => ({ ...prev, isRolling: true }));

    setDiceHistory(prev => [...prev, {
      playerId: player.id,
      roll,
      timestamp: Date.now()
    }]);

    showNotification(`${player.name} rolled a ${roll}`);

    const newPosition = (player.position + roll) % BOARD_SQUARES.length;
    const passedStart = newPosition < player.position;

    setGameState(prev => {
      const playerIndex = prev.players.findIndex(p => p.id === playerId);
      
      return {
        ...prev,
        players: prev.players.map(p =>
          p.id === playerId
            ? {
                ...p,
                position: newPosition,
                money: passedStart ? p.money + 1000 : p.money
              }
            : p
        ),
        lastDiceRoll: roll
      };
    });

    if (passedStart) {
      showNotification(`${player.name} passed START! Collect $1,000`);
    }

    setTimeout(() => {
      const landedSquare = BOARD_SQUARES[newPosition];
      if (landedSquare.type === "property") {
        handleLandOnProperty(landedSquare, {
          ...player,
          position: newPosition,
          money: passedStart ? player.money + 1000 : player.money
        });
      }

      setGameState(prev => {
        const playerIndex = prev.players.findIndex(p => p.id === playerId);
        let nextPlayer = (playerIndex + 1) % prev.players.length;
        while (prev.players[nextPlayer].role === 'admin') {
          nextPlayer = (nextPlayer + 1) % prev.players.length;
        }

        return {
          ...prev,
          currentPlayer: nextPlayer,
          round: nextPlayer === 0 ? prev.round + 1 : prev.round,
          isRolling: false
        };
      });
    }, 100);
  };

  const handleSellProperty = (propertyId: number, ownerId: string) => {
    setGameState(prev => {
      const property = prev.properties.find(p => p.id === propertyId);
      const owner = prev.players.find(p => p.id === ownerId);
      
      if (!property || !owner) return prev;

      const sellPrice = Math.floor(property.price * 0.8);
      
      const newProperties = prev.properties.map(p =>
        p.id === propertyId ? { ...p, owner: null } : p
      );

      const newPlayers = prev.players.map(player =>
        player.id === ownerId
          ? {
              ...player,
              money: player.money + sellPrice,
              assets: player.assets.filter(asset => asset.id !== propertyId)
            }
          : player
      );

      showNotification(`${owner.name} sold ${property.name} back to the bank for $${sellPrice}`);

      return {
        ...prev,
        properties: newProperties,
        players: newPlayers
      };
    });
  };

const skipTurn = () => {
  const isCurrentPlayersTurn = currentUser?.id === gameState.players[gameState.currentPlayer]?.id;
  const isAdmin = currentUser?.role === 'admin';

  if (!isCurrentPlayersTurn && !isAdmin) {
    showNotification("It's not your turn!");
    return;
  }

  const currentPlayerData = gameState.players[gameState.currentPlayer];
  showNotification(`${currentPlayerData.name} skipped their turn`);

  setGameState(prev => ({
    ...prev,
    currentPlayer: (prev.currentPlayer + 1) % prev.players.length,
    round: prev.currentPlayer + 1 >= prev.players.length ? prev.round + 1 : prev.round
  }));
};


  const isAllowedToPlay = (currentPlayerId: string) => {
    if (!currentUser) return false;
    return currentUser.role === 'admin' || currentPlayerId === currentUser.id;
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        {notification && (
          <Notification
            key={notification.id}
            message={notification.message}
            onRemove={() => setNotification(null)}
          />
        )}

        <Routes>
          <Route
            path="/"
            element={
              <div className="p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-4xl font-bold">Business Board Game</h1>
                      <p className="text-lg text-gray-600 mt-2">
                        Round: {gameState.round}/{gameState.maxRounds} | 
                        Current Turn: {gameState.players[gameState.currentPlayer]?.name || 'Loading...'}
                        {gameState.players[gameState.currentPlayer]?.id !== currentUser?.id && currentUser?.role !== 'admin' && (
                          <span className="text-red-500 ml-2">
                            (Not your turn - please wait)
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      {currentUser.role === 'admin' && (
                        <Link
                          to="/admin"
                          target="_blank"
                          rel="noopener noreferrer"
                          state={{ currentUser }}
                          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>

                  <GameBoard
                    properties={gameState.properties || []}
                    players={gameState.players || []}
                    currentPlayer={gameState.currentPlayer || 0}
                    onRollDice={rollDice}
                    onSkipTurn={skipTurn}
                    lastDiceRoll={gameState.lastDiceRoll}
                    isAdmin={currentUser?.role === 'admin'}
                    isCurrentPlayersTurn={
                      Boolean(gameState.players[gameState.currentPlayer]?.id === currentUser?.id)
                    }
                    isAllowedToPlay={(playerId: string) => {
                      if (!currentUser || !playerId) return false;
                      return currentUser.role === 'admin' || playerId === currentUser.id;
                    }}
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowAssets(!showAssets)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      {showAssets ? 'Hide Assets' : 'Show Assets'}
                    </button>
                  </div>

                  {showAssets && (
                    <AssetsPanel
                      players={gameState.players}
                      properties={gameState.properties}
                      currentPlayer={currentUser}
                      onSellProperty={handleSellProperty}
                    />
                  )}

                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Recent Rolls</h3>
                    <div className="space-y-2">
                      {diceHistory.slice(-5).reverse().map((roll, index) => {
                        const player = gameState.players.find(p => p.id === roll.playerId);
                        return (
                          <div key={roll.timestamp} className="text-sm text-gray-600">
                            {player?.name} rolled a {roll.roll}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            }
          />
          <Route
            path="/admin"
            element={
              currentUser?.role === 'admin' ? (
                <AdminPage
                  players={gameState.players}
                  properties={gameState.properties}
                  onResetGame={resetGame}
                  onAddMoney={addMoney}
                  onRemovePlayer={removePlayer}
                  onMovePlayer={movePlayer}
                  onUndoMove={handleUndoMove}
                  onCustomRoll={handleCustomRoll}
                  onUpdatePropertyPrice={handleUpdatePropertyPrice}
                  onBackToGame={() => {
                    window.close();
                  }}
                  gameState={gameState}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;