import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

export interface GlassInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  variant?: 'floating' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  glassEffect?: boolean;
  energyLevel?: 'high' | 'medium' | 'low';
  cognitiveHints?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  adaptiveLabeling?: boolean;
  autoResize?: boolean;
}

const GlassInput: React.FC<GlassInputProps> = ({
  label,
  error,
  success,
  hint,
  variant = 'floating',
  size = 'md',
  glassEffect = true,
  energyLevel = 'medium',
  cognitiveHints = true,
  leftIcon,
  rightIcon,
  onRightIconClick,
  adaptiveLabeling = true,
  autoResize = false,
  className,
  id,
  value,
  placeholder,
  disabled,
  required,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value));
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = id || `glass-input-${Math.random().toString(36).substr(2, 9)}`;

  // Update hasValue when value prop changes
  useEffect(() => {
    setHasValue(Boolean(value));
  }, [value]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(Boolean(e.target.value));
    if (props.onChange) {
      props.onChange(e);
    }
  };

  // Size variants
  const sizeClasses = {
    sm: {
      input: 'px-3 py-2 text-sm min-h-[2.25rem]',
      label: 'text-xs',
      icon: 'w-4 h-4',
    },
    md: {
      input: 'px-4 py-3 text-sm min-h-[2.75rem]', // 44px - ADHD friendly
      label: 'text-sm',
      icon: 'w-5 h-5',
    },
    lg: {
      input: 'px-6 py-4 text-base min-h-[3.5rem]',
      label: 'text-base',
      icon: 'w-6 h-6',
    },
  };

  // Glass effect variants
  const glassVariants = {
    floating: glassEffect ? [
      'glass-morphism-light',
      'bg-white/70 focus:bg-white/80',
      'border border-white/30 focus:border-white/50',
      'backdrop-blur-sm focus:backdrop-blur-md',
      'shadow-glass focus:shadow-glass-lg',
    ] : [
      'bg-white focus:bg-gray-50',
      'border border-gray-300 focus:border-primary-500',
      'shadow-sm focus:shadow-md',
    ],
    
    filled: glassEffect ? [
      'glass-morphism',
      'bg-gray-100/60 focus:bg-white/70',
      'border border-transparent focus:border-white/40',
      'backdrop-blur-md',
      'shadow-glass',
    ] : [
      'bg-gray-100 focus:bg-white',
      'border border-transparent focus:border-primary-500',
      'shadow-sm focus:shadow-md',
    ],
    
    outlined: glassEffect ? [
      'bg-transparent focus:glass-morphism-light',
      'border-2 border-white/40 focus:border-primary-400/60',
      'focus:backdrop-blur-sm',
      'focus:shadow-glass',
    ] : [
      'bg-transparent focus:bg-white',
      'border-2 border-gray-300 focus:border-primary-500',
      'focus:shadow-sm',
    ],
  };

  // Energy level adaptations
  const energyClasses = {
    high: [
      'transition-all duration-150',
      'focus:scale-[1.02]',
      'focus:brightness-110',
    ],
    medium: [
      'transition-all duration-200',
      'focus:scale-[1.01]',
    ],
    low: [
      'transition-all duration-300',
    ],
  };

  // State-based classes
  const stateClasses = {
    error: [
      'border-danger-400/60 focus:border-danger-500/80',
      'bg-danger-50/40 focus:bg-danger-50/60',
      'text-danger-900',
      'focus:ring-danger-500',
    ],
    success: [
      'border-success-400/60 focus:border-success-500/80',
      'bg-success-50/40 focus:bg-success-50/60',
      'text-success-900',
      'focus:ring-success-500',
    ],
    default: [
      'text-gray-900',
      'focus:ring-primary-500',
    ],
  };

  // Combine input classes
  const inputClasses = clsx(
    'w-full rounded-lg',
    'font-medium placeholder-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-opacity-50',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    sizeClasses[size].input,
    glassVariants[variant],
    energyClasses[energyLevel],
    error ? stateClasses.error : success ? stateClasses.success : stateClasses.default,
    {
      'pl-10': leftIcon && size === 'md',
      'pl-12': leftIcon && size === 'lg',
      'pl-8': leftIcon && size === 'sm',
      'pr-10': rightIcon && size === 'md',
      'pr-12': rightIcon && size === 'lg',
      'pr-8': rightIcon && size === 'sm',
    },
    className
  );

  // Label classes
  const labelClasses = clsx(
    'font-medium transition-all duration-200',
    sizeClasses[size].label,
    {
      // Floating label behavior
      'absolute left-4 pointer-events-none': variant === 'floating',
      'transform origin-left': variant === 'floating',
      'text-primary-600 -translate-y-6 scale-75': variant === 'floating' && (isFocused || hasValue),
      'text-gray-500 translate-y-0 scale-100': variant === 'floating' && !isFocused && !hasValue,
      'top-3': variant === 'floating' && size === 'md',
      'top-4': variant === 'floating' && size === 'lg',
      'top-2': variant === 'floating' && size === 'sm',
      
      // Standard label
      'block mb-2 text-gray-700': variant !== 'floating',
      
      // Required indicator
      "after:content-['*'] after:text-danger-500 after:ml-1": required,
      
      // Energy-based styling
      'text-energy-high-600': energyLevel === 'high' && (isFocused || hasValue),
      'text-energy-low-600': energyLevel === 'low' && (isFocused || hasValue),
    }
  );

  return (
    <div className="relative">
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className={labelClasses}
        >
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className={clsx(
            'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400',
            sizeClasses[size].icon,
            {
              'text-danger-500': error,
              'text-success-500': success,
              'text-primary-500': isFocused && !error && !success,
            }
          )}>
            {leftIcon}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={inputRef}
          id={inputId}
          className={inputClasses}
          value={value}
          placeholder={variant === 'floating' && adaptiveLabeling ? '' : placeholder}
          disabled={disabled}
          required={required}
          onFocus={(e) => {
            setIsFocused(true);
            if (props.onFocus) props.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (props.onBlur) props.onBlur(e);
          }}
          onChange={handleChange}
          data-variant={variant}
          data-energy-level={energyLevel}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={clsx(
            error && `${inputId}-error`,
            success && `${inputId}-success`,
            hint && `${inputId}-hint`
          )}
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className={clsx(
              'absolute right-3 top-1/2 transform -translate-y-1/2',
              'text-gray-400 hover:text-gray-600',
              'focus:outline-none focus:text-gray-600',
              sizeClasses[size].icon,
              {
                'text-danger-500 hover:text-danger-600': error,
                'text-success-500 hover:text-success-600': success,
                'cursor-pointer': onRightIconClick,
                'cursor-default': !onRightIconClick,
              }
            )}
            disabled={!onRightIconClick || disabled}
            tabIndex={onRightIconClick ? 0 : -1}
          >
            {rightIcon}
          </button>
        )}

        {/* Focus Ring Enhancement for Glass Effect */}
        {glassEffect && isFocused && (
          <div className="absolute inset-0 rounded-lg ring-2 ring-primary-500/20 ring-offset-2 ring-offset-transparent pointer-events-none" />
        )}
      </div>

      {/* Helper Text */}
      {(error || success || hint) && (
        <div className="mt-2 space-y-1">
          {error && (
            <p
              id={`${inputId}-error`}
              className="text-sm text-danger-600 font-medium"
              role="alert"
            >
              {error}
            </p>
          )}
          
          {success && !error && (
            <p
              id={`${inputId}-success`}
              className="text-sm text-success-600 font-medium"
            >
              {success}
            </p>
          )}
          
          {hint && !error && !success && (
            <p
              id={`${inputId}-hint`}
              className="text-sm text-gray-500"
            >
              {hint}
            </p>
          )}
        </div>
      )}

      {/* Cognitive Hints */}
      {cognitiveHints && isFocused && !error && !success && !hint && (
        <div className="mt-2">
          <p className="text-xs text-gray-400 italic">
            {energyLevel === 'high' && "High energy detected - take your time"}
            {energyLevel === 'medium' && "You're doing great"}
            {energyLevel === 'low' && "Low energy mode - every step counts"}
          </p>
        </div>
      )}
    </div>
  );
};

export default GlassInput;