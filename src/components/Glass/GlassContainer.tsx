import React from 'react';
import { clsx } from 'clsx';

export interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'light' | 'medium' | 'heavy';
  cognitiveLoad?: 'minimal' | 'standard' | 'detailed';
  energyLevel?: 'high' | 'medium' | 'low';
  adaptiveOpacity?: boolean;
  elevation?: 'flat' | 'floating' | 'elevated';
  'data-testid'?: string;
}

const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  variant = 'medium',
  cognitiveLoad = 'standard',
  energyLevel = 'medium',
  adaptiveOpacity = false,
  elevation = 'floating',
  className,
  'data-testid': testId,
  ...props
}) => {
  // Base glass morphism classes
  const baseClasses = [
    'rounded-xl',
    'transition-all duration-300 ease-out',
    'will-change-transform',
  ];

  // Variant-specific glass effects
  const variantClasses = {
    light: [
      'glass-morphism-light',
      'bg-glass-white-light',
      'backdrop-blur-sm',
      'border border-white/30',
      'shadow-glass',
    ],
    medium: [
      'glass-morphism',
      'bg-glass-white-medium', 
      'backdrop-blur-md',
      'border border-white/20',
      'shadow-glass-lg',
    ],
    heavy: [
      'glass-morphism-heavy',
      'bg-glass-white-heavy',
      'backdrop-blur-lg',
      'border border-white/40',
      'shadow-glass-xl',
    ],
  };

  // Cognitive load adaptations
  const cognitiveClasses = {
    minimal: ['p-4', 'space-y-2'],
    standard: ['p-6', 'space-y-4'],
    detailed: ['p-8', 'space-y-6'],
  };

  // Energy level adaptations
  const energyClasses = {
    high: adaptiveOpacity ? ['opacity-100', 'brightness-110'] : [],
    medium: adaptiveOpacity ? ['opacity-90', 'brightness-100'] : [],
    low: adaptiveOpacity ? ['opacity-80', 'brightness-95'] : [],
  };

  // Elevation effects
  const elevationClasses = {
    flat: ['shadow-sm'],
    floating: ['shadow-glass-lg', 'hover:shadow-glass-xl'],
    elevated: ['shadow-glass-xl', 'hover:shadow-glass-xl', 'transform hover:-translate-y-1'],
  };

  // Combine all classes
  const containerClasses = clsx(
    baseClasses,
    variantClasses[variant],
    cognitiveClasses[cognitiveLoad],
    energyClasses[energyLevel],
    elevationClasses[elevation],
    {
      // Adaptive opacity based on energy level
      'hover:bg-glass-white-light': adaptiveOpacity && variant === 'heavy',
      'hover:bg-glass-white-medium': adaptiveOpacity && variant === 'medium',
      
      // Focus states for accessibility
      'focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-opacity-50': true,
      'focus-within:border-primary-300': true,
    },
    className
  );

  return (
    <div
      className={containerClasses}
      data-testid={testId}
      data-variant={variant}
      data-cognitive-load={cognitiveLoad}
      data-energy-level={energyLevel}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassContainer;