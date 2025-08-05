import React, { useState, useRef, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { GlassContainer, GlassButton } from '../Glass';

interface ScrollSectionProps {
  id: string;
  title: string;
  emoji?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  collapsible?: boolean;
  initiallyExpanded?: boolean;
  cognitiveWeight?: 'light' | 'medium' | 'heavy';
  energyLevel?: 'high' | 'medium' | 'low';
  adaptiveHeight?: boolean;
  lazyLoad?: boolean;
  onVisibilityChange?: (isVisible: boolean) => void;
  className?: string;
}

const ScrollSection: React.FC<ScrollSectionProps> = ({
  id,
  title,
  emoji,
  icon,
  children,
  collapsible = false,
  initiallyExpanded = true,
  cognitiveWeight = 'medium',
  energyLevel = 'medium',
  adaptiveHeight = true,
  lazyLoad = false,
  onVisibilityChange,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [isVisible, setIsVisible] = useState(!lazyLoad);
  const [hasBeenVisible, setHasBeenVisible] = useState(!lazyLoad);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer for lazy loading and visibility tracking
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const visible = entry.isIntersecting;
          setIsVisible(visible);
          
          if (visible && !hasBeenVisible) {
            setHasBeenVisible(true);
          }
          
          onVisibilityChange?.(visible);
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [hasBeenVisible, onVisibilityChange]);

  // Cognitive weight mappings
  const cognitiveClasses = {
    light: {
      container: 'py-6',
      spacing: 'space-y-4',
      variant: 'light' as const,
    },
    medium: {
      container: 'py-8',
      spacing: 'space-y-6',
      variant: 'medium' as const,
    },
    heavy: {
      container: 'py-10',
      spacing: 'space-y-8',
      variant: 'heavy' as const,
    },
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const shouldRenderContent = hasBeenVisible || !lazyLoad;

  return (
    <section
      ref={sectionRef}
      id={`section-${id}`}
      className={`scroll-mt-24 ${className || ''}`}
      data-section={id}
      data-cognitive-weight={cognitiveWeight}
      data-energy-level={energyLevel}
      aria-labelledby={`section-${id}-title`}
    >
      <GlassContainer
        variant={cognitiveClasses[cognitiveWeight].variant}
        cognitiveLoad={cognitiveWeight === 'light' ? 'minimal' : cognitiveWeight === 'heavy' ? 'detailed' : 'standard'}
        energyLevel={energyLevel}
        adaptiveOpacity={true}
        elevation="floating"
        className={`${cognitiveClasses[cognitiveWeight].container} transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-2'
        }`}
      >
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {icon ? (
              React.createElement(icon, { 
                className: "w-8 h-8 text-primary-600"
              })
            ) : emoji ? (
              <span className="text-2xl" aria-hidden="true">
                {emoji}
              </span>
            ) : null}
            <div>
              <h2 
                id={`section-${id}-title`}
                className="text-2xl font-bold text-gray-900"
              >
                {title}
              </h2>
              <div className="mt-1 h-0.5 bg-gradient-to-r from-primary-400 to-transparent w-16 rounded-full" />
            </div>
          </div>

          {/* Collapse/Expand Button */}
          {collapsible && (
            <GlassButton
              variant="ghost"
              size="sm"
              energyLevel={energyLevel}
              onClick={handleToggle}
              aria-expanded={isExpanded}
              aria-controls={`section-${id}-content`}
              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title} section`}
            >
              {isExpanded ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </GlassButton>
          )}
        </div>

        {/* Section Content */}
        <div
          id={`section-${id}-content`}
          className={`transition-all duration-300 ease-out ${
            collapsible
              ? isExpanded
                ? `opacity-100 ${
                    adaptiveHeight ? 'max-h-none' : 'max-h-96 overflow-auto'
                  }`
                : 'opacity-0 max-h-0 overflow-hidden'
              : 'opacity-100'
          }`}
          aria-hidden={collapsible && !isExpanded}
        >
          <div className={cognitiveClasses[cognitiveWeight].spacing}>
            {shouldRenderContent ? children : (
              /* Loading placeholder for lazy-loaded content */
              <div className="animate-gentle-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            )}
          </div>
        </div>

        {/* Section Status Indicator */}
        {collapsible && (
          <div className="mt-4 flex justify-center">
            <div
              className={`w-8 h-1 rounded-full transition-all duration-300 ${
                isExpanded
                  ? 'bg-primary-400'
                  : 'bg-gray-300'
              }`}
              aria-hidden="true"
            />
          </div>
        )}
      </GlassContainer>

      {/* Screen Reader Context */}
      <div className="sr-only">
        Section: {title}
        {collapsible && ` - ${isExpanded ? 'Expanded' : 'Collapsed'}`}
        {lazyLoad && !hasBeenVisible && ' - Content loading...'}
      </div>
    </section>
  );
};

export default ScrollSection;