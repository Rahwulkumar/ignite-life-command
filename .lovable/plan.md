

# Full-Bleed Dashboard Transformation

This plan transforms the current dashboard into a fluid, full-viewport web application that occupies 100% of browser width and height with proper scroll containment, fixed header, and dynamic content areas.

---

## Current Issues Identified

| Issue | Location | Problem |
|-------|----------|---------|
| Max-width constraint | `src/App.css` | `#root { max-width: 1280px }` limits app width |
| Container constraint | `src/pages/Index.tsx` | `max-w-6xl` limits dashboard to 1152px |
| Fixed padding | `src/pages/Index.tsx` | `px-4 sm:px-6` creates dead space on edges |
| No viewport height control | `MainLayout.tsx` | Uses `min-h-screen` without `h-screen` overflow handling |
| Component overflow | `ZenLayout.tsx` | Grid doesn't fill available height properly |
| Tailwind container | `tailwind.config.ts` | Container has `center: true` and max-width |

---

## Architecture Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER VIEWPORT                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               HERO HEADER (fixed/sticky)              │  │
│  │         Full-width background with gradients          │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                                                       │  │
│  │              SCROLLABLE CONTENT AREA                  │  │
│  │     ┌─────────────────────────────────────────────┐   │  │
│  │     │   Domain Navigation (positioned right)      │   │  │
│  │     ├───────────────────┬─────────────────────────┤   │  │
│  │     │  Devotion         │                         │   │  │
│  │     │  Banner           │   Interactive Calendar  │   │  │
│  │     ├───────────────────┤   (fills remaining)     │   │  │
│  │     │  Notes            │                         │   │  │
│  │     │  Widget           │                         │   │  │
│  │     ├───────────────────┴─────────────────────────┤   │  │
│  │     │  Completion Chart  │  Performance Summary   │   │  │
│  │     └─────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Files to Modify

### 1. `src/App.css` - Remove Root Constraints
Remove the legacy Vite template constraints that limit the root element.

**Before:**
```css
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
```

**After:**
```css
#root {
  width: 100%;
  min-height: 100vh;
}
```

### 2. `src/index.css` - Add Viewport Utilities
Add base styles for full-viewport behavior and scroll containment.

**Add to base layer:**
```css
html, body, #root {
  height: 100%;
  overflow-x: hidden;
}
```

### 3. `src/components/layout/MainLayout.tsx` - Full Viewport Layout
Convert to a flex-based full-height layout with proper overflow handling.

**Key changes:**
- Use `h-screen` with `flex flex-col`
- Main content uses `flex-1 overflow-y-auto overflow-x-hidden`
- Remove duplicate `min-h-screen` on main element

### 4. `src/pages/Index.tsx` - Remove Max-Width Constraint
Convert from constrained container to full-bleed layout.

**Changes:**
- Remove `max-w-6xl mx-auto`
- Use responsive padding: `px-4 sm:px-6 lg:px-8 xl:px-12`
- Change `min-h-screen` to `h-full` (inherits from parent)
- Add `w-full` for explicit full-width

### 5. `src/components/dashboard/widgets/HeroHeader.tsx` - Full-Bleed Header
Ensure header extends edge-to-edge.

**Changes:**
- Remove negative margins workaround (`-mx-4 sm:-mx-6`)
- Use `w-screen` or `w-full` with proper positioning
- Keep sticky/fixed positioning for scroll behavior

### 6. `src/components/dashboard/layouts/ZenLayout.tsx` - Fluid Grid
Convert to percentage-based fluid grid that fills available space.

**Changes:**
- Use `flex-1` on outer container for height growth
- Keep responsive grid spans
- Ensure cards use `h-full` where appropriate
- Remove fixed `min-h` values where possible

### 7. `tailwind.config.ts` - Update Container Configuration
Modify the container plugin settings for full-width behavior.

**Changes:**
```typescript
container: {
  center: true,
  padding: {
    DEFAULT: "1rem",
    sm: "1.5rem",
    lg: "2rem",
    xl: "3rem",
  },
  screens: {
    "2xl": "100%", // No max-width constraint
  },
},
```

---

## Technical Implementation Details

### Viewport Optimization

**Base HTML/CSS:**
```css
/* src/index.css */
html {
  height: 100%;
  overflow-x: hidden;
}

body {
  height: 100%;
  overflow-x: hidden;
}
```

**Root Element:**
```css
/* src/App.css */
#root {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
```

### Layout Container Structure

**MainLayout.tsx:**
```typescript
export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {!isHomePage && <TopNavigation />}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
```

### Dashboard Container

**Index.tsx:**
```typescript
<div className="h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-2 sm:pt-4 pb-4">
  <HeroHeader currentTime={currentTime} />
  {/* ... rest of content */}
</div>
```

### Fluid Hero Header

**HeroHeader.tsx:**
```typescript
<motion.header 
  className="relative overflow-hidden w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-4 sm:pt-6 pb-28 sm:pb-36 lg:pb-40"
>
  {/* Background spans full width via absolute positioning */}
  <div className="absolute inset-0 z-0">
    {/* ... background content */}
  </div>
</motion.header>
```

### Responsive Grid with Flex Growth

**ZenLayout.tsx:**
```typescript
<motion.div
  className="relative flex-1 flex flex-col gap-3 sm:gap-4"
>
  {/* Grid rows */}
  <div className="grid grid-cols-12 gap-3 sm:gap-4 flex-1">
    {/* Cards with h-full */}
  </div>
</motion.div>
```

---

## Spacing Audit & Standardization

### Responsive Padding Scale
```text
Mobile:  px-4  (16px)
Tablet:  px-6  (24px)  
Desktop: px-8  (32px)
Wide:    px-12 (48px)
```

### Gap Standardization
```text
Small gaps:  gap-2 (8px)
Medium gaps: gap-3 sm:gap-4 (12px / 16px)
Large gaps:  gap-4 sm:gap-6 (16px / 24px)
```

---

## Overflow Handling Strategy

| Element | Overflow X | Overflow Y | Reason |
|---------|-----------|-----------|--------|
| `html` | hidden | auto | Prevent horizontal scroll |
| `body` | hidden | auto | Prevent horizontal scroll |
| `#root` | hidden | auto | Container boundary |
| `MainLayout` | hidden | hidden | Parent constraint |
| `main` | hidden | auto | Scrollable content area |
| Cards/Widgets | hidden | auto/visible | Content clipping |

---

## Component-Specific Fixes

### ZenCard Wrapper
- Add `w-full` for explicit full-width behavior
- Keep `h-full` where vertical fill is needed
- Use `flex-1` for growing widgets

### InteractiveCalendar
- Already uses `h-full flex flex-col` (good)
- Ensure parent card provides height

### CompletionChart
- Already uses `ResponsiveContainer` (good)
- Remove fixed `h-32`, use percentage height

### PerformanceSummary
- Use `h-full` on wrapper
- Let flex-1 on parent handle height

---

## Implementation Order

1. **src/App.css** - Remove root constraints
2. **src/index.css** - Add viewport utilities  
3. **tailwind.config.ts** - Update container config
4. **src/components/layout/MainLayout.tsx** - Full viewport layout
5. **src/pages/Index.tsx** - Remove max-width, add fluid classes
6. **src/components/dashboard/widgets/HeroHeader.tsx** - Full-bleed header
7. **src/components/dashboard/layouts/ZenLayout.tsx** - Fluid grid

---

## Result

After implementation:
- **Full viewport coverage** - Dashboard spans 100vw × 100vh
- **No horizontal scrollbar** - Overflow properly contained
- **Fixed scroll zones** - Only content area scrolls, not the entire page
- **Responsive padding** - Edges breathe appropriately at all screen sizes
- **Dynamic content sizing** - Components grow/shrink with viewport
- **Consistent spacing** - Unified gap and padding scale throughout

