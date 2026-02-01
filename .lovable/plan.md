

# Strict Domain Isolation for Notes Sidebar

This plan implements strict domain isolation so when viewing a domain's workspace, only that domain's notes appear in the sidebar - no other domain folders or content will be visible.

---

## Summary of Changes

| Component | Current Behavior | New Behavior |
|-----------|-----------------|--------------|
| NotesSidebar | Shows all 7 domain folders at once | Shows only the active domain's content |
| Domain Navigation | Collapsible folders for each domain | Domain selector tabs at top, content below |
| Pinned Notes | Shows all pinned notes | Shows only pinned notes from active domain |
| Search | Searches all notes | Searches only within active domain |

---

## Current vs New Sidebar Layout

**Current:**
```text
+----------------------------------+
| Search...                        |
+----------------------------------+
| PINNED                           |
| └── Any pinned note              |
+----------------------------------+
| SPIRITUAL                        |  
| ├── Hub                          |  <- All domains visible
| ├── Page 1                       |
| └── Journal (3)                  |
+----------------------------------+
| TRADING                          |  <- Should not see this
| ├── Hub                          |     when in Spiritual
| └── Journal (5)                  |
+----------------------------------+
| TECH                             |  <- Should not see this
| ...                              |
+----------------------------------+
```

**New (Isolated):**
```text
+----------------------------------+
| [Heart][Chart][Code][Wallet]...  |  <- Domain selector tabs
+----------------------------------+
| Search in Spiritual...           |
+----------------------------------+
| SPIRITUAL                        |  <- ONLY active domain
| ├── Hub                          |
| ├── Character Study              |
| ├── Romans Notes                 |
| └── Journal (3)                  |
+----------------------------------+
```

---

## Files to Modify

### 1. `src/components/notes/NotesSidebar.tsx`

**Changes:**
- Add domain selector tabs at the top of sidebar
- Replace `DOMAINS.map()` with single active domain rendering
- Filter pinned notes to only show those from active domain
- Update search placeholder to reflect active domain
- Filter search results to only active domain

**New Structure:**
```text
- Domain Tabs Row (7 icon buttons)
- Search Input (scoped to active domain)
- Active Domain Content Only:
  - Pinned notes (from this domain only)
  - Hub link
  - Pages tree
  - Journal count
```

### 2. `src/hooks/useNotes.ts`

**Changes:**
- Update `useSearchNotes` to accept optional domain filter parameter
- Search results will be filtered by domain when provided

---

## Technical Details

### Domain Selector Tabs

```typescript
// At top of sidebar - icon buttons to switch domains
<div className="flex items-center gap-1 p-2 border-b overflow-x-auto">
  {DOMAINS.map((domain) => (
    <button
      key={domain.id}
      onClick={() => onSelectHub(domain.id)}
      className={cn(
        "p-2 rounded-md flex-shrink-0 transition-colors",
        activeDomain === domain.id 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-muted text-muted-foreground"
      )}
      title={domain.label}
    >
      <DomainIcon domainId={domain.id} className="w-4 h-4" />
    </button>
  ))}
</div>
```

### Filtered Content Rendering

```typescript
// Only render the active domain's content
{activeDomain && !isLoading && (
  <div className="space-y-2">
    {/* Only pinned notes from this domain */}
    {domainPinnedNotes.length > 0 && (
      // ... pinned section
    )}
    
    {/* Single domain section - not a map of all domains */}
    <DomainSection
      domain={activeDomainConfig}
      pages={activeDomainPages}
      journalCount={activeDomainJournalCount}
      // ...
    />
  </div>
)}
```

### Filtered Search

```typescript
// Search only within active domain
const { data: searchResults = [] } = useSearchNotes(searchQuery, activeDomain);

// In useNotes.ts
export function useSearchNotes(query: string, domain?: DomainId | null) {
  return useQuery({
    queryKey: ["notes", "search", query, domain],
    queryFn: async () => {
      let request = supabase
        .from("office_notes")
        .select("*")
        .ilike("title", `%${query}%`);
      
      if (domain) {
        request = request.eq("domain", domain);
      }
      
      const { data, error } = await request.limit(10);
      // ...
    },
    enabled: query.length > 0,
  });
}
```

---

## User Experience

1. **Open Notes page** - Default domain (Spiritual) is active, only Spiritual content visible
2. **Click Trading icon tab** - Sidebar instantly shows only Trading content
3. **Search "analysis"** - Only searches within Trading domain
4. **Pin a note** - Pin only shows when that domain is active
5. **Switch to Finance** - Trading content disappears, Finance content appears

---

## Implementation Order

1. Update `useSearchNotes` in `useNotes.ts` to accept domain filter
2. Update `NotesSidebar.tsx`:
   - Add domain selector tabs at top
   - Filter pinned notes by active domain
   - Replace `DOMAINS.map()` with single domain render
   - Pass domain to search hook

---

## Result

After implementation:
- **Complete isolation** - When in Finance, you see ONLY Finance notes
- **No cross-domain visibility** - Music notes never appear in Tech view
- **Quick domain switching** - Icon tabs at top for fast navigation
- **Scoped search** - Search only finds notes in current domain

