import React, { useState, useEffect } from 'react';
import Layout from './components/Layout/Layout';
import InstallPrompt from './components/PWA/InstallPrompt';
import OfflineIndicator from './components/PWA/OfflineIndicator';
import OnboardingModal from './components/Onboarding/OnboardingModal';
import SkipLinks from './components/Accessibility/SkipLinks';
import { useAppStore } from './stores/useAppStore';
import './styles/accessibility.css';

function App() {
  const { tasks, habits } = useAppStore();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    // Show onboarding for new users
    const onboardingCompleted = localStorage.getItem('onboarding-completed');
    const hasData = tasks.length > 0 || habits.length > 0;
    
    // Show onboarding if not completed and no existing data
    if (!onboardingCompleted && !hasData) {
      setIsOnboardingOpen(true);
    }
  }, [tasks.length, habits.length]);

  return (
    <>
      <SkipLinks />
      <Layout />
      <InstallPrompt />
      <OfflineIndicator />
      <OnboardingModal 
        isOpen={isOnboardingOpen} 
        onClose={() => setIsOnboardingOpen(false)} 
      />
    </>
  );
}

export default App;
