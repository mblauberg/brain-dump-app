import React from 'react';
import { clsx } from 'clsx';
import GlassContainer, { GlassContainerProps } from './GlassContainer';

interface GlassCardProps extends Omit<GlassContainerProps, 'children'> {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  isClickable?: boolean;
  isSelected?: boolean;
  progressiveDisclosure?: boolean;
  expandedContent?: React.ReactNode;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  title,
  subtitle,
  actions,
  onClick,
  onKeyDown,
  isClickable = false,
  isSelected = false,
  progressiveDisclosure = false,
  expandedContent,
  isExpanded = false,
  onToggleExpanded,
  className,
  ...containerProps
}) => {
  const handleClick = () => {
    if (isClickable && onClick) {
      onClick();
    }
    if (progressiveDisclosure && onToggleExpanded) {
      onToggleExpanded();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
    
    // Handle Enter and Space for accessibility
    if ((e.key === 'Enter' || e.key === ' ') && (isClickable || progressiveDisclosure)) {
      e.preventDefault();
      handleClick();
    }
  };

  const cardClasses = clsx(
    'group',
    {
      // Interactive states
      'cursor-pointer hover:scale-[1.02] active:scale-[0.98]': isClickable || progressiveDisclosure,
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2': isClickable || progressiveDisclosure,
      
      // Selection state
      'ring-2 ring-primary-400 ring-opacity-70 bg-primary-50/30': isSelected,
      
      // Hover effects for glass
      'hover:bg-glass-white-light hover:shadow-glass-xl': isClickable,
      
      // Progressive disclosure
      'transition-all duration-300': progressiveDisclosure,
    },
    className
  );

  const headerClasses = clsx(
    'flex items-start justify-between',
    {
      'mb-4': title || subtitle,
      'mb-2': !title && !subtitle && actions,
    }
  );

  return (
    <GlassContainer
      {...containerProps}
      className={cardClasses}
      role={isClickable ? 'button' : 'article'}
      tabIndex={isClickable || progressiveDisclosure ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-expanded={progressiveDisclosure ? isExpanded : undefined}
      aria-pressed={isSelected ? 'true' : undefined}
    >
      {/* Card Header */}
      {(title || subtitle || actions) && (
        <div className={headerClasses}>
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {subtitle}
              </p>
            )}
          </div>
          
          {actions && (
            <div className="ml-4 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Progressive Disclosure Content */}
      {progressiveDisclosure && expandedContent && (
        <div
          className={clsx(
            'mt-4 pt-4 border-t border-white/20 transition-all duration-300',
            {
              'opacity-100 max-h-96 overflow-auto': isExpanded,
              'opacity-0 max-h-0 overflow-hidden': !isExpanded,
            }
          )}
          aria-hidden={!isExpanded}
        >
          {expandedContent}
        </div>
      )}

      {/* Progressive Disclosure Indicator */}
      {progressiveDisclosure && (
        <div className="flex justify-center mt-4">
          <div
            className={clsx(
              'w-6 h-1 bg-white/40 rounded-full transition-all duration-300',
              {
                'bg-primary-400': isExpanded,
              }
            )}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Screen Reader Helpers */}
      {isClickable && (
        <span className="sr-only">
          {isSelected ? 'Selected' : 'Click to select'}
        </span>
      )}
      
      {progressiveDisclosure && (
        <span className="sr-only">
          {isExpanded ? 'Expanded, press to collapse' : 'Collapsed, press to expand'}
        </span>
      )}
    </GlassContainer>
  );
};

export default GlassCard;