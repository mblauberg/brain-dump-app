import React, { useState, useCallback } from 'react';
import ScrollLayout from './components/Layout/ScrollLayout';
import InstallPrompt from './components/PWA/InstallPrompt';
import OfflineIndicator from './components/PWA/OfflineIndicator';
import SkipLinks from './components/Accessibility/SkipLinks';
import { useAppStore } from './stores/useAppStore';
import './styles/accessibility.css';

function App() {
  const [energyLevel, setEnergyLevel] = useState<'high' | 'medium' | 'low'>('medium');
  const [cognitiveLoad, setCognitiveLoad] = useState<'minimal' | 'standard' | 'detailed'>('standard');
  const { brainDumpEntries, tasks, habits } = useAppStore();

  // Enhanced energy level detection based on time, activity, and user patterns
  const detectEnergyLevel = useCallback(() => {
    const hour = new Date().getHours();
    const dayOfWeek = new Date().getDay();
    
    // Base time-based energy detection
    let baseEnergy: 'high' | 'medium' | 'low' = 'medium';
    
    if (hour >= 9 && hour <= 11) {
      baseEnergy = 'high'; // Morning peak
    } else if (hour >= 14 && hour <= 16) {
      baseEnergy = 'high'; // Afternoon peak
    } else if (hour >= 22 || hour <= 6) {
      baseEnergy = 'low'; // Night/early morning
    } else if (hour >= 12 && hour <= 14) {
      baseEnergy = 'low'; // Lunch dip
    }
    
    // Adjust based on user activity patterns
    const recentActivity = brainDumpEntries.slice(-5); // Last 5 brain dumps
    const recentTaskCompletions = tasks.filter(t => 
      t.status === 'completed' && 
      new Date(t.updatedAt).getTime() > Date.now() - 24 * 60 * 60 * 1000
    ).length;
    
    // If user has been very active recently, they might be in high energy
    if (recentActivity.length > 2 || recentTaskCompletions > 3) {
      if (baseEnergy === 'medium') baseEnergy = 'high';
    }
    
    // Weekend mornings might be lower energy
    if ((dayOfWeek === 0 || dayOfWeek === 6) && hour < 10) {
      if (baseEnergy === 'high') baseEnergy = 'medium';
    }
    
    return baseEnergy;
  }, [brainDumpEntries, tasks]);

  // Detect cognitive load preference based on user behavior
  const detectCognitiveLoad = useCallback(() => {
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const activeHabits = habits.filter(h => h.isActive).length;
    
    // Users with many completed tasks might prefer detailed view
    if (completedTasks > 10 && activeHabits > 5) {
      return 'detailed';
    }
    
    // New users or those with few items might prefer minimal
    if (completedTasks < 3 && activeHabits < 3 && brainDumpEntries.length < 2) {
      return 'minimal';
    }
    
    return 'standard';
  }, [tasks, habits, brainDumpEntries]);

  // Update energy level and cognitive load based on user patterns
  React.useEffect(() => {
    const updateLevels = () => {
      setEnergyLevel(detectEnergyLevel());
      setCognitiveLoad(detectCognitiveLoad());
    };
    
    updateLevels();
    
    // Update every 30 minutes
    const interval = setInterval(updateLevels, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [detectEnergyLevel, detectCognitiveLoad]);

  return (
    <>
      <SkipLinks />
      
      <ScrollLayout
        energyLevel={energyLevel}
        cognitiveLoad={cognitiveLoad}
      />

      <InstallPrompt />
      <OfflineIndicator />
    </>
  );
}

export default App;
