import React from 'react';

const SkipLinks: React.FC = () => {
  return (
    <div className="skip-links">
      <a 
        href="#main-content" 
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-lg z-50 font-medium"
      >
        Skip to main content
      </a>
      <a 
        href="#navigation" 
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 bg-primary-600 text-white px-4 py-2 rounded-lg z-50 font-medium"
      >
        Skip to navigation
      </a>
    </div>
  );
};

export default SkipLinks;