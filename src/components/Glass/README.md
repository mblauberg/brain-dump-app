# Glass Morphism Component Library

A modern, ADHD-optimized component library featuring Apple's Liquid Glass design principles with comprehensive accessibility support.

## 🎯 Features

- **Glass Morphism Effects**: Translucent backgrounds with backdrop blur
- **ADHD Optimization**: Energy-adaptive UI and cognitive load management
- **Full Accessibility**: WCAG 2.1 AA compliant with high contrast and reduced motion support
- **TypeScript Ready**: Complete type definitions and IntelliSense support
- **Responsive Design**: Mobile-first approach with touch-friendly interactions

## 📦 Components

### GlassContainer
The foundation component that provides glass morphism effects to any content.

```tsx
import { GlassContainer } from './components/Glass';

<GlassContainer 
  variant="medium"
  cognitiveLoad="standard"
  energyLevel="medium"
  adaptiveOpacity={true}
  elevation="floating"
>
  <p>Your content here</p>
</GlassContainer>
```

**Props:**
- `variant`: `'light' | 'medium' | 'heavy'` - Glass effect intensity
- `cognitiveLoad`: `'minimal' | 'standard' | 'detailed'` - Information density
- `energyLevel`: `'high' | 'medium' | 'low'` - Animation and visual intensity
- `adaptiveOpacity`: `boolean` - Dynamic opacity based on energy level
- `elevation`: `'flat' | 'floating' | 'elevated'` - Shadow depth

### GlassCard
Enhanced card component with progressive disclosure and interactive states.

```tsx
import { GlassCard } from './components/Glass';

<GlassCard
  title="Card Title"
  subtitle="Card description"
  variant="medium"
  progressiveDisclosure={true}
  expandedContent={<div>Additional content</div>}
  actions={<button>Action</button>}
  onClick={() => console.log('Card clicked')}
>
  <p>Main card content</p>
</GlassCard>
```

**Key Features:**
- Progressive disclosure for cognitive load management
- Interactive states with hover and focus effects
- Accessible keyboard navigation
- Customizable actions and content areas

### GlassButton
Modern button component with energy-adaptive styling and multiple variants.

```tsx
import { GlassButton } from './components/Glass';

<GlassButton
  variant="primary"
  size="md"
  energyLevel="high"
  glassEffect={true}
  loading={false}
  icon={<Icon />}
  iconPosition="left"
>
  Click me
</GlassButton>
```

**Variants:**
- `primary`: Main action button with glass effects
- `secondary`: Secondary actions with lighter glass
- `ghost`: Minimal glass with transparency
- `danger`: Warning/destructive actions

### GlassInput
Advanced input component with floating labels and adaptive feedback.

```tsx
import { GlassInput } from './components/Glass';

<GlassInput
  label="Brain Dump"
  placeholder="What's on your mind?"
  variant="floating"
  glassEffect={true}
  cognitiveHints={true}
  energyLevel="medium"
  leftIcon={<SearchIcon />}
  error="Please enter valid text"
  success="Looks good!"
  hint="This helps organize your thoughts"
/>
```

**Features:**
- Floating label animation
- Energy-based adaptive styling
- Cognitive hints for ADHD users
- Comprehensive error handling
- Glass morphism with fallbacks

## 🎨 Design System

### Glass Variants

- **Light** (`variant="light"`): 90% opacity, subtle blur
- **Medium** (`variant="medium"`): 70% opacity, moderate blur  
- **Heavy** (`variant="heavy"`): 50% opacity, intense blur

### Energy Levels

- **High** (`energyLevel="high"`): Vibrant colors, quick animations, enhanced interactivity
- **Medium** (`energyLevel="medium"`): Balanced visual intensity, standard timing
- **Low** (`energyLevel="low"`): Muted colors, slower transitions, gentle interactions

### Cognitive Load

- **Minimal** (`cognitiveLoad="minimal"`): Essential information only, maximum whitespace
- **Standard** (`cognitiveLoad="standard"`): Balanced information density
- **Detailed** (`cognitiveLoad="detailed"`): Full information display with visual hierarchy

## ♿ Accessibility

### High Contrast Mode
All glass effects automatically disable in high contrast mode, reverting to solid backgrounds with strong borders for maximum visibility.

```css
@media (prefers-contrast: high) {
  .glass-morphism {
    background-color: white !important;
    backdrop-filter: none !important;
    border: 2px solid currentColor !important;
  }
}
```

### Reduced Motion
Respects user motion preferences by disabling animations, transforms, and transitions.

```css
@media (prefers-reduced-motion: reduce) {
  .glass-morphism {
    transition: none !important;
    transform: none !important;
    animation: none !important;
  }
}
```

### Keyboard Navigation
- All interactive components support tab navigation
- Clear focus indicators with 3px blue outline
- Logical tab order and aria labels
- Screen reader optimized content

### ADHD-Specific Features
- **Focus Mode**: Simplified glass effects to reduce visual distraction
- **Energy Adaptation**: Visual intensity matches user's current energy level  
- **Cognitive Hints**: Contextual help text based on current state
- **Progressive Disclosure**: Information complexity control

## 🛠️ Implementation

### CSS Classes

The system uses Tailwind CSS with custom utilities:

```css
/* Core glass morphism utilities */
.glass-morphism         /* Standard glass effect */
.glass-morphism-light   /* Subtle glass effect */
.glass-morphism-heavy   /* Intense glass effect */

/* Background colors */
.bg-glass-white-light   /* rgba(255, 255, 255, 0.9) */
.bg-glass-white-medium  /* rgba(255, 255, 255, 0.7) */
.bg-glass-white-heavy   /* rgba(255, 255, 255, 0.5) */

/* Backdrop blur utilities */
.backdrop-blur-xs       /* 2px blur */
.backdrop-blur-sm       /* 4px blur */
.backdrop-blur-md       /* 8px blur */
.backdrop-blur-lg       /* 12px blur */
.backdrop-blur-xl       /* 16px blur */
```

### Data Attributes

Components use data attributes for styling and testing:

```html
<div 
  data-variant="medium"
  data-cognitive-load="standard" 
  data-energy-level="high"
  class="glass-morphism"
>
  Content
</div>
```

## 🧪 Testing

### Accessibility Testing
- Screen reader testing with NVDA/JAWS
- Keyboard navigation validation
- Color contrast verification (4.5:1 minimum)
- High contrast mode testing

### ADHD User Testing
- Cognitive load assessment
- Energy level adaptation validation
- Focus state management
- Progressive disclosure usability

### Browser Support
- Modern browsers with `backdrop-filter` support
- Graceful fallbacks for older browsers
- Mobile browser optimization
- Performance testing on low-end devices

## 📱 Mobile Considerations

- Minimum 44px touch targets
- Optimized glass effects for mobile GPU
- Reduced motion by default on mobile
- Touch-friendly hover states

## 🔧 Performance

### Optimization Strategies
- Use `will-change: backdrop-filter` sparingly
- Debounce scroll-based animations
- Lazy load glass effects with Intersection Observer
- CSS transforms instead of layout changes

### Bundle Impact
- Core components: ~8KB gzipped
- No runtime dependencies beyond React
- Tree-shakeable exports
- Minimal CSS footprint

## 🚀 Getting Started

1. Import components:
```tsx
import { GlassContainer, GlassButton, GlassInput } from './components/Glass';
```

2. Use in your JSX:
```tsx
<GlassContainer variant="medium" energyLevel="high">
  <GlassButton variant="primary">Action</GlassButton>
  <GlassInput label="Input" placeholder="Type here..." />
</GlassContainer>
```

3. Customize with props and CSS:
```tsx
<GlassContainer 
  className="custom-spacing"
  cognitiveLoad="minimal"
  adaptiveOpacity={true}
>
  Content
</GlassContainer>
```

## 📄 Examples

See `GlassDemo.tsx` for comprehensive usage examples including:
- Interactive energy level controls
- Cognitive load adaptation
- Progressive disclosure patterns
- Accessibility feature demonstrations
- Real-world ADHD optimization scenarios

## 🤝 Contributing

When adding new glass components:

1. Extend base interfaces with proper TypeScript support
2. Include all three glass variants (light/medium/heavy)
3. Support energy levels and cognitive load adaptation
4. Add comprehensive accessibility features
5. Include high contrast and reduced motion fallbacks
6. Write accessible documentation with examples

## 📚 Resources

- [Apple's Liquid Glass Design Documentation](https://developer.apple.com/videos/play/wwdc2025/219/)
- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/AA/)
- [ADHD-Friendly Design Principles](https://www.w3.org/WAI/cognitive/)
- [CSS backdrop-filter MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)