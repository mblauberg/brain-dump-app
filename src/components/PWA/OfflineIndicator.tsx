import React, { useState, useEffect } from 'react';
import { WifiIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowIndicator(true);
      // Hide the "back online" message after 3 seconds
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show indicator initially if offline
    if (!navigator.onLine) {
      setShowIndicator(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showIndicator) {
    return null;
  }

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
      showIndicator ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg ${
        isOnline 
          ? 'bg-green-500 text-white' 
          : 'bg-yellow-500 text-white'
      }`}>
        {isOnline ? (
          <>
            <WifiIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Back online! 🎉</span>
          </>
        ) : (
          <>
            <ExclamationTriangleIcon className="w-4 h-4" />
            <span className="text-sm font-medium">You're offline - changes saved locally</span>
          </>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;