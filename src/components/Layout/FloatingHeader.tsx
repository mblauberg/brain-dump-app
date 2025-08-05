import React, { useState, useEffect } from 'react';
import { 
  CpuChipIcon, 
  Bars3Icon, 
  XMarkIcon,
  BoltIcon,
  CheckCircleIcon,
  BeakerIcon,
  MoonIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { GlassContainer, GlassButton } from '../Glass';

interface FloatingHeaderProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  energyLevel?: 'high' | 'medium' | 'low';
}

const FloatingHeader: React.FC<FloatingHeaderProps> = ({
  currentSection,
  onSectionChange,
  energyLevel = 'medium'
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Track scroll position for adaptive styling
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'brain-dump', label: 'Brain Dump', icon: BeakerIcon },
    { id: 'tasks', label: 'Tasks', icon: CheckCircleIcon },
    { id: 'habits', label: 'Habits', icon: BoltIcon },
    { id: 'sleep', label: 'Sleep', icon: MoonIcon },
    { id: 'calendar', label: 'Calendar', icon: CalendarDaysIcon },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
      onSectionChange(sectionId);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main Floating Header */}
      <GlassContainer
        variant={isScrolled ? 'heavy' : 'light'}
        energyLevel={energyLevel}
        cognitiveLoad="minimal"
        className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${
          isScrolled ? 'backdrop-blur-xl' : 'backdrop-blur-md'
        }`}
        role="banner"
      >
        <div className="flex items-center justify-between py-2 px-4">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <CpuChipIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-gray-900">Brain Organiser</h1>
                <p className="text-xs text-gray-500">ADHD-Optimized</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2" role="navigation">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <GlassButton
                  key={section.id}
                  variant={currentSection === section.id ? 'primary' : 'ghost'}
                  size="sm"
                  energyLevel={energyLevel}
                  glassEffect={true}
                  onClick={() => scrollToSection(section.id)}
                  className="px-4 py-2"
                  aria-current={currentSection === section.id ? 'page' : undefined}
                >
                  <IconComponent className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span className="hidden lg:inline">{section.label}</span>
                  <span className="lg:hidden sr-only">{section.label}</span>
                </GlassButton>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center">
            <GlassButton
              variant="ghost"
              size="sm"
              energyLevel={energyLevel}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </GlassButton>
          </div>
        </div>

        {/* Current Section Indicator */}
        <div className="px-4 pb-1">
          <div className="flex items-center justify-center">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent rounded-full w-12 transition-all duration-300" />
          </div>
        </div>
      </GlassContainer>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <GlassContainer
          variant="heavy"
          energyLevel={energyLevel}
          cognitiveLoad="minimal"
          className="fixed top-24 left-4 right-4 z-40 md:hidden"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="py-4">
            <div className="grid grid-cols-2 gap-2 px-4">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <GlassButton
                    key={section.id}
                    variant={currentSection === section.id ? 'primary' : 'secondary'}
                    size="md"
                    energyLevel={energyLevel}
                    fullWidth={true}
                    onClick={() => scrollToSection(section.id)}
                    className="justify-start"
                  >
                    <IconComponent className="w-4 h-4 mr-2" aria-hidden="true" />
                    {section.label}
                  </GlassButton>
                );
              })}
            </div>
          </div>
        </GlassContainer>
      )}

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default FloatingHeader;