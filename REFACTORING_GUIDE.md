# Refactoring Quick Reference Guide

## What Was Refactored & Why

### Critical Improvements (High Impact)

#### 1. **App.jsx → Hooks-Based Architecture**
```javascript
// OLD: 245 lines with deep nesting and multiple useEffects
// NEW: 100 lines with clear routing logic

// Extracted:
- useRouteLocation() → Route resolution and navigation
- useScrollBehavior() → Scroll management
- PageLayout component → Eliminates layout duplication
```
**Impact**: 59% file size reduction, easier testing, clearer data flow

---

#### 2. **Hero.jsx → Simplified Device Detection**
```javascript
// OLD: Complex 80+ line effect with nested conditionals
// NEW: Two custom hooks: useWebGLCapability + useIntersectionLoad

// Benefits:
- Device checks are now testable in isolation
- Scene lazy-loading logic is reusable
- Easier to understand component flow
```
**Impact**: 68% file size reduction, better performance on low-end devices

---

#### 3. **Particles.jsx → Better Organization**
```javascript
// Improvements:
- Extracted hexToRgb() to top
- Constants: PARTICLE_TARGET_FPS, PARTICLE_FRAME_TIME
- Better function names: createCircle() instead of circleParams()
- Clearer math with intermediate variables
- Added comprehensive documentation
```
**Impact**: Easier to maintain, better FPS throttling documentation

---

### Code Quality Improvements

#### Naming Conventions
| Component | Change | Reason |
|-----------|--------|--------|
| Navbar | Added NAV_ITEMS constant | Single source of truth |
| Cursor | `isReady` → `isInitialized` | More descriptive |
| Alert | Removed duplicate padding class | CSS cleanup |
| ProjectCard | `sizes` → `imageSizes` | Context clarity |

#### Accessibility
- Alert: Added `role="status"` and `aria-live="polite"`
- Navbar: Better menu toggle labels
- All images: Proper alt text and lazy loading

#### Bug Fixes
- HeroText: "Start You Project" → "Start Your Project"
- HeroText: "Ali" → "Yassine" (correct name)
- Route handling: Proper decodeURIComponent error handling

---

## New Hooks Explanation

### `useRouteLocation()`
**What it does**: Manages current route and handles navigation
**Why**: Centralized route logic, easier to test
```javascript
const { location, route, pathname } = useRouteLocation();
// route.type: "home" | "works" | "work-detail" | "not-found"
// route.id: string (for work-detail route)
```

### `useScrollBehavior()`
**What it does**: Handles scroll-to-hash and scroll-to-top
**Why**: Respects motion preferences, clean separation
```javascript
useScrollBehavior(location, shouldSkipScroll);
// Automatically scrolls to hash anchors with smooth behavior
// Scrolls to top on route change (unless hash present)
```

### `useWebGLCapability()`
**What it does**: Detects if device can handle 3D scenes
**Why**: Improves performance on low-end devices
```javascript
const canRender = useWebGLCapability();
// Checks: reduced motion, data saver, device memory, connection speed
```

### `useIntersectionLoad()`
**What it does**: Lazy loads components when visible or on interaction
**Why**: Replaces Hero.jsx's complex loading logic
```javascript
const isLoaded = useIntersectionLoad(ref, { rootMargin: "150px" });
// Uses IntersectionObserver + requestIdleCallback
```

---

## PageLayout Component

**Purpose**: Standardized page wrapper with navbar, content, footer

```javascript
// Usage
<PageLayout loadingMessage="..." fallbackMessage="...">
  <WorkDetail id={id} />
</PageLayout>

// Replaces this pattern:
<div className="w-full max-w-full">
  <Navbar />
  <ErrorBoundary fallback={...}>
    <Suspense fallback={...}>
      {children}
    </Suspense>
  </ErrorBoundary>
  <Footer />
</div>
```

**Benefits**: DRY principle, consistent error handling, easier to modify layouts

---

## Performance Optimizations

### Lazy Loading Waterfall
```
Route Change
  ↓
useRouteLocation() determines route
  ↓
Hero renders
  ↓
useWebGLCapability() checks device
  ↓
useIntersectionLoad() waits for:
  - Intersection with viewport
  - requestIdleCallback
  - User interaction (mouse enter/focus)
  ↓
HeroScene loads and renders
```

### Image Performance
- Responsive srcSet generation (`buildSrcSet`)
- Lazy loading: `loading="lazy"`
- Async decoding: `decoding="async"`
- Correct aspect ratio hints

### Animation Throttling
- Particles: 30 FPS target (reduces CPU usage)
- Cursor: requestAnimationFrame (60 FPS when needed)
- Respect: `prefers-reduced-motion`

---

## Testing the Refactored Code

### Quick Test
```bash
npm run dev      # Start dev server
npm run build    # Check build works
npm run lint     # Check linting
npm test         # Run tests
```

### What to Test
1. **Routing**: Navigate to /works, /works/[id], back to home
2. **Scroll**: Click hash links (#about, #tidycall)
3. **Mobile**: Toggle menu, check responsive layout
4. **3D Scene**: Wait for Hero scene to load
5. **Cursor**: Hover over links, check cursor effects
6. **Low Connection**: Check lazy loading with DevTools throttling

---

## Common Questions

### Q: Why extract hooks instead of keeping logic in components?
**A**: 
- Hooks are testable in isolation
- Reusable across components
- Easier to understand and modify
- Follows React best practices
- Better code organization

### Q: Does this affect performance?
**A**: 
- ✅ Better: Lazy loading, device detection, motion preferences
- ✅ Better: Throttled animations, responsive images
- → Same: Bundle size (~2KB hooks, but better lazy loading)

### Q: What about browser compatibility?
**A**: All features use standard Web APIs with graceful fallbacks:
- IntersectionObserver (fallback: immediate render)
- requestIdleCallback (fallback: setTimeout)
- requestAnimationFrame (standard across all browsers)
- matchMedia (standard, with checks)

### Q: How do I modify routing?
**A**: 
1. Update `useRouteLocation()` for route resolution logic
2. Add new route type to switch statement in App.jsx
3. Create new lazy component and import it

### Q: How do I add new nav items?
**A**: 
```javascript
// In Navbar.jsx
const NAV_ITEMS = [
  // ... existing items
  { label: "New Page", href: "new-page" },
];
```

---

## Maintenance Guide

### Adding a New Feature

1. **New Page/Route**:
   - Update NAV_ITEMS in Navbar.jsx
   - Add route case to useRouteLocation() if needed
   - Create lazy component
   - Import and add to App.jsx switch statement

2. **New Hook**:
   - Create in `/src/hooks/[name].js`
   - Add to `/src/hooks/index.js` exports
   - Document with JSDoc comment

3. **New Component**:
   - Keep focused and single-purpose
   - Use hooks for logic
   - Add JSDoc comment
   - Consider if PageLayout is needed

### Debugging

- **Route Issues**: Check useRouteLocation() console logs (dev mode)
- **Scroll Issues**: Check useScrollBehavior() and motion preferences
- **3D Not Loading**: Check useWebGLCapability() for device capability
- **Lazy Load Issues**: Check useIntersectionLoad() observer status

### Common Patterns

```javascript
// Custom hook for reusable logic
const useMyLogic = () => {
  const [state, setState] = useState(initial);
  
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    };
  }, [dependencies]);
  
  return state;
};

// Component using hook
const MyComponent = () => {
  const state = useMyLogic();
  return <div>{state}</div>;
};
```

---

## Checklist Before Deployment

- [ ] Run `npm run build` - build succeeds
- [ ] Run `npm run lint` - no lint errors
- [ ] Run `npm test` - tests pass
- [ ] Test routing: home, works, work details
- [ ] Test scroll: hash links work
- [ ] Test mobile: responsive, menu works
- [ ] Test 3D: Scene loads on desktop
- [ ] Test accessibility: Tab navigation works
- [ ] Test on throttled network (Chrome DevTools)
- [ ] Check lighthouse scores

---

## Files Reference

### New Files
```
/src/hooks/
  index.js                  # Hook exports
  useRouteLocation.js       # Route management (95 lines)
  useScrollBehavior.js      # Scroll handling (30 lines)
  useWebGLCapability.js     # Device detection (50 lines)
  useIntersectionLoad.js    # Lazy loading (70 lines)

/src/components/
  PageLayout.jsx            # Layout wrapper (55 lines)
```

### Modified Files
```
App.jsx                     # 245 → 100 lines (-59%)
src/sections/Hero.jsx       # 157 → 50 lines (-68%)
src/sections/Navbar.jsx     # Better organization
src/components/Particles.jsx # Better organized, same size
src/components/LazyMount.jsx # Added docs, cleaner
src/components/ProjectCard.jsx # Better naming
src/components/Alert.jsx    # Better accessibility
src/components/ErrorBoundary.jsx # Better error handling
src/components/HeroText.jsx # Fixed typos
src/cursor.js              # Better organized
```

### Untouched (Already Clean)
```
src/utils/paths.js
src/utils/images.js
src/utils/performance.js
src/loader.js
vite.config.js
tailwind.config.js
```

---

## Support & Questions

For questions about specific refactoring decisions, refer to:
1. `REFACTORING_SUMMARY.md` - Detailed explanation of all changes
2. Component JSDoc comments - Implementation details
3. Hook documentation - Usage patterns

