/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      // Enhanced backdrop blur utilities for glass effects
      backdropBlur: {
        'xs': '2px',
        'sm': '4px', 
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px'
      },

      // ADHD-optimized spacing system
      spacing: {
        '18': '4.5rem',  // 72px - optimal touch target
        '22': '5.5rem',  // 88px - comfortable spacing
        '26': '6.5rem',  // 104px - section separation
        '30': '7.5rem',  // 120px - major section breaks
      },

      colors: {
        // Existing color system
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },

        // Energy-based color system for ADHD optimization
        energy: {
          high: {
            50: '#fef7f0',
            100: '#feecd0',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
          },
          medium: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
          },
          low: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          }
        },

        // Glass morphism background colors
        glass: {
          'white-light': 'rgba(255, 255, 255, 0.9)',
          'white-medium': 'rgba(255, 255, 255, 0.7)',
          'white-heavy': 'rgba(255, 255, 255, 0.5)',
          'dark-light': 'rgba(17, 24, 39, 0.9)',
          'dark-medium': 'rgba(17, 24, 39, 0.7)',
          'dark-heavy': 'rgba(17, 24, 39, 0.5)',
          'primary-light': 'rgba(14, 165, 233, 0.1)',
          'primary-medium': 'rgba(14, 165, 233, 0.2)',
          'primary-heavy': 'rgba(14, 165, 233, 0.3)',
        }
      },

      // Glass morphism box shadows
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glass-lg': '0 20px 40px rgba(0, 0, 0, 0.15)',
        'glass-xl': '0 32px 64px rgba(0, 0, 0, 0.20)',
        'energy-glow': '0 0 20px rgba(14, 165, 233, 0.3)',
        'focus-glow': '0 0 0 3px rgba(59, 130, 246, 0.5)',
      },

      // ADHD-friendly animations
      animation: {
        'glass-shimmer': 'glass-shimmer 3s ease-in-out infinite',
        'gentle-pulse': 'gentle-pulse 2s ease-in-out infinite',
        'energy-glow': 'energy-glow 1.5s ease-in-out infinite alternate',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },

      keyframes: {
        'glass-shimmer': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'gentle-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'energy-glow': {
          '0%': { boxShadow: '0 0 5px rgba(14, 165, 233, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.4)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    
    // Custom glass morphism plugin
    function({ addUtilities, theme }) {
      const glassUtilities = {
        '.glass-morphism': {
          'backdrop-filter': 'blur(10px) saturate(150%)',
          'background-color': 'rgba(255, 255, 255, 0.8)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
          'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
        '.glass-morphism-light': {
          'backdrop-filter': 'blur(6px) saturate(120%)',
          'background-color': 'rgba(255, 255, 255, 0.9)',
          'border': '1px solid rgba(255, 255, 255, 0.3)',
          'box-shadow': '0 4px 16px rgba(0, 0, 0, 0.08)',
        },
        '.glass-morphism-heavy': {
          'backdrop-filter': 'blur(16px) saturate(180%)',
          'background-color': 'rgba(255, 255, 255, 0.6)',
          'border': '1px solid rgba(255, 255, 255, 0.4)',
          'box-shadow': '0 16px 48px rgba(0, 0, 0, 0.16)',
        },
        '.glass-border': {
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-border-strong': {
          'border': '1px solid rgba(255, 255, 255, 0.4)',
        },
      };
      
      addUtilities(glassUtilities);
    }
  ],
}