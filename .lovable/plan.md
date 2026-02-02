

# Compact Calendar Widget Transformation

Transform the InteractiveCalendar from a large 7-column component into a compact, elegant widget that fits better with the Zen dashboard aesthetic.

---

## Current State

| Aspect | Current | Target |
|--------|---------|--------|
| Grid span | 7 columns (58%) | 4-5 columns (33-42%) |
| Day cells | `aspect-square` with `text-sm` | Smaller fixed size with `text-xs` |
| Gaps | `gap-1` between days | `gap-0.5` for tighter grid |
| Padding | `p-3 sm:p-4` on container | `p-2 sm:p-3` reduced |
| Header | Full month name | Abbreviated (Jan, Feb) |
| Footer | Notes button | Remove (redundant) |
| Icons | `w-4 h-4` chevrons | `w-3 h-3` smaller |

---

## Files to Modify

### 1. `src/components/dashboard/widgets/InteractiveCalendar.tsx`

**Reduce overall sizing:**
- Header: Change month format from `"MMMM yyyy"` to `"MMM yyyy"`
- Header: Smaller navigation buttons with `w-3 h-3` icons
- Week days: Change `text-xs` to `text-[10px]` with less margin
- Day grid: Change `gap-1` to `gap-0.5`
- Day cells: Remove `aspect-square`, use fixed `w-7 h-7` or `w-6 h-6`
- Day text: Change `text-sm` to `text-xs`
- Completion indicators: Smaller icons `w-2.5 h-2.5`
- Remove the bottom "Notes" footer entirely (redundant with Notes widget)

### 2. `src/components/dashboard/layouts/ZenLayout.tsx`

**Rebalance the grid layout:**
- Change calendar column span from `lg:col-span-7` to `lg:col-span-4`
- Expand left column from `lg:col-span-5` to `lg:col-span-8`
- This gives more space to Devotion + Notes, makes calendar a true sidebar widget

---

## Detailed Changes

### InteractiveCalendar.tsx - Compact Mode

**Header (lines 65-82):**
```typescript
// Tighter header with smaller text
<div className="flex items-center justify-between mb-2">
  <h3 className="text-xs font-medium">{format(currentMonth, "MMM yyyy")}</h3>
  <div className="flex gap-0.5">
    <button className="p-1 hover:bg-muted rounded">
      <ChevronLeft className="w-3 h-3 text-muted-foreground" />
    </button>
    <button className="p-1 hover:bg-muted rounded">
      <ChevronRight className="w-3 h-3 text-muted-foreground" />
    </button>
  </div>
</div>
```

**Week Days Header (lines 84-91):**
```typescript
<div className="grid grid-cols-7 gap-0.5 mb-1">
  {weekDays.map((d, i) => (
    <div key={i} className="text-center text-[10px] text-muted-foreground font-medium">
      {d}
    </div>
  ))}
</div>
```

**Days Grid (lines 93-140):**
```typescript
<div className="grid grid-cols-7 gap-0.5">
  {/* Each day button: smaller fixed size */}
  <button className={cn(
    "w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded text-xs transition-all relative",
    // ... styling classes
  )}>
    {format(day, "d")}
    {/* Smaller completion indicator */}
    {status === "complete" ? (
      <Check className="w-2 h-2 absolute bottom-0.5" />
    ) : (
      <div className="w-1 h-1 rounded-full absolute bottom-0.5" />
    )}
  </button>
</div>
```

**Remove Footer (lines 142-155):**
Delete the entire "Quick Actions" section - the Notes link is redundant since there's already a NotesWidget in the same view.

### ZenLayout.tsx - Grid Rebalance

**Top Row (lines 84-113):**
```typescript
{/* Left Column: Devotion + Notes - now wider */}
<motion.div className="col-span-12 lg:col-span-8 flex flex-col gap-3 sm:gap-4">
  ...
</motion.div>

{/* Calendar - now narrower widget */}
<motion.div className="col-span-12 lg:col-span-4">
  <ZenCard>
    <div className="p-2 sm:p-3">
      <InteractiveCalendar ... />
    </div>
  </ZenCard>
</motion.div>
```

---

## Visual Comparison

```text
BEFORE:
┌────────────────────────────────┬──────────────────────────────────────────┐
│  Devotion Banner               │                                          │
│  ──────────────────            │            CALENDAR                      │
│  Notes Widget                  │     S  M  T  W  T  F  S                  │
│  (cramped)                     │     1  2  3  4  5  6  7                  │
│                                │     8  9 10 11 12 13 14                  │
│                                │    15 16 17 18 19 20 21                  │
│                                │    22 23 24 25 26 27 28                  │
│                                │    29 30 31                              │
│                                │                     [Notes →]            │
└────────────────────────────────┴──────────────────────────────────────────┘
        5 columns (42%)                        7 columns (58%)

AFTER:
┌──────────────────────────────────────────────────┬────────────────────────┐
│  Devotion Banner                                 │   Jan 2026     < >     │
│  ────────────────────────────                    │   S M T W T F S        │
│                                                  │   1 2 3 4 5 6 7        │
│  Notes Widget (more room to breathe)             │   8 9 ...              │
│  • Spiritual  • Trading  • Tech                  │                        │
│  • Finance    • Music    • Projects              │                        │
│                                                  │                        │
└──────────────────────────────────────────────────┴────────────────────────┘
        8 columns (67%)                                4 columns (33%)
```

---

## Result

After implementation:
- **Compact Calendar** - Tighter, widget-like appearance matching Zen aesthetic
- **Better Balance** - Devotion + Notes get more breathing room
- **Cleaner UI** - Removed redundant Notes link from calendar footer
- **Responsive** - Still stacks vertically on mobile (`col-span-12`)
- **Consistent Sizing** - Fixed day cell sizes prevent layout shifts

