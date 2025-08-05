import React, { useEffect, useState } from 'react';

interface LiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive';
  clearDelay?: number;
}

const LiveRegion: React.FC<LiveRegionProps> = ({ 
  message, 
  priority = 'polite', 
  clearDelay = 5000 
}) => {
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
      
      if (clearDelay > 0) {
        const timer = setTimeout(() => {
          setCurrentMessage('');
        }, clearDelay);
        
        return () => clearTimeout(timer);
      }
    }
  }, [message, clearDelay]);

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {currentMessage}
    </div>
  );
};

export default LiveRegion;