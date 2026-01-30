

# Domain-Based Knowledge & Journal System

This plan creates a separate Notion-style workspace for **each domain** (Spiritual, Trading, Tech, Finance, Music, Projects, Content, etc.) with both long-form pages and quick daily journal entries.

---

## Summary of Changes

| Change | Description |
|--------|-------------|
| Database Schema | Add `domain` and `note_type` columns to categorize notes |
| Domain Hubs | Auto-create hub pages for each domain (Spiritual, Trading, Tech, Finance, Music, Projects, Content) |
| Nested Pages | Long-form notes organized under domain hubs |
| Tiny Journal | Quick daily reflection entries tied to domains |
| Dashboard Integration | NotesWidget shows domain-grouped recent entries |
| Contextual Access | Each domain page can open its own notes workspace |

---

## Architecture Overview

```text
Notes System
├── 🙏 Spiritual
│   ├── [Pages] Character Study: David, Romans Notes, etc.
│   └── [Journal] Quick daily reflections after prayer/Bible
│
├── 📈 Trading
│   ├── [Pages] Chart Patterns, Strategy Notes, etc.
│   └── [Journal] Post-session reflections
│
├── 💻 Tech
│   ├── [Pages] React Patterns, AWS Notes, etc.
│   └── [Journal] Learning logs
│
├── 💰 Finance
│   ├── [Pages] Budget Planning, Investment Thesis
│   └── [Journal] Financial decisions/learnings
│
├── 🎵 Music
│   ├── [Pages] Song Analysis, Practice Plans
│   └── [Journal] Practice session notes
│
├── 📁 Projects
│   ├── [Pages] Project documentation
│   └── [Journal] Progress updates
│
└── 📚 Content
    ├── [Pages] Book notes, Article summaries
    └── [Journal] Content consumption log
```

---

## Domain Configuration

Define all domains with their icons and labels:

```text
DOMAINS = [
  { id: 'spiritual', label: 'Spiritual', icon: '🙏', path: '/spiritual' },
  { id: 'trading', label: 'Trading', icon: '📈', path: '/investments' },
  { id: 'tech', label: 'Tech', icon: '💻', path: '/tech' },
  { id: 'finance', label: 'Finance', icon: '💰', path: '/finance' },
  { id: 'music', label: 'Music', icon: '🎵', path: '/music' },
  { id: 'projects', label: 'Projects', icon: '📁', path: '/projects' },
  { id: 'content', label: 'Content', icon: '📚', path: '/content' },
]
```

---

## Database Migration

Add two new columns to `office_notes`:

**New Columns:**
- `domain` (text, nullable): 'spiritual', 'trading', 'tech', 'finance', 'music', 'projects', 'content'
- `note_type` (text, default 'page'): 'hub', 'page', 'journal'

**SQL:**
```sql
ALTER TABLE office_notes 
ADD COLUMN domain text,
ADD COLUMN note_type text DEFAULT 'page';

-- Add check constraint
ALTER TABLE office_notes 
ADD CONSTRAINT valid_domain 
CHECK (domain IN ('spiritual', 'trading', 'tech', 'finance', 'music', 'projects', 'content') OR domain IS NULL);

ALTER TABLE office_notes 
ADD CONSTRAINT valid_note_type 
CHECK (note_type IN ('hub', 'page', 'journal'));
```

---

## Note Types Explained

| Type | Purpose | Behavior |
|------|---------|----------|
| `hub` | Domain container page | Auto-created, cannot be deleted, shows nested pages + journal entries |
| `page` | Long-form documentation | Standard Notion-style nested pages |
| `journal` | Quick daily reflection | Lightweight, date-tagged, shown in compact list |

---

## New Sidebar Structure

The Notes sidebar now organizes by domain:

```text
+----------------------------------+
| 🔍 Search...                     |
+----------------------------------+
| 📌 PINNED                        |
| └── Quick reference page         |
+----------------------------------+
| 🙏 SPIRITUAL                     |
| ├── Character Study: David       |
| ├── Romans Notes                 |
| ├── 📓 Journal (3 entries)       |
| └── + New page                   |
+----------------------------------+
| 📈 TRADING                       |
| ├── Chart Patterns               |
| ├── Strategy Notes               |
| ├── 📓 Journal (5 entries)       |
| └── + New page                   |
+----------------------------------+
| 💻 TECH                          |
| ...                              |
+----------------------------------+
```

---

## Journal Entry System

**Quick Entry Form:**
- Compact inline form (title + optional body)
- Auto-tagged with current date
- Domain pre-selected based on context
- Appears at top of hub page or in dashboard widget

**Journal List View:**
- Compact cards showing date, title, snippet
- Sorted by date (newest first)
- Filterable within each domain hub

**Entry Structure:**
```text
+----------------------------------+
| Jan 30, 2026                     |
| Morning reflection on David's    |
| courage facing Goliath           |
| [Edit] [View]                    |
+----------------------------------+
```

---

## Hub Page Layout

When viewing a domain hub (e.g., Spiritual Hub):

```text
+-----------------------------------------------+
| 🙏 Spiritual                                  |
| Your spiritual growth workspace               |
+-----------------------------------------------+
| [+ New Page]  [+ Quick Journal]               |
+-----------------------------------------------+
| PAGES                                         |
| +--------+ +--------+ +--------+              |
| |📖      | |✝️      | |🙏      |  <- Gallery  |
| |David   | |Romans  | |Prayer  |              |
| +--------+ +--------+ +--------+              |
+-----------------------------------------------+
| JOURNAL (Recent)                              |
| +------------------------------------------+  |
| | Jan 30 | Morning reflection on David... |  |
| | Jan 29 | Character study notes...       |  |
| | Jan 28 | Memorized Romans 8:28          |  |
| +------------------------------------------+  |
| [View all journal entries]                    |
+-----------------------------------------------+
```

---

## Dashboard NotesWidget Update

Show recent entries grouped by domain:

```text
+----------------------------------+
| 📓 Recent Notes                  |
+----------------------------------+
| 🙏 Morning reflection on...      |
| 📈 AAPL chart analysis           |
| 💻 React patterns learned        |
| 🎵 Practice session notes        |
| ─────────────────────────────    |
| + Quick journal entry            |
+----------------------------------+
```

Clicking "+ Quick journal entry" opens a modal to select domain and add entry.

---

## Implementation Steps

### Phase 1: Database & Core Hooks

1. **Database migration** - Add `domain` and `note_type` columns
2. **Update useNotes.ts** - Add domain/type filtering, hub initialization logic
3. **Create domain config** - Centralized domain definitions

### Phase 2: Notes Components

4. **Update NotesSidebar** - Domain-grouped structure with collapsible sections
5. **Create HubView component** - Hub page with pages gallery + journal section
6. **Create JournalList component** - Compact journal entry display
7. **Create JournalEntryForm** - Quick entry modal/inline form

### Phase 3: Integration

8. **Update NotesPage** - Handle hub vs page vs journal rendering
9. **Update NotesWidget** - Domain-aware with quick add
10. **Add domain links** - Each domain page can link to its notes section

---

## Files to Create/Modify

| File | Changes |
|------|---------|
| **Database** | Migration: Add `domain` and `note_type` columns |
| `src/lib/domains.ts` | NEW - Centralized domain configuration |
| `src/hooks/useNotes.ts` | Add domain filtering, hub initialization, journal hooks |
| `src/components/notes/NotesSidebar.tsx` | Domain-grouped collapsible sections |
| `src/components/notes/HubView.tsx` | NEW - Hub page layout with gallery + journal |
| `src/components/notes/JournalList.tsx` | NEW - Compact journal entries display |
| `src/components/notes/JournalEntryForm.tsx` | NEW - Quick journal entry form |
| `src/pages/NotesPage.tsx` | Handle different view modes (hub/page/journal) |
| `src/components/dashboard/widgets/NotesWidget.tsx` | Domain-grouped display, quick add |

---

## User Flows

**Creating a new page in a domain:**
1. Navigate to Notes page
2. Expand "Spiritual" section in sidebar
3. Click "+ New page"
4. Page auto-created with domain='spiritual'
5. No "Untitled" clutter - always nested under domain

**Quick journal entry (from dashboard):**
1. Click "+ Quick journal entry" in NotesWidget
2. Modal opens: select domain, enter title + optional note
3. Entry saved with domain + note_type='journal' + today's date
4. Appears in widget and domain hub

**Viewing domain notes:**
1. Navigate to Spiritual page
2. Click "Notes" tab or link
3. See all spiritual pages + journal entries
4. Can create new pages/journal directly from domain page

---

## Auto-Initialize Hubs

On first load (when no hubs exist for user), auto-create:

```text
- Spiritual Hub (icon: 🙏, domain: 'spiritual', note_type: 'hub')
- Trading Hub (icon: 📈, domain: 'trading', note_type: 'hub')
- Tech Hub (icon: 💻, domain: 'tech', note_type: 'hub')
- Finance Hub (icon: 💰, domain: 'finance', note_type: 'hub')
- Music Hub (icon: 🎵, domain: 'music', note_type: 'hub')
- Projects Hub (icon: 📁, domain: 'projects', note_type: 'hub')
- Content Hub (icon: 📚, domain: 'content', note_type: 'hub')
```

These are permanent containers that organize all domain content.

---

## Result

A clean, organized knowledge system where:
- **Each domain has its own workspace** - Spiritual, Trading, Tech, Finance, Music, Projects, Content
- **Long-form pages nest under domains** - No loose "Untitled" pages
- **Quick journal entries** for daily reflections tied to domains
- **Dashboard widget** shows recent entries across all domains
- **Contextual access** - Each domain page can link directly to its notes
- **Zero clutter** - Everything organized under clear domain categories

