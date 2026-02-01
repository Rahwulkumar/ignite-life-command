

# Responsive Components & Domain Notes Access

This plan addresses two major improvements:
1. Adding direct Notes access from each domain page (auto-selecting that domain)
2. Making components responsive and reusable across all screen sizes

---

## Summary of Changes

| Area | Current Issue | Solution |
|------|---------------|----------|
| Domain Pages | No direct link to Notes | Add "Notes" tab/button that navigates to `/notes` with domain pre-selected |
| NotesSidebar | Fixed width (w-64) | Responsive: collapsible on mobile, drawer on small screens |
| NotesPage | Fixed layout not responsive | Responsive grid with mobile sidebar drawer |
| DomainStatsBar | Hardcoded 4-column grid | Responsive: 2-col on mobile, 4-col on desktop |
| DomainPageHeader | Fixed padding/sizing | Responsive padding and text sizes |
| TopNavigation | Labels hidden on small screens | Already responsive, improve touch targets |
| Dashboard ZenLayout | Fixed 12-col grid | Responsive: stack on mobile, grid on desktop |
| HeroHeader | Fixed sizing | Responsive text and padding |
| DomainNavigation | Horizontal scroll overflow | Responsive: wrap or dropdown on mobile |
| NoteEditor | Fixed emoji picker | Replace emoji picker with icon-only system |

---

## Part 1: Domain Notes Access

### Strategy
Add a "Notes" tab to each domain page's tab system that navigates to `/notes` with the domain pre-selected via URL state.

### Files to Modify

**1. `src/pages/NotesPage.tsx`**
- Accept domain from `location.state` using React Router
- Auto-select the passed domain on mount

**2. All Domain Pages (7 files)**
- `SpiritualPage.tsx` - Add "Notes" tab
- `TradingPage.tsx` - Add "Notes" tab  
- `TechPage.tsx` - Add "Notes" tab
- `FinancePage.tsx` - Add "Notes" tab
- `MusicPage.tsx` - Add "Notes" tab
- `ProjectsPage.tsx` - Add "Notes" tab (different structure)
- `ContentPage.tsx` - Add "Notes" tab (different structure)

### Implementation Pattern

```typescript
// In each domain page's tabs:
<TabsTrigger value="notes" asChild>
  <Link to="/notes" state={{ domain: 'spiritual' }}>
    Notes
  </Link>
</TabsTrigger>
```

---

## Part 2: Responsive Components

### A. Create Reusable Responsive Utilities

**New file: `src/hooks/useBreakpoint.ts`**
- Provides breakpoint hooks: `useIsTablet()`, `useIsDesktop()`
- Extends existing `useIsMobile()` with more granular control

### B. Responsive Notes Page

**`src/pages/NotesPage.tsx`**
- Mobile: Full-width content, sidebar as Sheet/Drawer
- Tablet: Narrower sidebar (w-48)
- Desktop: Standard sidebar (w-64)

**`src/components/notes/NotesSidebar.tsx`**
- Accept `collapsed` prop for mobile view
- Use Drawer component on mobile for slide-out behavior

### C. Responsive Domain Pages

**`src/components/shared/DomainPageHeader.tsx`**
- Responsive padding: `px-4 md:px-8`
- Responsive text: `text-xl md:text-2xl`
- Stack layout on mobile

**`src/components/shared/DomainStatsBar.tsx`**
- Change: `grid-cols-2 md:grid-cols-4`
- Responsive padding: `px-4 md:px-8`

### D. Responsive Dashboard

**`src/pages/Index.tsx`**
- Responsive padding: `px-4 md:px-6`

**`src/components/dashboard/layouts/ZenLayout.tsx`**
- Mobile: Stack all widgets vertically (col-span-12)
- Tablet: 2-column layout
- Desktop: Current 12-column grid

**`src/components/dashboard/DomainNavigation.tsx`**
- Mobile: Icons only in horizontal scroll
- Desktop: Full labels

**`src/components/dashboard/widgets/HeroHeader.tsx`**
- Responsive text sizes
- Stack badges below greeting on mobile

### E. Fix NoteEditor Icon Picker

**`src/components/notes/NoteEditor.tsx`**
- Remove emoji picker entirely (per plan to use professional icons)
- Replace with simple FileText icon or domain-colored indicator

---

## Detailed Changes by File

### 1. `src/hooks/useBreakpoint.ts` (NEW)

```typescript
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export function useBreakpoint() {
  // Returns current breakpoint: 'sm', 'md', 'lg', 'xl'
}

export function useIsTablet() { /* 768-1023px */ }
export function useIsDesktop() { /* 1024px+ */ }
```

### 2. `src/pages/NotesPage.tsx`

**Changes:**
- Import `useLocation` to read domain state
- Import `useIsMobile` for responsive layout
- Add mobile drawer for sidebar
- Handle incoming domain from navigation state

### 3. `src/components/notes/NotesSidebar.tsx`

**Changes:**
- Accept `isMobile` prop
- Conditionally render as Sheet on mobile
- Adjust widths responsively

### 4. `src/components/shared/DomainPageHeader.tsx`

**Changes:**
- Replace fixed `px-8` with `px-4 sm:px-6 lg:px-8`
- Replace fixed `text-2xl` with `text-xl sm:text-2xl`
- Replace fixed icon size `w-14 h-14` with `w-10 h-10 sm:w-14 sm:h-14`
- Stack layout on mobile

### 5. `src/components/shared/DomainStatsBar.tsx`

**Changes:**
- Replace `grid-cols-4` with `grid-cols-2 lg:grid-cols-4`
- Replace fixed padding with responsive classes
- Smaller text on mobile

### 6. `src/components/dashboard/layouts/ZenLayout.tsx`

**Changes:**
- Replace `col-span-5` with `col-span-12 lg:col-span-5`
- Replace `col-span-7` with `col-span-12 lg:col-span-7`
- Replace `col-span-6` with `col-span-12 md:col-span-6`
- Add proper gap responsiveness

### 7. `src/components/dashboard/DomainNavigation.tsx`

**Changes:**
- Hide labels on mobile with `hidden sm:inline`
- Improve touch targets with larger padding on mobile

### 8. `src/components/dashboard/widgets/HeroHeader.tsx`

**Changes:**
- Responsive text: `text-2xl sm:text-4xl`
- Stack badges on mobile
- Responsive padding

### 9. Domain Pages (Pattern for all 7)

**Add Notes access:**
```typescript
<TabsTrigger value="notes" asChild>
  <Link 
    to="/notes" 
    state={{ domain: 'spiritual' }}
    className="flex items-center gap-1.5"
  >
    <StickyNote className="w-4 h-4" />
    Notes
  </Link>
</TabsTrigger>
```

### 10. `src/components/notes/NoteEditor.tsx`

**Changes:**
- Remove `EMOJI_OPTIONS` array
- Remove emoji picker popover
- Replace with simple FileText icon (no interaction needed)
- Remove `showIconPicker` state
- Clean professional look

---

## Responsive Breakpoints Standard

Using Tailwind's default breakpoints consistently:
- **Mobile**: < 640px (default styles)
- **sm**: 640px+
- **md**: 768px+
- **lg**: 1024px+
- **xl**: 1280px+

---

## Implementation Order

1. Create `useBreakpoint.ts` utility hook
2. Update `DomainPageHeader.tsx` - responsive
3. Update `DomainStatsBar.tsx` - responsive
4. Update `ZenLayout.tsx` - responsive dashboard
5. Update `HeroHeader.tsx` - responsive
6. Update `DomainNavigation.tsx` - responsive
7. Update `NotesPage.tsx` - handle domain state + responsive
8. Update `NotesSidebar.tsx` - mobile drawer
9. Update `NoteEditor.tsx` - remove emoji picker
10. Update all 7 domain pages - add Notes tab
11. Update `TopNavigation.tsx` - improve mobile touch targets

---

## Result

After implementation:
- **Domain Notes Access** - Click "Notes" tab on any domain page to open Notes pre-filtered to that domain
- **Mobile-First Design** - All components work beautifully on phones, tablets, and desktops
- **Reusable Patterns** - Consistent responsive classes and breakpoint utilities
- **Professional Icons** - No emojis anywhere, clean Lucide icons only
- **No Hardcoded Widths** - All sizing uses responsive Tailwind classes

