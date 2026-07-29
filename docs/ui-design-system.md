# UI Design System & Architecture

## Executive Summary

This document outlines the modern UI/UX design approach for the Brain Dump Organiser, incorporating glass morphism design principles, 2025 accessibility standards, and cognitive load reduction. The system transforms from multi-page navigation into a scroll-based, brain-dump-centric experience.

## Design Philosophy

### Core Principles

1. **Minimal Cognitive Load**: Clean, uncluttered interface prioritizing essential information
2. **Visual Hierarchy**: Clear organization with progressive disclosure
3. **Immediate Feedback**: Instant responses to user actions
4. **Energy-Aware UI**: Adaptive complexity based on user state
5. **Accessibility First**: WCAG 2.1 AA compliance as baseline

### Accessibility & Inclusive Design

- WCAG 2.1 AA compliance as baseline requirement
- Customizable text size, contrast, and display modes
- Multiple interaction methods (keyboard, voice, gesture)
- Accessible fonts (Arial, Verdana) with proper spacing
- Reduced motion support for animations

## Layout Architecture

### Brain-Dump-Centric Navigation

Transform from multi-page app to single-scroll experience:

```
┌─ Floating Header (Glass) ─────────────────────────┐
├─ Quick Actions ─────────┬─ Context Menu ─────────┤
├─ Brain Dump Central ────┴─ AI Processing Status ─┤
├─ ↓ Scroll Sections ─────────────────────────────┤
├─ Recent Tasks (Condensed View) ─────────────────┤
├─ Today's Habits (Progress Indicators) ──────────┤
├─ Sleep Insights (Minimal Display) ──────────────┤
├─ Upcoming Calendar (Smart Preview) ─────────────┤
└─ Settings Panel (Collapsible) ──────────────────┘
```

### Navigation Advantages

- **Flow Preservation**: No tab switching breaks context
- **Reduced Context Switching**: Holistic task management view
- **Information Architecture**: Unified display prevents silos
- **Minimal Interruptions**: No modal-driven workflows
- **Scroll Position Memory**: Return to exact location after interactions

## Glass Morphism Component System

### Core Glass Components

#### GlassContainer

```typescript
interface GlassContainerProps {
  variant: 'light' | 'medium' | 'heavy';
  cognitiveLoad: 'minimal' | 'standard' | 'detailed';
  energyLevel: 'high' | 'medium' | 'low';
  elevation: 'flat' | 'floating' | 'elevated';
}
```

**Design Tokens:**
```typescript
const glassTokens = {
  opacity: {
    light: 'bg-white/90',
    medium: 'bg-white/70',
    heavy: 'bg-white/50'
  },
  blur: {
    subtle: 'backdrop-blur-sm',
    moderate: 'backdrop-blur-md',
    intense: 'backdrop-blur-lg'
  },
  borders: {
    glass: 'border border-white/20',
    emphasized: 'border border-white/40',
    strong: 'border border-white/60'
  },
  shadows: {
    glass: '0 8px 32px rgba(0, 0, 0, 0.12)',
    floating: '0 20px 40px rgba(0, 0, 0, 0.15)',
    elevated: '0 32px 64px rgba(0, 0, 0, 0.20)'
  }
}
```

#### ProgressiveDisclosure Components

Information hierarchy allows users to drill down:
- **Minimal**: Title + Priority badge
- **Standard**: + Category + Time estimate
- **Detailed**: + Description + All metadata

#### Adaptive Input Components

```typescript
interface GlassInputProps {
  variant: 'floating' | 'filled' | 'outlined';
  adaptiveLabeling: boolean;
  focusGlow: boolean;
  cognitiveHints: boolean;
}
```

## Styling Framework

### Tailwind CSS Configuration

Key extensions for glass morphism and adaptive design:

```javascript
module.exports = {
  theme: {
    extend: {
      // Glass morphism utilities
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px'
      },

      // Energy-based color system
      colors: {
        energy: {
          high: {
            50: '#fef7f0',
            500: '#f97316',
            900: '#9a3412'
          },
          medium: {
            50: '#f0f9ff',
            500: '#3b82f6',
            900: '#1e3a8a'
          },
          low: {
            50: '#f0fdf4',
            500: '#22c55e',
            900: '#14532d'
          }
        }
      },

      // Cognitive load-optimized spacing
      spacing: {
        '18': '4.5rem',  // 72px - optimal touch target
        '22': '5.5rem',  // 88px - comfortable spacing
        '26': '6.5rem',  // 104px - section separation
      },

      // Adaptive animations
      animation: {
        'glass-shimmer': 'glass-shimmer 3s ease-in-out infinite',
        'gentle-pulse': 'gentle-pulse 2s ease-in-out infinite',
        'energy-glow': 'energy-glow 1.5s ease-in-out infinite alternate'
      }
    }
  }
}
```

### CSS Custom Properties for Dynamic Theming

```css
:root {
  /* Glass morphism variables */
  --glass-opacity: 0.8;
  --glass-blur: 10px;
  --glass-border: rgba(255, 255, 255, 0.2);

  /* Cognitive load variables */
  --cognitive-spacing: 1.5rem;
  --focus-intensity: 0.7;

  /* Energy-adaptive variables */
  --energy-high-opacity: 1;
  --energy-medium-opacity: 0.8;
  --energy-low-opacity: 0.6;
}

/* Dynamic theme adaptation */
[data-energy="high"] {
  --glass-opacity: 0.9;
  --cognitive-spacing: 1rem;
  --focus-intensity: 1;
}

[data-energy="low"] {
  --glass-opacity: 0.7;
  --cognitive-spacing: 2rem;
  --focus-intensity: 0.5;
}
```

## Component Specifications

### ScrollSection

Collapsible section with adaptive height:
- Lazy loading for performance
- Customizable cognitive weight
- Contextual ordering based on user state
- Smooth expand/collapse animations

### FloatingActionSystem

Context-aware action buttons:
- **Morning**: Focus on habit tracking and energy assessment
- **Midday**: Task completion and brain dump processing
- **Evening**: Reflection, sleep routine, next-day planning
- Adaptive positioning (fixed, sticky, or contextual)

### ProgressiveTaskCard

Display tasks with optional detail levels:
- Selection checkbox with visual feedback
- Priority badge with color coding
- Category and time estimate
- Expandable description and metadata
- Energy-level indicators

## Color System

### Energy Level Indicators

| Energy | Primary | Secondary | Background |
|--------|---------|-----------|------------|
| High   | Orange  | Red       | Orange-50  |
| Medium | Blue    | Purple    | Blue-50    |
| Low    | Green   | Emerald   | Green-50   |

### Semantic Colors

- **Success**: Green (task completion, habits achieved)
- **Warning**: Yellow (approaching deadlines, low sleep)
- **Error**: Red (failed actions, urgent issues)
- **Info**: Blue (notifications, upcoming events)

## Typography

### Font Specifications

- **Primary**: System fonts (-apple-system, Segoe UI, Roboto)
- **Fallback**: Arial, sans-serif
- **Accessible**: Proper line height (1.5+), adequate spacing
- **Responsive**: Scale based on device capabilities

### Heading Hierarchy

- **H1**: Main page/section title (24-32px)
- **H2**: Subsection titles (18-24px)
- **H3**: Component headers (16-18px)
- **Body**: Content text (14-16px)
- **Small**: Secondary text, labels (12-14px)

## Responsive Design

### Breakpoints

- **Mobile**: 320px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px+

### Approach

- Mobile-first design
- Progressive enhancement
- Touch-friendly targets (minimum 44x44px)
- Flexible layouts using CSS Grid and Flexbox

## Motion & Animation

### Principles

- Purposeful animations only
- Respect `prefers-reduced-motion`
- Smooth, natural transitions (200-300ms)
- Performance-optimized (use transform, opacity)

### Standard Animations

- **Fade**: 200ms ease-in-out
- **Slide**: 300ms ease-out
- **Scale**: 250ms ease-in-out
- **Pulse**: 2s ease-in-out infinite

## Dark Mode

### Implementation

- CSS custom properties for theme-aware colors
- `prefers-color-scheme` media query support
- User-selectable theme toggle
- Consistent contrast ratios in both modes

### Dark Tokens

```css
@media (prefers-color-scheme: dark) {
  :root {
    --glass-opacity: 0.95;
    --background: #111827;
    --surface: #1f2937;
    --text-primary: #f3f4f6;
    --text-secondary: #d1d5db;
  }
}
```

## Performance Considerations

### Loading Strategy

- Critical content: Inline, above-the-fold
- Important content: Lazy-load on visibility
- Non-critical content: Deferred loading
- Images: Responsive srcset with WebP support

### Optimization Techniques

- CSS-in-JS minimization
- Component code splitting
- Asset compression (gzip, brotli)
- CDN delivery for static assets

## Accessibility Checklist

- [ ] WCAG 2.1 AA compliance verified
- [ ] Color contrast ratios meet 4.5:1 minimum
- [ ] Focus indicators clearly visible
- [ ] Keyboard navigation fully functional
- [ ] ARIA labels present for interactive elements
- [ ] Form inputs properly associated with labels
- [ ] Error messages clear and actionable
- [ ] Animation respects prefers-reduced-motion

## Future Enhancements

1. **Advanced Glass Effects**: Specular highlights, real-time rendering
2. **Predictive UI**: Anticipate user actions based on patterns
3. **Voice Integration**: Voice input and audio feedback
4. **Haptic Feedback**: Tactile responses for mobile devices
5. **Customizable Themes**: User-defined color schemes

---

**Document Version**: 1.0
**Last Updated**: July 2026
**Framework**: React 19 + TypeScript + Tailwind CSS
