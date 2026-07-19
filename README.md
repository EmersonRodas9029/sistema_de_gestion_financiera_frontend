# BudgEase — Sistema de Gestión Financiera (Frontend)

SPA en React + TypeScript para el control de finanzas personales: ingresos, gastos, presupuestos, metas de ahorro, gastos recurrentes, reportes y analítica — con un panel administrativo para el rol **Contador** y tema oscuro/claro. Consume la [API REST del backend](https://github.com/EmersonRodas9029/Sistema_De_Gestion_Finaciera) del mismo sistema.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Query](https://img.shields.io/badge/TanStack%20Query-5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query)

---

## Características

- **Dashboard** con balance, tendencias, gráficas de ingresos/gastos y widgets reordenables (drag & drop)
- **Ingresos y gastos** con filtros, búsqueda con debounce, paginación y estado por cliente
- **Gastos recurrentes** configurables por frecuencia (diaria, semanal, mensual, anual)
- **Metas financieras** con seguimiento de progreso y prioridad
- **Categorías** personalizadas con color, ícono y presupuesto mensual
- **Analítica** (`/analytics`) con comparativas mensuales, trimestrales y por categoría
- **Reportes** con generación asistida de contenido y exportación a PDF (vía backend)
- **Notificaciones** en tiempo real (polling con pausa automática en pestaña inactiva)
- **Panel administrativo** (`/admin/*`) para el rol Contador: gestión de clientes y reportes globales
- **Tema claro/oscuro** persistente, aplicado antes del primer render (sin parpadeo)
- **Componentes accesibles** (`@headlessui/react`): switches, diálogos de confirmación, modales
- **Autenticación por JWT**, rutas protegidas y control de acceso por rol (`admin` / `client`)

## Stack tecnológico

| Categoría | Tecnología |
|---|---|
| UI | React 19 + TypeScript |
| Build / Dev server | Vite 7 |
| Estilos | Tailwind CSS (tema oscuro custom) |
| Routing | React Router 7 (`HashRouter`) |
| Datos remotos | TanStack React Query + `fetch` |
| Animaciones | Framer Motion |
| Drag & Drop | `@dnd-kit` |
| Formularios | React Hook Form + Zod |
| Gráficas | Recharts |
| Notificaciones UI | react-hot-toast |
| Componentes accesibles | Headless UI |
| Fechas | date-fns |
| Iconos | lucide-react |

## Estructura del proyecto

```
src/
├── app/                    # App.tsx — rutas y guard de autenticación
├── features/                # Un módulo por dominio de negocio
│   ├── auth/                 # Login
│   ├── home/                  # Dashboard
│   ├── incomes/                # Ingresos
│   ├── expenses/                # Gastos
│   ├── recurring-expenses/       # Gastos recurrentes
│   ├── budgets/                   # Presupuestos
│   ├── goals/                      # Metas financieras
│   ├── categories/                  # Categorías
│   ├── charts/                       # Analítica
│   ├── reports/                       # Reportes / PDF
│   ├── notifications/                  # Notificaciones
│   ├── clients/                          # Admin: clientes
│   └── settings/                          # Preferencias de cuenta
│       └── (components/ pages/ services/ hooks/ store/)
├── shared/
│   ├── components/
│   │   ├── layout/          # MainLayout, LeftBar, MobileLeftBar
│   │   └── ui/               # Button, Card, Input, Modal, Table, Toggle, ConfirmDialog...
│   └── hooks/                # useConfirm, useDebouncedValue, useCurrentClient...
├── lib/                     # config.ts (API URL), api.ts (fetch wrapper)
└── styles/                  # globals.css, utilidades del tema
```

Cada feature sigue el patrón `pages/FooPage/FooPage.tsx` + `pages/FooPage/index.tsx` (re-export).

## Puesta en marcha

### Requisitos previos

- [Node.js 20+](https://nodejs.org/)
- El [backend](https://github.com/EmersonRodas9029/Sistema_De_Gestion_Finaciera) corriendo (por defecto en `http://localhost:8080/api`)

### Instalación

```bash
git clone https://github.com/EmersonRodas9029/sistema_de_gestion_financiera_frontend.git
cd sistema_de_gestion_financiera_frontend
npm install
```

### Variables de entorno

Crea un archivo `.env` en la raíz:

```bash
VITE_API_URL=http://localhost:8080/api
```

### Ejecutar

```bash
npm run dev       # servidor de desarrollo (Vite)
```

La app queda disponible en `http://localhost:5173`.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo con hot reload |
| `npm run build` | Type-check (`tsc -b`) + build de producción con Vite |
| `npm run lint` | Analiza el código con ESLint |
| `npm run preview` | Sirve localmente el build de producción |

## Rutas y roles

La app usa `HashRouter` (rutas tipo `/#/incomes`), relevante para el `vercel.json` incluido en el despliegue. El acceso se controla vía `localStorage` (`isAuthenticated`, `userRole`, `userName`):

| Rol | Acceso |
|---|---|
| `client` | Dashboard, ingresos, gastos, presupuestos, metas, categorías, analítica, notificaciones, configuración |
| `admin` (Contador) | Todo lo anterior + `/admin/clients` (gestión de clientes) y `/admin/reports` (reportes globales) |

> El control de rol en el frontend es solo de UI/UX (oculta rutas y botones); la autorización real ocurre en el backend vía JWT + verificación de dueño del recurso.

## Diseño

Tema oscuro por defecto (`#1a0f14` de fondo, acentos rosa `#F05984` → `#BC455F` → `#6E4068`) con soporte de tema claro, glass morphism en tarjetas/paneles, y animaciones de entrada/lista con Framer Motion. El sidebar izquierdo se colapsa a un menú hamburguesa en móvil.

## Despliegue

Configurado para Vercel (`vercel.json` reescribe todas las rutas a `index.html`, requerido por `HashRouter`). Cualquier host de estáticos (Netlify, GitHub Pages, S3 + CloudFront) funciona igual siempre que se sirva `index.html` para rutas desconocidas y se configure `VITE_API_URL` apuntando al backend en producción.

## Licencia

Proyecto privado — sin licencia pública definida.

---

Desarrollado por **Emerson Rodas** · Backend: [Sistema_De_Gestion_Finaciera](https://github.com/EmersonRodas9029/Sistema_De_Gestion_Finaciera)
