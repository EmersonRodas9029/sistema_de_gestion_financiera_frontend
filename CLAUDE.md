# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sistema de Gestión Financiera is a React + TypeScript financial management application with a modern dark theme UI. The app helps users track income, expenses, budgets, goals, and provides financial analytics.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Zustand** for state management
- **React Hook Form** with Zod for form validation
- **Axios** for API calls
- **Lucide React** for icons

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Feature-Based Structure

The codebase follows a feature-based organization under `src/features/`:

```
src/features/
├── auth/           # Authentication (login, register, protected routes)
├── home/           # Dashboard/home page
├── incomes/        # Income tracking
├── expenses/       # Expense tracking
├── categories/     # Category management
├── goals/          # Financial goals
├── budgets/        # Budget management
├── savings/        # Savings tracking
├── recurring-expenses/  # Recurring/subscription expenses
├── clients/        # Client management (admin)
├── reports/        # Financial reports (admin)
├── charts/         # Analytics/charts
├── notifications/  # Notifications
└── settings/       # User settings
```

Each feature typically contains:
- `components/` - Feature-specific components
- `pages/` - Page components
- `services/` - API calls and business logic
- `hooks/` - Custom React hooks
- `store/` - Zustand stores (if needed)

### Shared Components

Located in `src/shared/components/`:
- `layout/` - MainLayout, LeftBar, MobileLeftBar
- `ui/` - Reusable UI components (Button, Card, Input, Modal, Table)
- `charts/` - Chart components
- `forms/` - Form components

### Routing

Routes are defined in `src/app/App.tsx`. Authentication is handled via `localStorage` (check `isAuthenticated`, `userRole`, `userName`).

### Theme & Styling

- **Dark theme** with gradient backgrounds (`#1a0f14` base color)
- **Glass morphism** effects using `glass-effect` class
- **Brand colors**: `#F05984` (primary pink), `#BC455F` (secondary), `#6E4068` (tertiary)
- Custom styles in `src/index.css` including responsive utilities

### State Management

- **Zustand** for global state (see `src/shared/store/`)
- **React Hook Form** for form state
- **React Query** (TanStack Query) for server state

### API Configuration

API base URL is configured in `src/lib/config.ts`. Default: `http://localhost:3000/api`

## Key Patterns

### Authentication Flow

1. User credentials stored in `localStorage`:
   - `isAuthenticated`: boolean
   - `userRole`: 'admin' | 'client'
   - `userName`: string

2. Protected routes check these values and redirect to `/login` if not authenticated

### Responsive Design

- Mobile-first approach with Tailwind breakpoints
- LeftBar is hidden on mobile, accessible via hamburger menu
- Use `lg:` prefix for desktop-specific styles
- Custom responsive utilities in `src/index.css`

### Chart Components

Charts use Recharts library with custom styling:
- Area, Line, and Bar charts for time-series data
- Pie charts for category distribution
- Custom tooltips with dark theme styling

## Important Notes

- The app uses Spanish language for UI text
- All currency formatting uses `es-ES` locale with USD currency
- Mock data is used in many components (replace with real API calls)
- The `REQUIRE_AUTH` constant in `App.tsx` controls authentication enforcement