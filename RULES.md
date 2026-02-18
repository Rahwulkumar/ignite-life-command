# 📜 PROJECT RULES & CODING STANDARDS

> **CRITICAL PRIORITY**: ALWAYS READ THIS FILE BEFORE TOUCHING ANY CODE OR MAKING ANY ARCHITECTURAL DECISIONS.

This document serves as the **Single Source of Truth** for development practices in the `ignite-life-command` project. Adherence to these rules is mandatory to maintain code quality, consistency, and scalability.

---

## 1. 🛑 MANDATORY PRE-CHECK
Before writing a single line of code:
1.  **Check for existing components**: Do NOT reinvent the wheel. Search `src/components/shared` and `src/components/ui` first.
2.  **Check for existing hooks**: Business logic often already exists in `src/hooks`. Reuse it.
3.  **Check for existing types**: Use `src/integrations/supabase/types.ts` or domain-specific type files.

---

## 2. ⚛️ REACT & VITE BEST PRACTICES
This project uses **Vite + React + TypeScript**. While similar to Next.js patterns, follow these specifics:

### Core Principles
*   **Functional Components**: Use functional components with hooks. No class components.
*   **Strict Typing**: No `any`. Define interfaces for all props and state.
*   **Separation of Concerns**:
    *   **UI Components**: `src/components/` (Purely presentational).
    *   **Business Logic**: `src/hooks/` (Data fetching, mutations, complex state).
    *   **Pages**: `src/pages/` (Route composition only).

### Routing
*   Use `react-router-dom` for navigation.
*   Use the `Link` component (`import { Link } from "react-router-dom"`) for internal links, NOT `<a>` tags.
*   **Lazy Loading**: Use `React.lazy` and `Suspense` for all route components in `App.tsx` to optimize bundle size.

### State Management
*   **Server State**: Use `TanStack Query` (React Query) for all API data fetching.
*   **Local State**: `useState` / `useReducer` for UI state (modals, inputs).
*   **Global Client State**: `useContext` or lightweight libraries only if absolutely necessary.

---

## 3. 🎨 UI/UX & STYLING
We use **Tailwind CSS** and **Shadcn/UI**.

### Styling Rules
*   **No Hardcoded Colors**: Use semantic utility classes (`bg-primary`, `text-muted-foreground`, `border-border`) instead of hex codes or hardcoded names (`bg-blue-500`).
*   **Mobile-First**: Design for mobile first, then add breakpoints (`md:`, `lg:`).
*   **Spacing**: Use consistent spacing utilities (`p-4`, `gap-6`, `my-8`).
*   **Animations**: usage `framer-motion` for complex transitions, but keep them subtle and performance-conscious.

### Component Architecture
*   **DRY (Don't Repeat Yourself)**: If you copy-paste UI code more than twice, extract it into a component.
*   **Shared Layouts**: Use `DomainPageTemplate` for all main domain pages to ensure consistent headers, tabs, and actions.
*   **Cards**: Use `BaseDomainCard` for entry points to ensure consistent hover effects and theming.

### Accessibility (a11y)
*   **Semantic HTML**: Use `<button>`, `<section>`, `<article>`, `<nav>` appropriately.
*   **Interactable Elements**: All clickable elements must have `cursor-pointer` and hover states.
*   **Feedback**: Always provide loading skeletons (`<Skeleton />`) and error toasts (`toast()`) for async operations.

---

## 4. 🗄️ FILE STRUCTURE & NAMING
*   **PascalCase** for components: `MyComponent.tsx`
*   **camelCase** for hooks/functions: `useMyHook.ts`, `helperFunction.ts`
*   **Colocation**: Keep related components together (e.g., `src/components/spiritual/character-library/`).

---

## 5. ⚠️ ANTI-PATTERNS (DO NOT DO)
*   ❌ **Hardcoding Content**: Do not hardcode lists of items in components (e.g., `CharacterStudyCard` content). Fetch from DB or use constants.
*   ❌ **Direct DOM Manipulation**: Avoid `document.getElementById`. Use `useRef`.
*   ❌ **Inline Styles**: Avoid `style={{}}` unless dynamic (e.g., coordinates). Use Tailwind classes.
*   ❌ **Console Logs**: Remove all `console.log` before committing.

---

## 6. 🚀 NEXT.JS MIGRATION READINESS
*   Avoid `window` usage in the render phase to ensure compatibility if we migrate to SSR/Next.js later.
*   Keep `useEffect` clean with proper dependency arrays.

---

*Verified by Agent Antigravity - 2026-02-12*
