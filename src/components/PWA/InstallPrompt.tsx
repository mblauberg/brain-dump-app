import React, { useState, useEffect } from 'react';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      // Handle test environment where matchMedia might not be available
      if (typeof window.matchMedia === 'function') {
        const mediaQuery = window.matchMedia('(display-mode: standalone)');
        if (mediaQuery && mediaQuery.matches) {
          setIsInstalled(true);
          return;
        }
      }
      
      if (window.navigator && 'standalone' in window.navigator && (window.navigator as any).standalone) {
        setIsInstalled(true);
        return;
      }
    };

    checkIfInstalled();

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      
      // Show install prompt after a delay (don't be too aggressive)
      setTimeout(() => {
        if (!localStorage.getItem('pwa-install-dismissed')) {
          setIsVisible(true);
        }
      }, 10000); // Show after 10 seconds
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
        localStorage.setItem('pwa-install-dismissed', 'true');
      }
      
      setDeferredPrompt(null);
      setIsVisible(false);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!isVisible || isInstalled || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <ArrowDownTrayIcon className="w-5 h-5 text-primary-600" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            Install Brain Organiser
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            Get quick access to your tasks, habits, and schedules. Works offline and syncs when you're back online!
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-primary-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Install App
            </button>
            <button
              onClick={handleDismiss}
              className="px-2 py-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* ADHD-friendly benefits */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
            Works offline
          </div>
          <div className="flex items-center">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
            Faster access
          </div>
          <div className="flex items-center">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1"></span>
            Less distractions
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;