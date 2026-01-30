

# Simplified Analytics: Bar Chart + Performance Summary

This plan simplifies the analytics section to just two clean widgets: a bar chart and a text-based performance summary, plus swaps the calendar/devotion positions and adds animated video to the Devotion banner.

---

## Summary of Changes

| Change | Description |
|--------|-------------|
| Simplify Analytics | Replace complex analytics with 2 widgets: Bar Chart + Text Summary |
| Swap Positions | Devotion moves left (5 cols), Calendar moves right (7 cols) |
| Add Video | Animated `video-spiritual.mp4` background on Devotion banner |
| Clean Layout | Minimal, focused dashboard with clear visual hierarchy |

---

## New Dashboard Layout

```text
+-----------------------------------------------+
|  Devotion (5 cols)     |  Calendar (7 cols)   |
|  [Video background]    |  - Click days        |
|  - Scripture reading   |  - Toggle tasks      |
+-----------------------------------------------+
|  Bar Chart (6 cols)    |  Performance (6 cols)|
|  - Weekly completion   |  - "You completed    |
|  - Color-coded bars    |    85% this week"    |
|                        |  - Top priority task |
|                        |  - Streak info       |
+-----------------------------------------------+
```

---

## Detailed Changes

### 1. Create PerformanceSummary Widget (NEW)

A simple text-based widget showing how you've performed:

**Content:**
- Headline stat: "You completed X% of tasks this week"
- Top priority task: Which task you're most consistent with
- Current streak: "X day streak"
- Quick insight: "Trading needs attention" or "Great consistency!"

**Design:**
- Clean typography, no charts or graphs
- Subtle icons for visual interest
- Motivational but data-driven

### 2. Update ZenLayout - Swap + New Grid

**Swap positions:**
- Devotion: `col-span-5` (left)
- Calendar: `col-span-7` (right)

**Analytics row:**
- Bar Chart: `col-span-6` (left)
- Performance Summary: `col-span-6` (right)

### 3. Update DevotionBanner - Add Video

Add the `video-spiritual.mp4` as a subtle background:

**Layers:**
1. Video layer (looping, muted, 30-40% opacity)
2. Gradient overlay (for text readability)
3. Content layer (existing text + icons)

### 4. Simplify CompletionChart

Keep the existing bar chart but:
- Update expected tasks to 4 (prayer, bible, trading, gym on weekdays)
- Keep the color-coded bars (green=100%, yellow=50%+, red=<50%)

---

## Files to Modify/Create

| File | Changes |
|------|---------|
| `src/components/dashboard/widgets/PerformanceSummary.tsx` | NEW - Text-based performance widget |
| `src/components/dashboard/widgets/DevotionBanner.tsx` | Add video background with overlay |
| `src/components/dashboard/layouts/ZenLayout.tsx` | Swap positions, replace AnalyticsPanel with 2 widgets |
| `src/components/dashboard/widgets/CompletionChart.tsx` | Update task count calculation |

---

## PerformanceSummary Widget Design

```text
+----------------------------------+
|  📊 This Week                    |
|                                  |
|  You completed 85% of your       |
|  daily priorities                |
|                                  |
|  ─────────────────────────────   |
|                                  |
|  🔥 7 day streak                 |
|                                  |
|  ⭐ Most consistent: Bible       |
|     (completed 6/7 days)         |
|                                  |
|  ⚠️ Needs focus: Trading         |
|     (completed 3/7 days)         |
+----------------------------------+
```

**Data Sources:**
- Uses the same `useChecklistAnalytics` hook
- Calculates which task has highest/lowest completion
- Shows actionable insights based on data

---

## DevotionBanner Video Structure

```text
<Link to="/spiritual">
  {/* Video Background */}
  <div className="absolute inset-0">
    <video autoPlay loop muted playsInline className="opacity-40">
      <source src={videoSpiritual} />
    </video>
    <div className="absolute inset-0 bg-gradient-to-r from-card/90 to-card/60" />
  </div>
  
  {/* Content (unchanged) */}
  <div className="relative z-10">
    ... existing Morning Devotion content ...
  </div>
</Link>
```

---

## Implementation Steps

1. **Create PerformanceSummary.tsx** - New text-based widget with:
   - Weekly completion percentage headline
   - Current streak display
   - Best/worst performing task identification
   - Uses existing analytics hook

2. **Update DevotionBanner.tsx** - Add:
   - Video import
   - Absolute positioned video layer
   - Gradient overlay
   - z-index layering for content

3. **Update ZenLayout.tsx** - Changes:
   - Swap calendar (col-span-7) and devotion (col-span-5)
   - Replace `AnalyticsPanel` with 2-column grid
   - Import and use `CompletionChart` and `PerformanceSummary`

4. **Update CompletionChart.tsx** - Adjust:
   - Update expected tasks: 4 on weekdays (prayer, bible, trading, gym), 3 on weekends
   - Keep all existing styling and color logic

5. **Remove AnalyticsPanel.tsx** - No longer needed

---

## Result

A clean, focused dashboard with:
- **Devotion Banner** (left) - Animated video background, links to spiritual page
- **Calendar** (right) - Interactive daily task toggling
- **Bar Chart** (bottom-left) - Visual weekly completion trend
- **Performance Summary** (bottom-right) - Text insights on your priorities

No complex analytics panels or multiple stat grids - just clear, actionable information about your daily priorities.

