

# Simplified Dashboard: Daily Priorities + Trading Analytics

This plan streamlines the dashboard to focus on what you prioritize every day, adds Trading as a tracked task, and displays analytics directly on the dashboard.

---

## Summary of Changes

| Change | Description |
|--------|-------------|
| Remove HabitTracker | Delete the habits grid widget (water, gym, devotion, sleep, nutrition) |
| Remove GoalProgress cards | Delete Devotional, Fitness, Coding goal cards |
| Remove Activity + Insight row | Delete the bottom row with ActivityChart and InsightCard |
| Add Trading task | New tracked activity in the daily checklist |
| Analytics on Dashboard | Display analytics panel directly in the main dashboard layout |
| Read-only completed days | When all tasks are done for a day, clicking navigates to notes instead of toggling |
| Link tasks to Notes | Clicking task labels navigates to `/notes` page |

---

## New Dashboard Layout

The simplified dashboard will have this structure:

```text
+-----------------------------------------------+
|  Calendar (5 cols)     |  Devotion (7 cols)   |
|  - Click days to view  |  - Scripture reading |
|  - Task completion     |  - Character study   |
+-----------------------------------------------+
|           Analytics Panel (full width)        |
|  [Weekly] [Monthly] [All Time] filter tabs    |
|  +----------+ +----------+ +--------------+   |
|  | Streak   | | Compl.   | | Task         |   |
|  | Stats    | | Chart    | | Breakdown    |   |
|  | 7 days   | | (bars)   | | Prayer  85%  |   |
|  | longest  | |          | | Bible   90%  |   |
|  +----------+ +----------+ | GYM     75%  |   |
|                            | Trading 60%  |   |
|                            +--------------+   |
+-----------------------------------------------+
```

---

## New Task: Trading

Trading will be added as a daily tracked task alongside the spiritual and fitness activities.

**Task Definition:**
- ID: `trading`
- Label: `Trading/Charts`
- Icon: `TrendingUp` (from lucide-react)
- Frequency: `daily` (tracked every day)

This means:
- Appears in the daily checklist popover when clicking calendar days
- Shows in the Task Breakdown analytics with its own progress bar (amber color)
- Contributes to streak calculations and completion percentages

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/dashboard/layouts/ZenLayout.tsx` | Remove HabitTracker, GoalProgress row, Activity/Insight row. Add AnalyticsPanel |
| `src/components/dashboard/widgets/DailyChecklistPopover.tsx` | Add Trading task, read-only mode, notes navigation |
| `src/components/dashboard/widgets/TaskBreakdown.tsx` | Add Trading to display |
| `src/hooks/useChecklistEntries.ts` | Update calculateAnalytics to include Trading |
| `src/components/dashboard/widgets/AnalyticsPanel.tsx` | Convert to standalone widget |
| `src/components/dashboard/widgets/InteractiveCalendar.tsx` | Remove Analytics button, update task count |
| `src/pages/Index.tsx` | Remove unused habits state and props |

---

## Detailed Changes

### 1. DailyChecklistPopover.tsx - Add Trading + Read-Only Mode

**Add Trading to defaultTasks:**
```text
defaultTasks = [
  { id: "prayer", label: "Prayer", icon: BookOpen, frequency: "daily" },
  { id: "bible", label: "Bible Reading", icon: BookOpen, frequency: "daily" },
  { id: "gym", label: "GYM", icon: Dumbbell, frequency: "weekly", daysOfWeek: [1,2,3,4,5] },
  { id: "trading", label: "Trading/Charts", icon: TrendingUp, frequency: "daily" },  // NEW
]
```

**Add read-only logic:**
- When all tasks for a day are complete, display "Completed" badge
- Checkbox clicks navigate to notes instead of toggling
- Task label clicks always navigate to `/notes`
- Use `useNavigate` from react-router-dom

### 2. TaskBreakdown.tsx - Add Trading Display

Add Trading with amber color:
```text
tasks = [
  { id: "prayer", label: "Prayer", icon: BookOpen, color: "bg-purple-500" },
  { id: "bible", label: "Bible Reading", icon: BookOpen, color: "bg-blue-500" },
  { id: "gym", label: "GYM", icon: Dumbbell, color: "bg-emerald-500" },
  { id: "trading", label: "Trading", icon: TrendingUp, color: "bg-amber-500" },  // NEW
]
```

### 3. useChecklistEntries.ts - Update Analytics

- Add `trading: 0` to taskCounts initialization
- Add trading to taskBreakdown return object
- Update completion calculations: 3 daily tasks * 7 days + 5 gym days = 26 max per week

### 4. AnalyticsPanel.tsx - Standalone Widget

Convert from collapsible to always-visible:
- Remove `isOpen` and `onClose` props
- Remove AnimatePresence wrapper
- Make it a full card component with permanent visibility
- Keep the filter tabs (Weekly, Monthly, All Time)

### 5. InteractiveCalendar.tsx - Remove Analytics Button

- Remove the Analytics button from footer
- Remove AnalyticsPanel import and state
- Keep the Notes quick-link button
- Update `defaultDailyTaskCount` from 2 to 3 (prayer, bible, trading)

### 6. ZenLayout.tsx - Simplified Structure

**Remove:**
- Lines 128-135: HabitTracker section
- Lines 137-183: GoalProgress row (Devotional, Fitness, Coding)
- Lines 185-206: Activity + Insight row
- Unused imports: GoalProgress, HabitTracker, ActivityChart, InsightCard, Lightbulb

**Add:**
- Import AnalyticsPanel
- Render AnalyticsPanel as full-width section after Calendar + Devotion row

### 7. Index.tsx - Cleanup

- Remove unused `habits` state, `toggleHabit`, `updateHabit` functions
- Remove `defaultHabits` import
- Remove corresponding props from ZenLayout usage

---

## Technical Details

### Read-Only Detection Logic

```text
For a given date:
1. Get all tasks scheduled for that day (3 daily + optional gym)
2. Get all completed tasks for that day
3. If completed.length >= scheduled.length AND scheduled.length > 0:
   -> Read-only mode: display "Completed" badge
   -> Clicking checkbox navigates to notes
4. Else:
   -> Normal mode: allow toggling
```

### Analytics Calculation Update

- Daily tasks: Prayer, Bible, Trading (3 tasks)
- Weekly tasks: GYM (Mon-Fri only)
- Week completion: `(entries / 26) * 100` (3 daily * 7 + 1 gym * 5)
- Month completion: `(entries / (days * 3 + weekdays)) * 100`

### Component Reuse

The existing components are reused efficiently:
- `AnalyticsPanel` uses existing `StreakDisplay`, `CompletionChart`, `TaskBreakdown`
- `ZenLayout` reuses existing `ZenCard` wrapper component
- `InteractiveCalendar` and `DailyChecklistPopover` connection stays the same

