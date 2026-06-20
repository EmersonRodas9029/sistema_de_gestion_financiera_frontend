# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sistema de Gestión Financiera is a React + TypeScript financial management app with a dark theme. Users track income, expenses, budgets, goals, savings, and analytics. UI text is in Spanish; currency uses `es-ES` locale with USD.

## Commands

```bash
npm run dev       # start dev server (Vite)
npm run build     # tsc -b && vite build
npm run lint      # ESLint
npm run preview   # preview production build
```

No test runner is configured.

## Architecture

### Router

Uses `HashRouter` (not `BrowserRouter`) — relevant for links, redirects, and the Vercel `vercel.json` rewrite. Routes live in `src/app/App.tsx`. `REQUIRE_AUTH = true` at the top of that file gates all protected routes.

### Auth

Not a real auth system — stored entirely in `localStorage`:
- `isAuthenticated` (`"true"/"false"`)
- `userRole` (`"admin" | "client"`)
- `userName` (string)

`ProtectedRoutes` in `App.tsx` reads these directly and redirects to `/login` when unauthenticated.

### Feature structure

`src/features/<feature>/` with subdirs: `components/`, `pages/`, `services/`, `hooks/`, `store/` (not all features use every subdir). Pages follow the pattern `pages/FooPage/FooPage.tsx` + `pages/FooPage/index.tsx` (re-export).

Most feature data is **hardcoded mock data** inside the page component — no real API calls yet. `src/features/*/services/index.ts` files exist but are mostly stubs.

### API

`src/lib/config.ts` exports `config.apiUrl` (env `VITE_API_URL`, default `http://localhost:3000/api`). `QueryClientProvider` wraps the app in `main.tsx`; React Query is set up but barely used — most pages fetch nothing.

### Shared

- `src/shared/components/layout/` — `MainLayout`, `LeftBar`, `MobileLeftBar`
- `src/shared/components/ui/` — `Button`, `Card`, `Input`, `Modal`, `Table`
- `src/styles/globals.css` + `src/index.css` — global styles and custom utilities

### Styling

Tailwind CSS with a custom dark theme. Key conventions:
- Background base: `#1a0f14`; brand pink: `#F05984`; secondary: `#BC455F`; tertiary: `#6E4068`
- Glass morphism via `glass-effect` CSS class
- `lg:` prefix for desktop layouts; left sidebar hidden on mobile behind a hamburger

### Notable dependencies

- `framer-motion` — page and list animations (used heavily in most pages)
- `@dnd-kit/core` + `@dnd-kit/sortable` — drag-to-reorder on the home dashboard (`SortableItem.tsx`)
- `react-hot-toast` — toast notifications
- `date-fns` — date formatting/manipulation
- `@headlessui/react` — accessible primitives (dropdowns, dialogs)

## Admin vs Client

`/admin`, `/admin/clients`, and `/admin/reports` are admin-only routes. Role is read from `localStorage.userRole` at render time — no server-side enforcement.
