import React, { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface NotificationProps {
  message: string;
  onRemove: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(onRemove, 1000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <div className="fixed top-4 right-4 z-50 transform transition-all duration-300">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 w-96 animate-notification-slide">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 text-base font-medium leading-relaxed">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};