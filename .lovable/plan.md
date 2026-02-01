

# Replace Emojis with Professional Lucide Icons

This plan removes all emoji icons and replaces them with clean, professional Lucide icons throughout the notes system. It also transforms the dashboard widget to show domain workspaces instead of recent notes.

---

## Summary of Changes

| Area | Current | After |
|------|---------|-------|
| Domain Icons | Emojis (🙏, 📈, 💻, etc.) | Lucide icons (Heart, TrendingUp, Code, etc.) |
| Note Icons | Emoji fallback (📝) | Lucide FileText icon |
| Hub Icons | 🏠 emoji | Lucide Home icon |
| Pinned Indicator | 📌 emoji | Lucide Pin icon |
| Dashboard Widget | Shows recent notes with emojis | Shows domain workspace links with Lucide icons |

---

## Domain Icon Mapping

| Domain | Icon Name | Lucide Component |
|--------|-----------|------------------|
| Spiritual | heart | Heart |
| Trading | trending-up | TrendingUp |
| Tech | code | Code |
| Finance | wallet | Wallet |
| Music | music | Music |
| Projects | folder-kanban | FolderKanban |
| Content | book-open | BookOpen |

---

## Files to Modify

### 1. `src/lib/domains.ts`
- Change `icon` field from emoji string to Lucide icon name (e.g., `'heart'`, `'trending-up'`)
- Add `DomainIcon` React component that renders the correct Lucide icon
- Update `getDomainIcon` to return icon name instead of emoji

### 2. `src/components/notes/DomainSection.tsx`
- Replace `{domain.icon}` with `<DomainIcon domainId={domain.id} />`
- Replace `🏠` with `<Home />` icon
- Replace note icons `{note.icon || "📝"}` with `<FileText />` icon

### 3. `src/components/notes/HubView.tsx`
- Replace `{domainConfig?.icon}` with `<DomainIcon domainId={domain} />`
- Replace page icons `{page.icon || "📝"}` with `<FileText />` icon

### 4. `src/components/notes/NotesSidebar.tsx`
- Replace emoji note icons with `<FileText />` Lucide icon
- Replace pinned icon 📌 with `<Pin />` Lucide icon

### 5. `src/components/notes/JournalEntryForm.tsx`
- Replace emoji in domain selector with `<DomainIcon />` component
- Remove emoji icon assignment when creating notes (use `null` instead)

### 6. `src/components/dashboard/widgets/NotesWidget.tsx`
- Transform to show domain workspace links instead of recent notes
- Display all 7 domains with Lucide icons
- Each link navigates to Notes page with that domain active
- Show page/journal count per domain

### 7. `src/hooks/useNotes.ts`
- Remove emoji default icons (change `"📝"` to `null`)
- Update hub initialization to use `null` instead of emoji icons

### 8. `src/pages/NotesPage.tsx`
- Remove emoji icon assignment when creating notes

---

## Technical Details

### New DomainIcon Component

```typescript
// Added to src/lib/domains.ts
import { Heart, TrendingUp, Code, Wallet, Music, FolderKanban, BookOpen, LucideIcon } from "lucide-react";

export const DOMAIN_ICONS: Record<DomainId, LucideIcon> = {
  spiritual: Heart,
  trading: TrendingUp,
  tech: Code,
  finance: Wallet,
  music: Music,
  projects: FolderKanban,
  content: BookOpen,
};

export function DomainIcon({ 
  domainId, 
  className 
}: { 
  domainId: DomainId; 
  className?: string 
}) {
  const IconComponent = DOMAIN_ICONS[domainId];
  return IconComponent ? <IconComponent className={className} /> : null;
}
```

### Updated NotesWidget (Domain Workspaces)

```text
+----------------------------------+
| Workspaces                       |
+----------------------------------+
| [Heart] Spiritual            (3) |
| [TrendUp] Trading            (5) |
| [Code] Tech                  (2) |
| [Wallet] Finance             (0) |
| [Music] Music                (1) |
| [Folder] Projects            (4) |
| [Book] Content               (2) |
+----------------------------------+
| View all notes ->                |
+----------------------------------+
```

---

## Implementation Order

1. Update `src/lib/domains.ts` - Add icon mapping and DomainIcon component
2. Update `src/hooks/useNotes.ts` - Remove emoji defaults
3. Update `src/components/notes/DomainSection.tsx` - Use Lucide icons
4. Update `src/components/notes/HubView.tsx` - Use Lucide icons
5. Update `src/components/notes/NotesSidebar.tsx` - Use Lucide icons
6. Update `src/components/notes/JournalEntryForm.tsx` - Use DomainIcon
7. Update `src/components/dashboard/widgets/NotesWidget.tsx` - Domain workspaces
8. Update `src/pages/NotesPage.tsx` - Remove emoji icon

---

## Result

After implementation:
- **Clean, professional icons** - All Lucide icons, no emojis
- **Consistent visual language** - Same icon style throughout the app
- **Dashboard workspace links** - Quick access to each domain's notes
- **Minimal, zen aesthetic** - Aligns with the project's design direction

