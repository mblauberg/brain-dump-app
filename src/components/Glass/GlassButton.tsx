import React from 'react';
import { clsx } from 'clsx';

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  energyLevel?: 'high' | 'medium' | 'low';
  glassEffect?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  cognitiveWeight?: 'light' | 'medium' | 'heavy';
}

const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  energyLevel = 'medium',
  glassEffect = true,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  cognitiveWeight = 'medium',
  className,
  disabled,
  ...props
}) => {
  // Base button classes
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium rounded-lg',
    'transition-all duration-200 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'relative overflow-hidden',
  ];

  // Size variants
  const sizeClasses = {
    sm: ['px-3 py-2 text-sm', 'min-h-[2.25rem]'], // 36px min height
    md: ['px-4 py-2.5 text-sm', 'min-h-[2.75rem]'], // 44px min height - ADHD friendly
    lg: ['px-6 py-3 text-base', 'min-h-[3rem]'], // 48px min height
    xl: ['px-8 py-4 text-lg', 'min-h-[3.5rem]'], // 56px min height
  };

  // Glass effect variants
  const glassVariants = {
    primary: glassEffect ? [
      'bg-blue-600/90 hover:bg-blue-700/95',
      'text-white font-semibold',
      'border border-blue-500/40',
      'backdrop-blur-md',
      'shadow-lg hover:shadow-xl',
      'focus:ring-2 focus:ring-blue-500',
    ] : [
      'bg-blue-600 hover:bg-blue-700',
      'text-white font-semibold',
      'shadow-sm hover:shadow-md',
      'focus:ring-2 focus:ring-blue-500',
    ],
    
    secondary: glassEffect ? [
      'bg-gray-100/70 hover:bg-gray-200/80',
      'text-gray-900',
      'border border-gray-300/40',
      'backdrop-blur-sm',
      'shadow-md hover:shadow-lg',
      'focus:ring-2 focus:ring-gray-500',
    ] : [
      'bg-gray-200 hover:bg-gray-300',
      'text-gray-900',
      'shadow-sm hover:shadow-md',
      'focus:ring-2 focus:ring-gray-500',
    ],
    
    ghost: glassEffect ? [
      'bg-white/10 hover:bg-white/20',
      'text-gray-700 hover:text-gray-900',
      'border border-white/20 hover:border-white/30',
      'backdrop-blur-sm',
      'shadow-none hover:shadow-md',
      'focus:ring-2 focus:ring-blue-500',
    ] : [
      'bg-transparent hover:bg-gray-100',
      'text-gray-700 hover:text-gray-900',
      'border border-transparent',
      'focus:ring-2 focus:ring-gray-500',
    ],
    
    danger: glassEffect ? [
      'bg-red-500/80 hover:bg-red-600/90',
      'text-white',
      'border border-red-400/30',
      'backdrop-blur-md',
      'shadow-lg hover:shadow-xl',
      'focus:ring-2 focus:ring-red-500',
    ] : [
      'bg-red-600 hover:bg-red-700',
      'text-white',
      'shadow-sm hover:shadow-md',
      'focus:ring-2 focus:ring-red-500',
    ],
  };

  // Energy level adaptations
  const energyClasses = {
    high: [
      'hover:scale-105 active:scale-95',
      'hover:brightness-110',
      'transform-gpu',
    ],
    medium: [
      'hover:scale-[1.02] active:scale-[0.98]',
      'hover:brightness-105',
    ],
    low: [
      'hover:brightness-105',
      'transition-transform duration-300',
    ],
  };

  // Cognitive weight adaptations
  const cognitiveClasses = {
    light: ['font-normal'],
    medium: ['font-medium'],
    heavy: ['font-semibold'],
  };

  // Combine all classes
  const buttonClasses = clsx(
    baseClasses,
    sizeClasses[size],
    glassVariants[variant],
    energyClasses[energyLevel],
    cognitiveClasses[cognitiveWeight],
    {
      'w-full': fullWidth,
      'opacity-50 cursor-not-allowed': disabled || loading,
      'animate-gentle-pulse': loading,
    },
    className
  );

  // Icon spacing classes
  const iconClasses = {
    left: icon ? 'mr-2' : '',
    right: icon ? 'ml-2' : '',
  };

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      data-variant={variant}
      data-energy-level={energyLevel}
      data-cognitive-weight={cognitiveWeight}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Button Content */}
      <span className={clsx('flex items-center', { 'opacity-0': loading })}>
        {icon && iconPosition === 'left' && (
          <span className={iconClasses.left} aria-hidden="true">
            {icon}
          </span>
        )}
        
        <span>{children}</span>
        
        {icon && iconPosition === 'right' && (
          <span className={iconClasses.right} aria-hidden="true">
            {icon}
          </span>
        )}
      </span>

      {/* Glass shimmer effect on hover for high energy */}
      {glassEffect && energyLevel === 'high' && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white to-transparent animate-glass-shimmer" />
      )}
    </button>
  );
};

export default GlassButton;