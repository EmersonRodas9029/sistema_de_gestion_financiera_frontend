# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BudgEase (Sistema de Gestión Financiera) is a React + TypeScript financial management app with a dark theme. Users track income, expenses, budgets, goals, savings, and analytics. UI text is in Spanish; currency uses `es-ES` locale with USD.

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

Backed by a real JWT login against the backend (`POST /auth/login` via `authService`, see `src/features/auth/services/index.ts`), but session state is then cached entirely in `localStorage` — there is no refresh flow or client-side token expiry handling:
- `isAuthenticated` (`"true"/"false"`)
- `userRole` (`"admin" | "client"` — mapped from backend `rol`: `CONTADOR` → `admin`, `CLIENTE` → `client`)
- `userName`, `userEmail`, `userId`
- `authToken` — JWT, sent as `Authorization: Bearer <token>` on every request via `apiFetch` (`src/lib/api.ts`)
- `clienteId` — only for the `client` role; resolved once at login by matching session email against `clientesService.getAll()`

`ProtectedRoutes` in `App.tsx` reads these directly and redirects to `/login` when unauthenticated. Role-gating in the UI (`AdminOnly`, `LeftBar` nav filtering) is UX-only, but it is backed by real server-side enforcement: the backend (separate Spring Boot repo, see below) requires a valid JWT on every endpoint except `/api/auth/**`, and applies IDOR/ownership + role (`ROLE_CONTADOR`) checks per-service.

### Feature structure

`src/features/<feature>/` with subdirs: `components/`, `pages/`, `services/`, `hooks/`, `store/` (not all features use every subdir). Pages follow the pattern `pages/FooPage/FooPage.tsx` + `pages/FooPage/index.tsx` (re-export).

All features are wired to the real backend — every `src/features/*/services/index.ts` calls the live REST API via `apiJson`/`apiFetch`, and every page imports its feature's service (no hardcoded mock arrays remain in page components).

### API

`src/lib/config.ts` exports `config.apiUrl` (env `VITE_API_URL`; the code's hardcoded fallback is `http://localhost:3000/api`, but the actual local `.env` sets it to `http://localhost:8080/api` to match the backend's real port — the `3000` fallback is stale and never hit in practice). `QueryClientProvider` wraps the app in `src/app/main.tsx`; React Query is set up but not actually used for data fetching — pages call services directly (`useState`/`useEffect`) rather than `useQuery`/`useMutation`.

### Backend

The backend is a separate repository at `../BudgEase-Backend` (sibling directory, not part of this repo): Spring Boot 3 / Java 17, layered `Controller → Service interface → ServiceImpl → Repository (JPA) → MySQL`, Flyway migrations, MapStruct DTO mapping, JWT via `jjwt`, rate limiting, default-deny security with per-request JWT auth plus ownership/role authorization in the service layer. REST resources: `/api/usuarios`, `/api/clientes`, `/api/categorias`, `/api/gastos`, `/api/gastos-recurrentes`, `/api/ingresos`, `/api/presupuestos`, `/api/metas`, `/api/notificaciones`, `/api/reportes`, `/api/cuentas` (bank accounts — not yet consumed by this frontend), `/api/configuraciones`. Full contract in that repo's `API.md`.

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

`/admin`, `/admin/clients`, and `/admin/reports` are admin-only routes. Role is read from `localStorage.userRole` at render time; this only hides navigation/UI. The backend independently enforces role- and ownership-based authorization server-side (see Backend section above), so a client can't actually reach another client's data even if they bypass the frontend gate.
