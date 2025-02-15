import React, { useState } from 'react';
import { LogIn, GraduationCap } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string, role: 'admin' | 'user') => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password, role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center gap-2">
              <img
                src="https://i.ibb.co/cSwHr4Bd/Whats-App-Image-2025-02-03-at-20-11-43-938f9f3c.jpg"
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Mindzilla 2025</h2>
            <p className="text-sm text-gray-600">Bit By Bit, VIT Bhopal</p>
          </div>

          {/* Demo Info */}
          <div className="bg-blue-50 rounded p-3 text-sm">
            <p className="font-medium text-blue-800 mb-1">Demo Accounts:</p>
            <p className="text-blue-700 text-xs">Admin: admin@example.com / admin123</p>
            <p className="text-blue-700 text-xs">Player: player1@example.com / player1</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
           
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="user">Player</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <LogIn size={16} />
              Login
            </button>
          </form>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              © 2025 Bit By Bit, VIT Bhopal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};