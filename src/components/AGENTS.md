# Frontend Component Development Agent Guide
## `/src/components/` Specialized Configuration

> **Mission**: Build world-class AI news website components using React 18+ concurrent features, TypeScript strict mode, and accessibility-first design patterns.

## 🎯 Component Development Philosophy

### Core Principles
- **Type Safety First**: Strict TypeScript, zero `any` types, comprehensive prop interfaces
- **Performance by Default**: Concurrent features, code splitting, optimized bundle sizes
- **Accessibility Mandatory**: WCAG 2.1 AA compliance, semantic HTML, screen reader tested
- **AI-Inspired Design**: Geometric precision with humanistic warmth, following OpenAI/Vercel patterns
- **Testability Built-In**: Component testing with React Testing Library, user-centric approach

### Quality Standards
- **Bundle Size**: Individual components < 25KB gzipped
- **Performance**: Render time < 16ms (60fps target)
- **Accessibility**: 100% WCAG 2.1 AA compliance
- **Type Coverage**: 98% compile-time error detection
- **Test Coverage**: 90%+ component logic coverage

## 🏗️ Component Architecture Standards

### File Structure Pattern
```
src/components/
├── ui/                    # Design system primitives
│   ├── Button/
│   │   ├── Button.tsx          # Main component
│   │   ├── Button.test.tsx     # Tests
│   │   ├── Button.stories.tsx  # Storybook
│   │   └── index.ts            # Clean exports
├── layout/               # Layout components
│   ├── Header/
│   ├── Navigation/
│   └── Footer/
├── features/             # Feature-specific components
│   ├── NewsGrid/
│   ├── ArticleCard/
│   └── NewsletterSignup/
└── shared/               # Cross-feature components
    ├── LoadingStates/
    ├── ErrorBoundaries/
    └── Accessibility/
```

### TypeScript Interface Standards

```typescript
// Required prop interface pattern for all components
interface ComponentProps {
  // Required props first
  children: React.ReactNode;
  
  // Optional props with defaults
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  
  // Event handlers
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  
  // Accessibility props
  'aria-label'?: string;
  'aria-describedby'?: string;
  
  // Styling props
  className?: string;
  testId?: string;
}

// Component implementation pattern
const Component = React.forwardRef<HTMLButtonElement, ComponentProps>(
  ({ children, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant])}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Component.displayName = 'Component';
export default React.memo(Component);
```

## 🎨 AI-Inspired Design System

### Color Palette (CSS Custom Properties)
```css
:root {
  /* Primary AI Colors */
  --ai-primary: #1e3a8a;        /* Deep blue */
  --ai-primary-dark: #1e40af;
  --ai-primary-light: #3b82f6;
  
  /* Neural Network Accent */
  --ai-accent: #8b5cf6;         /* Purple */
  --ai-accent-dark: #7c3aed;
  
  /* Neutral Grays */
  --ai-gray-50: #f8fafc;
  --ai-gray-100: #f1f5f9;
  --ai-gray-500: #64748b;
  --ai-gray-900: #0f172a;
  
  /* Semantic Colors */
  --ai-success: #10b981;
  --ai-warning: #f59e0b;
  --ai-error: #ef4444;
  
  /* Typography */
  --font-primary: 'Geist', -apple-system, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

### Component Variants Pattern
```typescript
const componentVariants = {
  // AI-inspired button variants
  primary: 'bg-ai-primary text-white hover:bg-ai-primary-dark focus:ring-ai-primary/20',
  secondary: 'bg-white text-ai-primary border-2 border-ai-primary hover:bg-ai-gray-50',
  ghost: 'bg-transparent text-ai-gray-500 hover:bg-ai-gray-100',
  neural: 'bg-gradient-to-r from-ai-primary to-ai-accent text-white',
  
  // Sizes following 8px grid system
  small: 'px-4 py-2 text-sm h-8',
  medium: 'px-6 py-3 text-base h-11',
  large: 'px-8 py-4 text-lg h-14',
};
```

## ⚡ Performance Optimization Patterns

### React 18 Concurrent Features
```typescript
// Lazy loading with Suspense for code splitting
const FeatureComponent = lazy(() => import('./FeatureComponent'));

const ComponentWithSuspense: React.FC = () => {
  return (
    <Suspense fallback={<SkeletonLoader type="component" />}>
      <FeatureComponent />
    </Suspense>
  );
};

// StartTransition for non-urgent updates
const ComponentWithTransition: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  
  const handleUpdate = (newData: Data) => {
    startTransition(() => {
      setData(newData);
    });
  };
  
  return (
    <div className={isPending ? 'opacity-50 transition-opacity' : ''}>
      {/* Component content */}
    </div>
  );
};
```

### Image Optimization Pattern
```typescript
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false 
}) => {
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const avifSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.avif');
  
  return (
    <picture className={className}>
      <source srcSet={avifSrc} type="image/avif" sizes={sizes} />
      <source srcSet={webpSrc} type="image/webp" sizes={sizes} />
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
        className="w-full h-auto transition-opacity duration-300"
      />
    </picture>
  );
};
```

## ♿ Accessibility Implementation Standards

### Required Accessibility Patterns
```typescript
// Accessible button with proper ARIA attributes
const AccessibleButton: React.FC<ButtonProps> = ({ 
  children, 
  disabled, 
  loading,
  'aria-label': ariaLabel,
  ...props 
}) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      className={cn(
        'min-h-[44px] min-w-[44px]', // Touch target compliance
        'focus:outline-none focus:ring-4 focus:ring-ai-primary/20',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      )}
    >
      {loading && (
        <span className="sr-only">Loading...</span>
      )}
      {children}
    </button>
  );
};

// Skip navigation for keyboard users
const SkipToContent: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
               bg-ai-primary text-white px-4 py-2 rounded-md z-50"
  >
    Skip to main content
  </a>
);
```

### Color Contrast Validation
```typescript
// Utility for ensuring WCAG AA compliance (4.5:1 ratio)
const validateContrast = (foreground: string, background: string): boolean => {
  const ratio = calculateContrastRatio(foreground, background);
  return ratio >= 4.5; // WCAG AA standard
};

// Use in component development
const TextComponent: React.FC<TextProps> = ({ color, background }) => {
  if (!validateContrast(color, background)) {
    console.warn(`Contrast ratio insufficient: ${color} on ${background}`);
  }
  // Component implementation
};
```

## 🧪 Testing Standards & Patterns

### Component Testing Template
```typescript
// Component.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Component from './Component';

expect.extend(toHaveNoViolations);

describe('Component', () => {
  // Accessibility testing
  it('should have no accessibility violations', async () => {
    const { container } = render(<Component>Test</Component>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  // Interaction testing
  it('should handle click events correctly', () => {
    const handleClick = jest.fn();
    render(<Component onClick={handleClick}>Click me</Component>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  // Visual regression prevention
  it('should render with correct styles', () => {
    render(<Component variant="primary">Test</Component>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-ai-primary', 'text-white');
  });
  
  // Performance testing
  it('should render within performance budget', () => {
    const start = performance.now();
    render(<Component>Test</Component>);
    const end = performance.now();
    
    expect(end - start).toBeLessThan(16); // 60fps = 16ms per frame
  });
});
```

### Loading State Testing
```typescript
// Test loading states and error boundaries
describe('Loading States', () => {
  it('should show skeleton loader while loading', () => {
    render(<Component loading={true} />);
    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
  });
  
  it('should handle error states gracefully', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
```

## 🔧 Development Workflow for AI Agents

### Component Creation Checklist
```bash
# 1. Create component directory structure
mkdir -p src/components/ui/NewComponent
cd src/components/ui/NewComponent

# 2. Generate component files
touch NewComponent.tsx NewComponent.test.tsx NewComponent.stories.tsx index.ts

# 3. Implement with TypeScript strict mode
# - Define prop interfaces
# - Add proper ref forwarding
# - Include accessibility attributes
# - Add loading/error states

# 4. Test implementation
pnpm test NewComponent.test.tsx
pnpm test:a11y NewComponent.test.tsx

# 5. Visual testing
pnpm storybook:dev
```

### Code Quality Gates
```typescript
// ESLint configuration for components
{
  "extends": [
    "@typescript-eslint/strict",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-any": "error",
    "react/prop-types": "off",
    "jsx-a11y/anchor-is-valid": "error"
  }
}
```

### Performance Monitoring
```typescript
// Component performance profiling
const ComponentWithProfiler: React.FC = () => {
  return (
    <Profiler
      id="ComponentName"
      onRender={(id, phase, actualDuration) => {
        if (actualDuration > 16) {
          console.warn(`Component ${id} render exceeded 16ms: ${actualDuration}ms`);
        }
      }}
    >
      <Component />
    </Profiler>
  );
};
```

## 🚀 Deployment & Bundle Optimization

### Code Splitting Strategy
```typescript
// Feature-based code splitting
const NewsGrid = lazy(() => import('./features/NewsGrid/NewsGrid'));
const ArticleCard = lazy(() => import('./features/ArticleCard/ArticleCard'));

// Component-level splitting for large components
const NewsletterSignup = lazy(() => 
  import('./features/NewsletterSignup/NewsletterSignup')
);
```

### Bundle Analysis Commands
```bash
# Analyze bundle size impact
pnpm build:analyze
pnpm bundle:visualize

# Performance testing
pnpm lighthouse:components
pnpm test:performance

# Accessibility audit
pnpm audit:a11y
```

## 🎯 Success Metrics & KPIs

### Performance Targets
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s  
- **Component Bundle Size**: < 25KB gzipped per component
- **Render Performance**: < 16ms per component
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices)

### Quality Metrics
- **TypeScript Coverage**: 98%+
- **Test Coverage**: 90%+ (components)
- **Accessibility Score**: 100% WCAG 2.1 AA
- **Zero Runtime Errors**: In production builds
- **Performance Budget**: No regressions > 5%

### Development Velocity
- **Component Creation**: < 2 hours (simple), < 1 day (complex)
- **Bug Fix Time**: < 4 hours average
- **Feature Development**: < 1 week for new component features
- **Code Review**: < 24 hours turnaround

---

**Remember**: Every component must meet these standards before deployment. Focus on building reusable, accessible, and performant components that embody the precision and warmth of modern AI-driven design systems.
