# Ignite Life Command

A personal life operating system. One authenticated dashboard to track every domain of your life — spiritual growth, finances, trading, technology learning, music, content, and projects — with domain-specific AI agents and a Notion-style notes system connecting everything.

> **Status:** Active development. Authentication, notes system, spiritual domain (Bible reading, daily focus, scripture memory, journal), daily habit tracking, and two AI agents (Nova + Sage) with real GPT-4 streaming backends are fully working. Finance, tech, music, content, and projects domains use placeholder data while their Supabase integrations are being built.

---

## What This Is

Most productivity tools give you a place to log things. Ignite Life Command gives you a command center that understands what you log.

Each life domain has its own dedicated space — and where it matters, its own AI agent. The agents are not generic chatbots. Nova understands your trading context. Sage understands Biblical history and connects themes across books. Each agent has a real backend, a real system prompt, and streaming responses — not canned text.

Everything is tied together through a universal Notion-style notes system that spans all domains.

---

## Domains

| Domain | Status | What It Tracks |
|---|---|---|
| Spiritual | ✅ Live | Bible reading progress, daily focus scripture, scripture memory (flashcards), character library, journal, sermon notes, spiritual goals |
| Trading | ✅ Live (Nova AI) | Investment tracking with AI analysis embedded in each position |
| Dashboard | ✅ Live | Daily checklist, habit streaks, weekly activity chart, completion rates, calendar |
| Notes | ✅ Live | Cross-domain Notion-style notes with rich text, folders, pinning, and domain tagging |
| Finance | 🔧 In Progress | Structure built, Supabase integration pending |
| Technology | 🔧 In Progress | Structure built, Supabase integration pending |
| Music | 🔧 In Progress | Structure built, Supabase integration pending |
| Content | 🔧 In Progress | Structure built, Supabase integration pending |
| Projects | 🔧 In Progress | Kanban board built, persistence pending |

---

## AI Agents

### Nova — Trading Mentor ✅ Real Backend
- **Persona:** Skeptical, pattern-focused, risk-conscious
- **Backend:** Supabase Edge Function (Deno runtime) → OpenAI gpt-4-turbo-preview, streaming SSE
- **Context:** Receives live investment data (symbol, position size, avg cost, current price, returns %) and uses it to frame every response
- **What it does:** Questions your trade thesis, discusses position sizing and risk/reward, surfaces risk considerations — never suggests new trades
- **Where it lives:** Embedded in the Investment Detail sheet on the Trading page

### Sage — Spiritual Guide ✅ Real Backend
- **Persona:** Wise, reflective, non-preachy
- **Backend:** Supabase Edge Function (Deno runtime) → OpenAI gpt-4-turbo-preview, streaming SSE
- **What it does:** Explains Biblical history and context, connects themes across books, suggests related passages, responds to prayer requests with Scripture, describes maps and timelines
- **Where it lives:** Dedicated chat interface on the Spiritual page

### Marcus (Finance), Atlas (Trading), Aria (Music) — Stub Agents
- Frontend-only personas. Return template responses. Real backends planned.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18, Vite 5 |
| Language | TypeScript 5.8 |
| Styling | Tailwind CSS 3.4, Framer Motion 12 |
| UI Components | shadcn/ui + full Radix UI primitive suite |
| Rich Text Editor | TipTap 3 (notes and journal entries) |
| Charts | Recharts |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth (email/password, localStorage session) |
| AI | OpenAI GPT-4 (called from Supabase Edge Functions) |
| Edge Functions | Deno runtime on Supabase |
| Routing | React Router 6 |
| Forms | React Hook Form + Zod |
| State | TanStack Query 5 |

---

## Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                       │
│  Dashboard · Spiritual · Trading · Finance · Tech · Notes       │
└──────────────────────────┬─────────────────────────────────────┘
                           │ Supabase JS Client
┌──────────────────────────▼─────────────────────────────────────┐
│                        Supabase                                 │
│                                                                 │
│  PostgreSQL DB          Auth            Edge Functions          │
│  ├─ bible_reading_plans ├─ Email/Pass   ├─ nova-chat            │
│  ├─ daily_focus         ├─ JWT tokens   │    └─▶ OpenAI API     │
│  ├─ office_notes        └─ RLS policies └─ spiritual-guide      │
│  ├─ daily_checklist_entries                  └─▶ OpenAI API     │
│  ├─ scripture_memory                                            │
│  ├─ spiritual_goals                                             │
│  ├─ spiritual_journal_entries                                   │
│  └─ ... (14 tables total)                                       │
└────────────────────────────────────────────────────────────────┘
```

**Agent call flow:**
```
User message → React component → useSpiritualGuide / Nova chat hook
→ fetch() → Supabase Edge Function URL (with user JWT)
→ Deno function → OpenAI streaming API
→ SSE stream back to frontend → rendered token by token
```

---

## Local Setup

### Prerequisites
- Node.js 18+ (or Bun)
- A Supabase project (free tier works)
- OpenAI API key with GPT-4 access

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Rahwulkumar/ignite-life-command.git
cd ignite-life-command

# 2. Install dependencies
npm install
# or if you have Bun:
bun install

# 3. Set up environment variables
cp .env.example .env
```

Edit `.env` and fill in:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_ref_id
```

```bash
# 4. Link Supabase project and push database migrations
npx supabase link --project-ref your_project_ref_id
npx supabase db push

# 5. Set OpenAI API key as a Supabase secret (used by Edge Functions)
npx supabase secrets set OPENAI_API_KEY=sk-your-key-here

# 6. Deploy Edge Functions
npx supabase functions deploy nova-chat
npx supabase functions deploy spiritual-guide

# 7. Start development server
npm run dev
```

App runs at `http://localhost:8080`

---

## Database Schema (Core Tables)

| Table | Purpose |
|---|---|
| `bible_reading_plans` | Tracks current book, chapter, verse and overall completion % |
| `daily_focus` | One scripture per day per user, with completion toggle |
| `office_notes` | Universal notes table — stores all domain notes, journals, character studies as typed TipTap JSON with parent/child tree structure |
| `daily_checklist_entries` | Daily task completions with JSONB metrics data per entry |
| `custom_task_metrics` | User-defined metric fields for each task type |
| `scripture_memory` | Verse flashcard system with mastery levels 0–5 |
| `spiritual_goals` | Goal tracking with progress and target dates |
| `spiritual_journal_entries` | Structured reflection entries |
| `sermon_notes` | Sermon records with key takeaways and scripture references |
| `spiritual_chat_messages` | Sage chat history |

---

## Current Progress

- [x] Authentication — Supabase Auth with route protection and auto session refresh
- [x] Notes system — full Notion-style CRUD with domain filtering, pinning, tree structure, TipTap editor
- [x] Daily checklist — custom tasks, completion tracking, JSONB metrics
- [x] Weekly activity and completion charts
- [x] Sage AI (Spiritual) — streaming GPT-4, JWT-authenticated Edge Function
- [x] Nova AI (Trading) — streaming GPT-4 with live investment context
- [x] Bible reading tracker
- [x] Daily focus scripture
- [x] Scripture memory flashcard system
- [x] Spiritual character library
- [x] Spiritual journal
- [ ] Finance domain — Supabase integration
- [ ] Tech domain — Supabase integration
- [ ] Music domain — Supabase integration
- [ ] Content domain — Supabase integration
- [ ] Projects kanban — persistence
- [ ] Dashboard streaks — calculated from real data (currently placeholder)
- [ ] Marcus, Atlas, Aria agents — real backends
- [ ] Spaced repetition scheduler for scripture memory

---

## License

MIT
