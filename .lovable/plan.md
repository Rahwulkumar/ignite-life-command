

# Dashboard Analytics + Notion-Style Notes Page

This plan implements two major features: real-time task analytics with interactive filters on the dashboard, and a full-featured Notion-style notes page accessible from both the dashboard and top navigation.

---

## Overview

### Feature 1: Task Analytics Dashboard
An interactive analytics panel on the dashboard calendar area that displays completion rates, streaks, and per-task statistics with filterable views.

### Feature 2: Notion-Style Notes Page
A dedicated `/notes` page with folder organization, nested pages, rich text editing (Tiptap), templates, and search functionality.

---

## User Experience Flow

```text
DASHBOARD ANALYTICS FLOW:
+------------------+     +----------------------+     +--------------------+
|  Interactive     | --> | Click "View          | --> | Analytics Panel    |
|  Calendar        |     | Analytics" button    |     | with Filters       |
+------------------+     +----------------------+     +--------------------+
        |                         |                           |
        v                         v                           v
  Shows completion          Opens inline               Filter by:
  status per day            analytics view             - Weekly / Monthly
                                                       - Task type
                                                       - Date range
```

```text
NOTES PAGE FLOW:
+------------------+     +------------------+     +------------------+
|  Top Nav or      | --> | Notes Sidebar    | --> | Editor View      |
|  Dashboard Link  |     | (folders/pages)  |     | (Tiptap rich)    |
+------------------+     +------------------+     +------------------+
        |                         |                       |
        v                         v                       v
  Navigate to           Browse nested           Full formatting:
  /notes page           page structure          Bold, lists, code,
                                                templates, search
```

---

## Feature 1: Task Analytics Dashboard

### Analytics Components

| Component | Purpose |
|-----------|---------|
| `AnalyticsPanel.tsx` | Main container with filter tabs and visualizations |
| `CompletionChart.tsx` | Bar chart showing weekly/monthly completion rates |
| `StreakDisplay.tsx` | Current streak, longest streak, and streak calendar heatmap |
| `TaskBreakdown.tsx` | Per-task statistics (Prayer %, Bible %, GYM %) with radial progress |
| `AnalyticsFilters.tsx` | Filter controls (time range, task type) |

### Analytics Data Structure

```text
Analytics Summary:
+-- Overall Stats
|   +-- Current streak: 7 days
|   +-- Longest streak: 23 days
|   +-- This week: 85% completion
|   +-- This month: 78% completion
|
+-- Per-Task Stats
|   +-- Prayer: 92% (23/25 days)
|   +-- Bible Reading: 88% (22/25 days)
|   +-- GYM: 80% (16/20 scheduled days)
|
+-- Weekly Chart
    +-- Mon: 3/3 (100%)
    +-- Tue: 2/3 (67%)
    +-- Wed: 3/3 (100%)
    ...
```

### UI Integration

The analytics will appear when clicking an "Analytics" button on the calendar widget:

```text
+----------------------------------------+
| January 2026              [< >]        |
|----------------------------------------|
|  S   M   T   W   T   F   S             |
| ...calendar days with indicators...    |
|----------------------------------------|
| [Analytics] button at bottom           |
+----------------------------------------+
         |
         v (expands to show)
+----------------------------------------+
| ANALYTICS PANEL                        |
|----------------------------------------|
| [Weekly] [Monthly] [All Time]  filters |
|----------------------------------------|
| Current Streak: 7 days                 |
| Longest Streak: 23 days                |
|----------------------------------------|
| Weekly Completion Chart                |
| [Bar chart visualization]              |
|----------------------------------------|
| Task Breakdown:                        |
| Prayer      [========--] 92%          |
| Bible       [=======---] 88%          |
| GYM         [======----] 80%          |
+----------------------------------------+
```

### Database Table

A new `daily_checklist_entries` table to persist checklist completions:

```text
daily_checklist_entries
+------------------+-------------+------------------------+
| Column           | Type        | Description            |
+------------------+-------------+------------------------+
| id               | UUID        | Primary key            |
| user_id          | UUID        | Owner (RLS enforced)   |
| task_id          | TEXT        | prayer/bible/gym       |
| entry_date       | DATE        | The date of entry      |
| is_completed     | BOOLEAN     | Completion status      |
| duration_seconds | INTEGER     | Optional timer data    |
| notes            | TEXT        | Optional notes         |
| created_at       | TIMESTAMP   | Record creation time   |
| updated_at       | TIMESTAMP   | Last update time       |
+------------------+-------------+------------------------+
| UNIQUE(user_id, task_id, entry_date)                    |
+------------------+-------------+------------------------+
```

RLS Policies:
- SELECT, INSERT, UPDATE, DELETE: Only own entries (user_id = auth.uid())

---

## Feature 2: Notion-Style Notes Page

### Core Features

1. **Folder/Page Structure**: Nested pages with parent-child relationships
2. **Rich Text Editor**: Tiptap with formatting toolbar (bold, italic, underline, lists, code blocks, quotes)
3. **Templates**: Pre-defined note templates (Meeting Notes, Daily Journal, etc.)
4. **Search**: Full-text search across all notes
5. **Icons & Covers**: Emoji icons and optional cover images for pages

### Page Layout

```text
/notes Page Structure:
+-------------------------------------------------------+
| TopNavigation (with Notes link highlighted)           |
+-------------------------------------------------------+
|                                                       |
| +------------------+ +------------------------------+ |
| | SIDEBAR          | | EDITOR AREA                  | |
| |------------------| |------------------------------| |
| | [Search...]      | | [Icon] Page Title            | |
| |                  | | [Cover image area]           | |
| | Quick Access     | |                              | |
| |  - Pinned pages  | | +-------------------------+  | |
| |                  | | | Rich text content       |  | |
| | Pages            | | |                         |  | |
| |  > Folder 1      | | | Formatting toolbar:     |  | |
| |    - Page A      | | | [B][I][U][Link][List]   |  | |
| |    - Page B      | | |                         |  | |
| |  > Folder 2      | | | Auto-save indicator     |  | |
| |    - Page C      | | +-------------------------+  | |
| |                  | |                              | |
| | Templates        | |                              | |
| |  - Meeting Notes | |                              | |
| |  - Daily Journal | |                              | |
| |                  | |                              | |
| | [+ New Page]     | |                              | |
| +------------------+ +------------------------------+ |
+-------------------------------------------------------+
```

### Components Structure

| Component | Purpose |
|-----------|---------|
| `NotesPage.tsx` | Main page layout with sidebar + editor |
| `NotesSidebar.tsx` | Navigation tree with folders, pages, templates |
| `NoteEditor.tsx` | Tiptap-based rich text editor |
| `PageHeader.tsx` | Icon picker, title, cover image |
| `NotesSearch.tsx` | Search bar with results dropdown |
| `TemplateSelector.tsx` | Choose from pre-made templates |
| `PageTreeItem.tsx` | Recursive tree item for nested pages |

### Using Existing Database

The project already has an `office_notes` table with:
- `id`, `user_id`, `title`, `content` (JSONB for rich text)
- `parent_id` (for nesting), `icon`, `cover_image`
- `is_pinned`, `is_template`
- RLS policies already configured

This table perfectly supports the Notion-style structure!

### Rich Text Editor Features (Tiptap)

The project has Tiptap extensions installed:
- `@tiptap/starter-kit` (basic formatting)
- `@tiptap/extension-placeholder`
- `@tiptap/extension-link`
- `@tiptap/extension-underline`
- `@tiptap/extension-highlight`
- `@tiptap/extension-task-list` & `task-item`
- `@tiptap/extension-code-block-lowlight`
- `@tiptap/extension-bubble-menu`

Formatting toolbar will include:
- Bold, Italic, Underline, Strikethrough
- Headings (H1, H2, H3)
- Bullet & Numbered Lists
- Task/Checkbox Lists
- Code Blocks with syntax highlighting
- Links
- Blockquotes
- Highlight/Marker

---

## Navigation Updates

Add "Notes" to the top navigation bar:

```text
Current navItems:
Home | Finance | Investments | Tech | Spiritual | Music | Content | Projects

Updated navItems:
Home | Finance | Investments | Tech | Spiritual | Music | Content | Projects | Notes
```

Also add a quick access button on the dashboard calendar area linking to `/notes`.

---

## Implementation Phases

### Phase 1: Database + Data Layer
1. Create `daily_checklist_entries` table with RLS policies
2. Create React Query hooks for checklist CRUD operations
3. Create React Query hooks for `office_notes` CRUD operations
4. Update `ZenLayout` to persist calendar completions to database

### Phase 2: Notes Page Foundation
1. Create `NotesPage.tsx` with sidebar + editor layout
2. Implement `NotesSidebar.tsx` with page tree navigation
3. Build `NoteEditor.tsx` using Tiptap with formatting toolbar
4. Add `/notes` route to App.tsx
5. Add "Notes" link to TopNavigation

### Phase 3: Notes Features
1. Implement nested page creation and navigation
2. Add `PageHeader.tsx` with icon picker and cover images
3. Create `NotesSearch.tsx` with full-text filtering
4. Build `TemplateSelector.tsx` with preset templates
5. Add auto-save functionality with debouncing

### Phase 4: Analytics Dashboard
1. Create `AnalyticsPanel.tsx` main container
2. Build `CompletionChart.tsx` using Recharts (already installed)
3. Implement `StreakDisplay.tsx` with heatmap calendar
4. Create `TaskBreakdown.tsx` with radial progress indicators
5. Add `AnalyticsFilters.tsx` for time range and task filtering

### Phase 5: Integration
1. Add analytics trigger button to InteractiveCalendar
2. Add quick access to Notes from dashboard
3. Ensure responsive design for mobile views
4. Polish animations and transitions

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/pages/NotesPage.tsx` | Main notes page component |
| `src/components/notes/NotesSidebar.tsx` | Sidebar navigation |
| `src/components/notes/NoteEditor.tsx` | Tiptap rich text editor |
| `src/components/notes/PageHeader.tsx` | Page title, icon, cover |
| `src/components/notes/PageTreeItem.tsx` | Recursive tree navigation |
| `src/components/notes/NotesSearch.tsx` | Search functionality |
| `src/components/notes/TemplateSelector.tsx` | Template picker |
| `src/components/notes/EditorToolbar.tsx` | Formatting toolbar |
| `src/components/dashboard/widgets/AnalyticsPanel.tsx` | Analytics container |
| `src/components/dashboard/widgets/CompletionChart.tsx` | Weekly/monthly chart |
| `src/components/dashboard/widgets/StreakDisplay.tsx` | Streak visualization |
| `src/components/dashboard/widgets/TaskBreakdown.tsx` | Per-task stats |
| `src/components/dashboard/widgets/AnalyticsFilters.tsx` | Filter controls |
| `src/hooks/useChecklistEntries.ts` | React Query for checklist |
| `src/hooks/useNotes.ts` | React Query for notes CRUD |

## Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add `/notes` route |
| `src/components/shared/TopNavigation.tsx` | Add "Notes" nav item |
| `src/components/dashboard/layouts/ZenLayout.tsx` | Integrate analytics, add Notes quick link |
| `src/components/dashboard/widgets/InteractiveCalendar.tsx` | Add analytics button, persist to DB |
| `src/components/dashboard/widgets/DailyChecklistPopover.tsx` | Connect to database |

---

## Technical Details

### Tiptap Editor Configuration

```text
Extensions:
+-- StarterKit (bold, italic, strike, code, headings, lists)
+-- Placeholder ("Start writing...")
+-- Link (inline links)
+-- Underline
+-- Highlight (text marker)
+-- TaskList + TaskItem (checkboxes)
+-- CodeBlockLowlight (syntax highlighting)
+-- BubbleMenu (floating toolbar)
```

### State Management

- **Notes**: React Query with optimistic updates
- **Checklist entries**: React Query with invalidation on toggle
- **Analytics**: Computed from checklist entries query

### Performance Considerations

- Lazy load notes content (only fetch when page selected)
- Debounce auto-save (500ms)
- Virtualized sidebar list for many pages
- Paginated analytics queries for long date ranges

