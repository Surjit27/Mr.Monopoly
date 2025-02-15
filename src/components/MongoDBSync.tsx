import React, { useState } from 'react';
import { Database } from 'lucide-react';
import { syncGameStateToMongoDB, getGameStateFromMongoDB } from '../lib/dataSyncer';
import { GameState } from '../types';

interface MongoDBSyncProps {
  gameState: GameState;
  onGameStateLoad: (gameState: GameState) => void;
}

export const MongoDBSync: React.FC<MongoDBSyncProps> = ({ gameState, onGameStateLoad }) => {
  const [status, setStatus] = useState<string>('');

  // Fixed MongoDB URI (replace with your actual URI)
  const mongoUri = 'mongodb+srv://surjitsrkumar:<db_password>@cluster0.3g5ra.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

  const handleSync = async () => {
    setStatus('Syncing...');
    const result = await syncGameStateToMongoDB(mongoUri, gameState);
    
    if (result.success) {
      setStatus('Sync successful!');
    } else {
      setStatus('Sync failed. Please check your credentials and try again.');
    }
  };

  const handleLoad = async () => {
    setStatus('Loading...');
    const result = await getGameStateFromMongoDB(mongoUri);
    
    if (result.success && result.data) {
      onGameStateLoad(result.data);
      setStatus('Load successful!');
    } else {
      setStatus('Load failed. Please check your credentials.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Database className="text-blue-500" />
        <h2 className="text-xl font-bold">MongoDB Sync</h2>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={handleSync}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Sync to MongoDB
          </button>
          <button
            onClick={handleLoad}
            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Load from MongoDB
          </button>
        </div>

        {status && (
          <div className={`text-sm ${
            status.includes('successful') ? 'text-green-600' : 'text-red-600'
          }`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};
