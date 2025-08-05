import React, { useState } from 'react';
import { SparklesIcon, BoltIcon, HeartIcon } from '@heroicons/react/24/outline';
import { GlassContainer, GlassCard, GlassButton, GlassInput } from './index';

const GlassDemo: React.FC = () => {
  const [energyLevel, setEnergyLevel] = useState<'high' | 'medium' | 'low'>('medium');
  const [cognitiveLoad, setCognitiveLoad] = useState<'minimal' | 'standard' | 'detailed'>('standard');
  const [inputValue, setInputValue] = useState('');
  const [isCardExpanded, setIsCardExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Demo Header */}
        <GlassContainer 
          variant="light" 
          cognitiveLoad="minimal"
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Glass Morphism Component Library
          </h1>
          <p className="text-gray-600">
            ADHD-optimized components with adaptive energy levels and cognitive load management
          </p>
        </GlassContainer>

        {/* Controls */}
        <GlassContainer variant="medium" cognitiveLoad="standard">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Energy Level
              </label>
              <div className="flex space-x-2">
                {(['high', 'medium', 'low'] as const).map((level) => (
                  <GlassButton
                    key={level}
                    variant={energyLevel === level ? 'primary' : 'secondary'}
                    size="sm"
                    energyLevel={level}
                    onClick={() => setEnergyLevel(level)}
                    icon={
                      level === 'high' ? <BoltIcon className="w-4 h-4" /> :
                      level === 'medium' ? <SparklesIcon className="w-4 h-4" /> :
                      <HeartIcon className="w-4 h-4" />
                    }
                  >
                    {level}
                  </GlassButton>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cognitive Load
              </label>
              <div className="flex space-x-2">
                {(['minimal', 'standard', 'detailed'] as const).map((load) => (
                  <GlassButton
                    key={load}
                    variant={cognitiveLoad === load ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setCognitiveLoad(load)}
                  >
                    {load}
                  </GlassButton>
                ))}
              </div>
            </div>
          </div>
        </GlassContainer>

        {/* Glass Input Demo */}
        <GlassContainer 
          variant="medium" 
          cognitiveLoad={cognitiveLoad}
          energyLevel={energyLevel}
        >
          <h2 className="text-xl font-semibold mb-4">Glass Input Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassInput
              label="Brain Dump Input"
              placeholder="What's on your mind?"
              variant="floating"
              glassEffect={true}
              energyLevel={energyLevel}
              cognitiveHints={true}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              leftIcon={<SparklesIcon className="w-5 h-5" />}
            />

            <GlassInput
              label="Standard Input"
              placeholder="Enter some text..."
              variant="filled"
              glassEffect={true}
              energyLevel={energyLevel}
              hint="This is a helpful hint for ADHD users"
            />
          </div>
        </GlassContainer>

        {/* Glass Card Demo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard
            variant="light"
            cognitiveLoad={cognitiveLoad}
            energyLevel={energyLevel}
            title="Simple Glass Card"
            subtitle="This card demonstrates basic glass morphism effects"
            actions={
              <GlassButton variant="ghost" size="sm">
                Action
              </GlassButton>
            }
          >
            <p className="text-gray-700">
              This is the main content of the card. The glass effect adapts to your energy level 
              and cognitive load settings.
            </p>
          </GlassCard>

          <GlassCard
            variant="heavy"
            cognitiveLoad={cognitiveLoad}
            energyLevel={energyLevel}
            title="Progressive Disclosure Card"
            subtitle="Click to expand and see more content"
            progressiveDisclosure={true}
            isExpanded={isCardExpanded}
            onToggleExpanded={() => setIsCardExpanded(!isCardExpanded)}
            expandedContent={
              <div className="space-y-3">
                <p className="text-gray-700">
                  This is additional content that was hidden to reduce cognitive load.
                </p>
                <p className="text-gray-600 text-sm">
                  Progressive disclosure helps ADHD users by showing only essential information initially.
                </p>
              </div>
            }
          >
            <p className="text-gray-700">
              This card uses progressive disclosure to manage information complexity.
            </p>
          </GlassCard>
        </div>

        {/* Button Variants */}
        <GlassContainer 
          variant="medium" 
          cognitiveLoad={cognitiveLoad}
          energyLevel={energyLevel}
        >
          <h2 className="text-xl font-semibold mb-4">Glass Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <GlassButton 
              variant="primary" 
              energyLevel={energyLevel}
              icon={<SparklesIcon className="w-5 h-5" />}
            >
              Primary Button
            </GlassButton>
            
            <GlassButton 
              variant="secondary" 
              energyLevel={energyLevel}
              size="lg"
            >
              Secondary Large
            </GlassButton>
            
            <GlassButton 
              variant="ghost" 
              energyLevel={energyLevel}
              size="sm"
            >
              Ghost Small
            </GlassButton>
            
            <GlassButton 
              variant="danger" 
              energyLevel={energyLevel}
              cognitiveWeight="heavy"
            >
              Danger Action
            </GlassButton>
          </div>
        </GlassContainer>

        {/* Accessibility Info */}
        <GlassContainer variant="light" cognitiveLoad="minimal">
          <h2 className="text-lg font-semibold mb-3">Accessibility Features</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• High contrast mode automatically disables glass effects</li>
            <li>• Reduced motion respects user preferences</li>
            <li>• Energy levels adapt visual intensity</li>
            <li>• Cognitive load controls information density</li>
            <li>• Full keyboard navigation support</li>
            <li>• Screen reader optimized</li>
          </ul>
        </GlassContainer>

        {/* Current Settings Display */}
        <div className="text-center text-sm text-gray-500">
          Current: Energy Level <strong>{energyLevel}</strong> | 
          Cognitive Load <strong>{cognitiveLoad}</strong>
        </div>
      </div>
    </div>
  );
};

export default GlassDemo;