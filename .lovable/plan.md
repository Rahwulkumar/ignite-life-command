

# Expand Calendar Widget

Make the calendar widget bigger and more prominent with larger day cells and improved layout proportions.

---

## Current vs Target

| Aspect | Current | Target |
|--------|---------|--------|
| Grid span | 3 columns (25%) | 4 columns (33%) |
| Left column | 9 columns (75%) | 8 columns (67%) |
| Day cells | `w-5 h-5` ultra-compact | `w-7 h-7` comfortable |
| Day text | `text-[10px]` tiny | `text-xs` readable |
| Header text | `text-[11px]` | `text-sm` standard |
| Container padding | `p-2` | `p-3 sm:p-4` |
| Week headers | `text-[9px]` | `text-[11px]` |

---

## Files to Modify

### 1. `src/components/dashboard/layouts/ZenLayout.tsx`

**Grid rebalance:**
- Change left column from `lg:col-span-9` to `lg:col-span-8`
- Change calendar column from `lg:col-span-3` to `lg:col-span-4`
- Increase calendar container padding from `p-2` to `p-3 sm:p-4`

### 2. `src/components/dashboard/widgets/InteractiveCalendar.tsx`

**Increase sizing throughout:**
- Day cells: `w-5 h-5` → `w-7 h-7`
- Day text: `text-[10px]` → `text-xs`
- Month header: `text-[11px]` → `text-sm`
- Week headers: `text-[9px]` → `text-[11px]`
- Navigation icons: `w-3 h-3` → `w-4 h-4`
- Footer task buttons: slightly larger padding and text
- Remaining task icons: `w-2.5 h-2.5` → `w-3 h-3`

---

## Visual Comparison

```text
BEFORE (3 cols, ultra-compact):
┌─────────────────────────────────────────────────┬───────────────┐
│                                                 │  Feb 2026 <>  │
│   DEVOTION + WORKSPACES                         │  S M T W T F S│
│   (9 columns - 75%)                             │  tiny cells   │
│                                                 │  Today: 2/4   │
└─────────────────────────────────────────────────┴───────────────┘

AFTER (4 cols, comfortable):
┌────────────────────────────────────────────┬────────────────────┐
│                                            │   February 2026 <> │
│   DEVOTION + WORKSPACES                    │   S  M  T  W  T  F │
│   (8 columns - 67%)                        │   1  2  3  4  5  6 │
│                                            │   ...              │
│                                            │   Today: 2/4  [+]  │
│                                            │   □ Bible □ GYM    │
└────────────────────────────────────────────┴────────────────────┘
```

---

## Implementation Details

### ZenLayout.tsx Changes

```typescript
{/* Left Column: 9 → 8 cols */}
<motion.div className="col-span-12 lg:col-span-8 flex flex-col gap-3 sm:gap-4">
  ...
</motion.div>

{/* Calendar: 3 → 4 cols with more padding */}
<motion.div className="col-span-12 lg:col-span-4">
  <ZenCard className="h-full">
    <div className="p-3 sm:p-4">
      <InteractiveCalendar ... />
    </div>
  </ZenCard>
</motion.div>
```

### InteractiveCalendar.tsx Changes

```typescript
{/* Header - larger text */}
<h3 className="text-sm font-medium">{format(currentMonth, "MMM yyyy")}</h3>
<ChevronLeft className="w-4 h-4 text-muted-foreground" />

{/* Week headers - more readable */}
<div className="text-center text-[11px] text-muted-foreground font-medium py-1">

{/* Day cells - comfortable size */}
<button className="w-7 h-7 flex items-center justify-center rounded text-xs ...">

{/* Task buttons - slightly larger */}
<button className="flex items-center gap-1 text-[10px] px-2 py-1 rounded ...">
  <Icon className="w-3 h-3 text-muted-foreground" />
```

---

## Result

After implementation:
- **More prominent calendar** - Takes 4 columns instead of 3
- **Readable day cells** - Comfortable `w-7 h-7` sizing with `text-xs`
- **Better visual hierarchy** - Larger header and week day labels
- **Balanced layout** - 8/4 split still gives Devotion+Notes majority space
- **Mobile unchanged** - Still stacks to full width on smaller screens

