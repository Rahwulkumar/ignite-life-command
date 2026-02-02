

# Enhanced Dashboard with Ultra-Compact Calendar & Real-Time Metrics

This plan redesigns the dashboard layout to prioritize Devotion and Workspaces while transforming the calendar into an ultra-compact widget with inline task indicators. Journal entries from the checklist will sync to the Notes system, and all metrics will update in real-time.

---

## Summary of Changes

| Area | Current | New |
|------|---------|-----|
| Calendar Widget | 4 columns, medium size | 3 columns, ultra-compact with inline remaining tasks |
| Devotion Banner | Stacked with Notes in 8 cols | 5 columns, standalone prominent card |
| Notes/Workspaces | Stacked below Devotion | 4 columns, standalone card next to Devotion |
| Metrics Row | 2 widgets (Chart + Summary) | 3 widgets (Chart + Summary + Streak Stats) |
| Journal Storage | Checklist only | Auto-create Notes journal entries on task completion |
| Real-time Updates | Query refresh only | React Query invalidation + optimistic updates |

---

## New Dashboard Layout

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HERO HEADER                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                     [Domain Navigation]     │
├─────────────────────────────────┬─────────────────────┬─────────────────────┤
│                                 │                     │   Feb 2026    < >   │
│   DEVOTION BANNER               │   WORKSPACES        │   S M T W T F S     │
│   Morning Devotion              │   • Spiritual  (3)  │   1 2 3 4 5 6 7     │
│   David - Day 7                 │   • Trading    (5)  │   8 9 ...           │
│   1 Samuel 17                   │   • Tech       (2)  │   ─────────────     │
│                                 │     ...             │   Today: 2/4 left   │
│                                 │   [View all →]      │   □ Bible □ GYM     │
└─────────────────────────────────┴─────────────────────┴─────────────────────┘
         5 columns                      4 columns              3 columns

┌─────────────────────────────┬─────────────────────────┬─────────────────────┐
│    COMPLETION CHART         │   PERFORMANCE SUMMARY   │   STREAK & STATS    │
│    [Bar chart - weekly]     │   This Week: 85%        │   🔥 7 day streak   │
│                             │   Best: Prayer          │   📊 This month: 78%│
│                             │   Focus: GYM            │   ⭐ Longest: 14    │
└─────────────────────────────┴─────────────────────────┴─────────────────────┘
         4 columns                    4 columns               4 columns
```

---

## Files to Modify/Create

### 1. `src/components/dashboard/widgets/InteractiveCalendar.tsx` - Ultra-Compact

**Changes:**
- Reduce day cells to `w-5 h-5` for ultra-compact sizing
- Add a "Today's Progress" footer showing remaining tasks inline
- Remove `flex-1` from days grid to prevent expansion
- Smaller header text and tighter margins
- Show task icons for uncompleted items for today

**New Structure:**
```typescript
<div className="flex flex-col">
  {/* Compact header: "Feb 2026" with tiny nav */}
  <div className="flex items-center justify-between mb-1.5">
    <span className="text-[10px] font-medium">{format(month, "MMM yyyy")}</span>
    <div className="flex">
      <button className="p-0.5"><ChevronLeft className="w-2.5 h-2.5" /></button>
      <button className="p-0.5"><ChevronRight className="w-2.5 h-2.5" /></button>
    </div>
  </div>
  
  {/* Ultra-compact grid */}
  <div className="grid grid-cols-7 gap-px mb-2">
    {/* Week headers: S M T W T F S */}
    {/* Day cells: w-5 h-5 text-[10px] */}
  </div>
  
  {/* NEW: Today's Progress Footer */}
  <div className="pt-2 border-t border-border/30">
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[10px] text-muted-foreground">Today</span>
      <span className="text-[10px] font-medium">{completed}/{total}</span>
    </div>
    <div className="flex flex-wrap gap-1">
      {remainingTasks.map(task => (
        <button className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-muted/50">
          <TaskIcon className="w-2.5 h-2.5" />
          {task.label}
        </button>
      ))}
    </div>
  </div>
</div>
```

### 2. `src/components/dashboard/layouts/ZenLayout.tsx` - Rebalanced Grid

**Changes:**
- Top row: 5 cols (Devotion) + 4 cols (Notes) + 3 cols (Calendar)
- Bottom row: 4 cols (Chart) + 4 cols (Summary) + 4 cols (NEW StreakStats)
- Add new StreakStats widget import

**Grid Structure:**
```typescript
{/* Top Row: 3-column layout */}
<div className="grid grid-cols-12 gap-3 sm:gap-4">
  {/* Devotion - prominent */}
  <motion.div className="col-span-12 md:col-span-6 lg:col-span-5">
    <ZenCard className="h-full">
      <DevotionBanner />
    </ZenCard>
  </motion.div>
  
  {/* Notes/Workspaces - standalone */}
  <motion.div className="col-span-12 md:col-span-6 lg:col-span-4">
    <ZenCard className="h-full">
      <NotesWidget />
    </ZenCard>
  </motion.div>
  
  {/* Calendar - ultra-compact sidebar */}
  <motion.div className="col-span-12 lg:col-span-3">
    <ZenCard>
      <div className="p-2">
        <InteractiveCalendar compact />
      </div>
    </ZenCard>
  </motion.div>
</div>

{/* Bottom Row: 3 metrics widgets */}
<div className="grid grid-cols-12 gap-3 sm:gap-4">
  <motion.div className="col-span-12 md:col-span-6 lg:col-span-4">
    <ZenCard><CompletionChart /></ZenCard>
  </motion.div>
  <motion.div className="col-span-12 md:col-span-6 lg:col-span-4">
    <ZenCard><PerformanceSummary /></ZenCard>
  </motion.div>
  <motion.div className="col-span-12 lg:col-span-4">
    <ZenCard><StreakStats /></ZenCard>
  </motion.div>
</div>
```

### 3. `src/components/dashboard/widgets/StreakStats.tsx` (NEW)

A new widget showing streak and monthly statistics with visual progress rings:

**Features:**
- Current streak with flame animation
- Longest streak record
- This week completion percentage with circular progress
- This month completion percentage with circular progress
- All data from `useChecklistAnalytics` hook

**Design:**
```typescript
export function StreakStats() {
  const { data: entries = [] } = useChecklistAnalytics(1);
  const analytics = calculateAnalytics(entries);

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <Flame className="w-4 h-4 text-orange-500" />
        Streak & Progress
      </h3>
      
      {/* Streak Row */}
      <div className="flex items-center justify-between">
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-500">{analytics.currentStreak}</p>
          <p className="text-[10px] text-muted-foreground">Current</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-emerald-500">{analytics.longestStreak}</p>
          <p className="text-[10px] text-muted-foreground">Longest</p>
        </div>
      </div>
      
      {/* Circular Progress for Week/Month */}
      <div className="grid grid-cols-2 gap-4">
        <CircularProgress value={analytics.thisWeekCompletion} label="This Week" />
        <CircularProgress value={analytics.thisMonthCompletion} label="This Month" />
      </div>
    </div>
  );
}
```

### 4. `src/components/dashboard/widgets/DailyChecklistPopover.tsx` - Journal Integration

**Changes:**
- When a task is marked complete, optionally create a journal entry in Notes
- Add "Add Journal Note" button that creates an entry in the domain's journal
- Link completed tasks to the Notes system

**New Flow:**
```typescript
const handleTaskClick = async (taskId: string) => {
  // Toggle task completion
  await toggleEntry.mutateAsync({
    taskId,
    entryDate: dateKey,
    isCompleted: !isCompleted,
  });
  
  // If completing, offer to create journal entry
  if (!isCompleted) {
    // Task is now completed - metrics auto-update via React Query
  }
};

// New "Quick Journal" button
const handleQuickJournal = async (taskId: string) => {
  const domain = TASK_TO_DOMAIN[taskId]; // prayer -> spiritual, trading -> trading
  await createNote.mutateAsync({
    title: `${format(date, 'MMM d')} - ${task.label}`,
    domain,
    note_type: 'journal',
    content: { type: 'doc', content: [] },
  });
  navigate('/notes', { state: { domain } });
};
```

### 5. `src/hooks/useChecklistEntries.ts` - Enhanced Real-Time

**Changes:**
- Add optimistic updates to `useToggleChecklistEntry`
- Use `staleTime: 0` for immediate refetches
- Return `refetch` function for manual refresh triggers

**Optimistic Update Pattern:**
```typescript
export function useToggleChecklistEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, entryDate, isCompleted }) => {
      // ... existing mutation logic
    },
    onMutate: async ({ taskId, entryDate, isCompleted }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ["checklist-entries"] });
      
      // Snapshot previous value
      const previous = queryClient.getQueryData(["checklist-entries"]);
      
      // Optimistically update
      queryClient.setQueryData(["checklist-entries"], (old) => {
        // Add or remove entry optimistically
      });
      
      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(["checklist-entries"], context?.previous);
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: ["checklist-entries"] });
      queryClient.invalidateQueries({ queryKey: ["checklist-analytics"] });
    },
  });
}
```

### 6. Task-to-Domain Mapping (in DailyChecklistPopover)

**New constant:**
```typescript
const TASK_TO_DOMAIN: Record<string, DomainId> = {
  prayer: 'spiritual',
  bible: 'spiritual',
  trading: 'trading',
  gym: 'projects', // or a health domain if added
};
```

---

## New Widget: Circular Progress Component

Create a reusable circular progress indicator:

**`src/components/ui/circular-progress.tsx`**
```typescript
interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function CircularProgress({ 
  value, 
  size = 60, 
  strokeWidth = 4,
  label 
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size}>
        <circle
          className="text-muted/30"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-primary transition-all duration-500"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <span className="text-lg font-semibold -mt-10">{value}%</span>
      {label && <span className="text-[10px] text-muted-foreground mt-1">{label}</span>}
    </div>
  );
}
```

---

## Implementation Order

1. Create `CircularProgress` UI component
2. Create `StreakStats` widget with circular progress
3. Update `InteractiveCalendar` to ultra-compact with today's tasks footer
4. Update `ZenLayout` grid to 5-4-3 + 4-4-4 layout
5. Enhance `useChecklistEntries` with optimistic updates
6. Update `DailyChecklistPopover` with journal integration
7. Test real-time metric updates across all widgets

---

## Data Flow for Real-Time Updates

```text
User clicks task checkbox
        ↓
DailyChecklistPopover.handleTaskClick()
        ↓
useToggleChecklistEntry.mutate() 
        ↓
┌───────────────────────────────────────┐
│  Optimistic Update (instant UI)      │
│  - Update checklist-entries cache    │
│  - Charts/stats immediately reflect  │
└───────────────────────────────────────┘
        ↓
Supabase mutation completes
        ↓
┌───────────────────────────────────────┐
│  Query Invalidation                   │
│  - checklist-entries refetch         │
│  - checklist-analytics refetch       │
│  - All widgets auto-update           │
└───────────────────────────────────────┘
```

---

## Result

After implementation:
- **Ultra-compact calendar** - Shows inline remaining tasks for today
- **Balanced layout** - Devotion and Notes get proper prominence
- **New StreakStats widget** - Visual circular progress for week/month
- **Real-time metrics** - All charts and stats update instantly on task toggle
- **Journal integration** - Option to create Notes entries from checklist
- **3-column analytics row** - More metrics density at a glance

