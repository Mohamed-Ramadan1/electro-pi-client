# Electro-Pi Client — Comprehensive Project Documentation

> **Project Codename:** `electro-pi`  
> **Version:** `0.1.0`  
> **License:** Private  
> **Last Updated:** 2026-07-29

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture & Design Philosophy](#3-architecture--design-philosophy)
4. [Complete Folder Structure](#4-complete-folder-structure)
5. [Getting Started](#5-getting-started)
6. [Environment Variables](#6-environment-variables)
7. [Routing & Pages](#7-routing--pages)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [API Integration Layer](#9-api-integration-layer)
10. [State Management](#10-state-management)
11. [Component Architecture](#11-component-architecture)
12. [Services & Hooks](#12-services--hooks)
13. [Styling & Design System](#13-styling--design-system)
14. [Form Handling & Validation](#14-form-handling--validation)
15. [Testing](#15-testing)
16. [Docker & Deployment](#16-docker--deployment)
17. [API Endpoints Reference](#17-api-endpoints-reference)
18. [Type System](#18-type-system)
19. [Development Roadmap](#19-development-roadmap)

---

## 1. Project Overview

**Electro-Pi** is a team workspace platform built to organize work into projects, manage tasks, and collaborate with team members. This repository (`electro-pi-client`) is the **frontend client** — a Next.js single-page application that consumes the NestJS backend API.

### Core Purpose

- Provide a modern, responsive workspace UI for team collaboration.
- Manage projects with role-based access control (admin/member).
- Track tasks with kanban boards and status workflows.
- Handle user management, authentication, and file uploads.
- Deliver a production-grade, dark-themed interface.

### Key Design Goals

- **App Router Architecture**: Next.js 16 App Router with route groups for authenticated/unauthenticated layouts.
- **Client-First Data Fetching**: TanStack React Query for server state with optimistic cache invalidation.
- **Type-Safe API Layer**: Fully typed Axios client with interceptors, error handling, and FormData support.
- **Composable UI**: shadcn/ui primitives (base-ui) with Tailwind CSS v4, dark-mode-only theming.
- **Docker-Ready**: Multi-stage production build with standalone Next.js output.

---

## 2. Technology Stack

### Runtime & Framework

| Category        | Technology       | Version    |
| --------------- | ---------------- | ---------- |
| Runtime         | Node.js          | 22.x       |
| Framework       | Next.js          | 16.2.12    |
| UI Library      | React            | 19.2.4     |
| Language        | TypeScript       | ^5         |

### State Management & Data

| Package                          | Purpose                           |
| -------------------------------- | --------------------------------- |
| `@tanstack/react-query`          | Server state, caching, mutations  |
| `@tanstack/react-query-devtools` | Query debugging panel             |
| `zustand`                        | Client state (auth store)         |

### Styling & UI

| Package                | Purpose                    |
| ---------------------- | -------------------------- |
| `tailwindcss`          | Utility-first CSS (v4)     |
| `shadcn`               | Component registry          |
| `@base-ui/react`       | Headless UI primitives      |
| `lucide-react`         | Icon library                |
| `class-variance-authority` | Variant-based component API |
| `clsx` + `tailwind-merge` | Class name utilities     |
| `framer-motion`        | Animation library           |
| `tw-animate-css`       | Tailwind animation plugin   |
| `sonner`               | Toast notifications         |

### Forms & Validation

| Package               | Purpose                       |
| --------------------- | ----------------------------- |
| `react-hook-form`     | Form state management         |
| `zod`                 | Schema validation             |
| `@hookform/resolvers` | Zod resolver for react-hook-form |

### HTTP & Networking

| Package | Purpose              |
| ------- | -------------------- |
| `axios` | HTTP client          |
| `date-fns` | Date formatting   |

### Development & Testing

| Package                      | Purpose                       |
| ---------------------------- | ----------------------------- |
| `vitest`                     | Test runner                   |
| `@testing-library/react`     | Component testing             |
| `@testing-library/jest-dom`  | DOM matchers                  |
| `@testing-library/user-event`| User interaction simulation   |
| `@vitejs/plugin-react`       | Vite React plugin for vitest  |
| `jsdom`                      | Browser environment emulation |
| `eslint` + `eslint-config-next` | Linting                    |
| `typescript`                 | Static type checking          |

---

## 3. Architecture & Design Philosophy

### Layered Frontend Architecture

The codebase follows a **layered client-side architecture** with clear separation of concerns:

```
┌────────────────────────────────────────┐
│              src/app/                  │  ← Pages & Layouts (Next.js App Router)
│  (auth)/  (workspace)/  layout.tsx     │
└──────────────┬─────────────────────────┘
               │
┌──────────────▼─────────────────────────┐
│        src/components/                 │  ← Presentational & Feature UI
│  auth/  ui/  workspace/  marketing/    │
└──────────────┬─────────────────────────┘
               │
┌──────────────▼─────────────────────────┐
│        src/hooks/          src/stores/ │  ← Data & State Layer
│  use-*.ts  (React Query)   zustand     │
└──────────────┬─────────────────────────┘
               │
┌──────────────▼─────────────────────────┐
│        src/services/                   │  ← API Communication Layer
│  *.service.ts  (axios)                 │
└──────────────┬─────────────────────────┘
               │
┌──────────────▼─────────────────────────┐
│        src/lib/           src/types/   │  ← Foundation Layer
│  api/  storage.ts  utils.ts  api.ts    │
└────────────────────────────────────────┘
```

### Key Principles

1. **Server State vs Client State**: TanStack React Query owns all server data (users, projects, tasks). Zustand owns client-only state (auth token, current user session).

2. **Hook → Service → API Pattern**: Pages consume hooks (`useProjects()`) → hooks call services (`projectsService.list()`) → services use the Axios client. Each layer is independently testable.

3. **Admin-Gated UI**: Role checks (`useIsAdmin()`, `useHasRole()`) control UI visibility — create/edit/delete actions are conditionally rendered, not just conditionally authorized.

4. **FormData for File Uploads**: Project posters and task attachments are sent via `multipart/form-data` through Axios. The default `Content-Type: application/json` header was intentionally removed from the Axios instance to allow Axios to auto-detect and set the correct multipart boundary.

5. **Dark-Only Theming**: CSS variables are defined only for dark mode in `:root`. No light theme or theme toggle exists — the app is permanently dark-themed.

6. **Convention-Based File Organization**: Files follow predictable patterns — `src/services/<entity>.service.ts`, `src/hooks/use-<entity>.ts`, `src/app/(workspace)/<entity>/page.tsx`.

---

## 4. Complete Folder Structure

```
electro-pi-client/
│
├── .claude/                          # Claude Code configuration
├── .git/                             # Git repository metadata
├── .next/                            # Next.js build output (generated)
├── node_modules/                     # Dependencies (generated)
├── public/                           # Static assets
│   └── icon.svg                      #   App favicon
├── tests/                            # Test suite
│   ├── setup.ts                      #   Test setup (jest-dom matchers)
│   └── example.test.tsx              #   Example component test
│
├── src/                              # █████████ SOURCE CODE █████████
│   │
│   ├── app/                          #   ── PAGES & LAYOUTS ──
│   │   ├── layout.tsx                #     Root layout (dark-only, providers)
│   │   ├── page.tsx                  #     Landing page (marketing)
│   │   ├── icon.svg                  #     App icon
│   │   ├── globals.css               #     Global styles & CSS variables
│   │   ├── (auth)/auth/              #     Auth route group
│   │   │   ├── page.tsx              #       /auth
│   │   │   └── auth-content.tsx      #       Login/register form
│   │   └── (workspace)/              #     Workspace route group (authenticated)
│   │       ├── layout.tsx            #       Shared sidebar + header
│   │       ├── home/page.tsx         #       /home — Dashboard
│   │       ├── profile/page.tsx      #       /profile
│   │       ├── projects/
│   │       │   ├── page.tsx          #       /projects — List + create
│   │       │   └── [id]/page.tsx     #       /projects/:id — Detail + kanban
│   │       ├── tasks/page.tsx        #       /tasks — Task list
│   │       └── users/page.tsx        #       /users — User management
│   │
│   ├── components/                   #   ── COMPONENTS ──
│   │   ├── auth/                     #     Auth-related
│   │   │   ├── auth-form.tsx         #       Login / register form
│   │   │   ├── require-auth.tsx      #       Route guard wrapper
│   │   │   └── session-gate.tsx      #       Session verification gate
│   │   ├── marketing/                #     Landing page sections
│   │   │   ├── navbar.tsx            #       Top navigation
│   │   │   ├── footer.tsx            #       Site footer
│   │   │   └── home/                 #       Home page sections
│   │   │       ├── hero-section.tsx
│   │   │       ├── features-section.tsx
│   │   │       └── cta-section.tsx
│   │   ├── ui/                       #     shadcn/ui primitives
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── tooltip.tsx
│   │   └── workspace/                #     Workspace-specific
│   │       ├── workspace-header.tsx  #       Top bar with user menu
│   │       ├── workspace-sidebar.tsx #       Navigation sidebar
│   │       └── placeholder-page.tsx  #       Empty state component
│   │
│   ├── hooks/                        #   ── CUSTOM HOOKS ──
│   │   ├── use-auth.ts              #     Login/register/logout mutations
│   │   ├── use-mobile.ts            #     Mobile detection
│   │   ├── use-projects.ts          #     Project queries & mutations
│   │   ├── use-role.ts              #     Role-based access checks
│   │   ├── use-tasks.ts             #     Task queries & mutations
│   │   └── use-users.ts             #     User queries & mutations
│   │
│   ├── services/                     #   ── API SERVICES ──
│   │   ├── auth.service.ts          #     Auth endpoints
│   │   ├── projects.service.ts      #     Project CRUD + member management
│   │   ├── tasks.service.ts         #     Task CRUD + status + assign
│   │   └── users.service.ts         #     User CRUD + activate/deactivate
│   │
│   ├── stores/                       #   ── CLIENT STATE ──
│   │   └── auth-store.ts            #     Zustand auth store
│   │
│   ├── lib/                          #   ── UTILITIES ──
│   │   ├── api/
│   │   │   ├── client.ts            #     Axios instance + interceptors
│   │   │   └── api-error.ts         #     ApiError class
│   │   ├── config/env.ts            #     Environment validation
│   │   ├── images.ts                #     Image URL helper
│   │   ├── query/provider.tsx       #     React Query provider
│   │   ├── storage.ts               #     Token storage (localStorage)
│   │   └── utils.ts                 #     cn() utility
│   │
│   ├── types/                        #   ── TYPE DEFINITIONS ──
│   │   └── api.ts                    #     All API types & constants
│   │
│   └── shared/                       #   ── SHARED UTILITIES ──
│       ├── components/motion.tsx     #     Framer Motion wrappers
│       └── layout/
│           ├── container.tsx         #     Layout container
│           └── section.tsx           #     Section wrapper
│
├── .dockerignore                     # Docker build exclusions
├── .env                              # Environment variables
├── .env.local                        # Local overrides
├── .gitignore                        # Git exclusion rules
├── components.json                   # shadcn/ui configuration
├── Dockerfile                        # Multi-stage production build
├── eslint.config.mjs                 # ESLint flat config
├── next.config.ts                    # Next.js configuration
├── package.json                      # Project metadata & dependencies
├── package-lock.json                 # Locked dependency tree
├── postcss.config.mjs                # PostCSS configuration
├── README.md                         # This file
├── tsconfig.json                     # TypeScript configuration
└── vitest.config.ts                  # Vitest test configuration
```

---

## 5. Getting Started

### Prerequisites

- **Node.js** 22.x
- **npm** (bundled with Node.js)
- **Backend API** running (the NestJS `electro-pi-api` server)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd electro-pi-client

# Install dependencies
npm install

# Copy environment file (edit if needed)
cp .env .env.local
```

### Development

```bash
# Start dev server with hot reload
npm run dev
# → http://localhost:3000
```

The dev server proxies `/api/*` and `/uploads/*` requests to the backend API (configured via `NEXT_PUBLIC_API_URL`).

### Production Build

```bash
# Build optimized production bundle
npm run build

# Start production server
npm start
```

### Docker

```bash
# Build the Docker image
docker build -t electro-pi-client .

# Run the container
docker run -p 3000:3000 electro-pi-client
```

### Available Scripts

| Script          | Command         | Description                          |
| --------------- | --------------- | ------------------------------------ |
| `npm run dev`   | `next dev`      | Development server with hot reload   |
| `npm run build` | `next build`    | Production build                     |
| `npm start`     | `next start`    | Start production server              |
| `npm run lint`  | `eslint`        | Run ESLint                           |
| `npm test`      | `vitest run`    | Run test suite once                  |
| `npm run test:watch` | `vitest`   | Run tests in watch mode              |

---

## 6. Environment Variables

All environment variables prefixed with `NEXT_PUBLIC_` are inlined at build time and available in the browser.

| Variable               | Default                          | Description                              |
| ---------------------- | -------------------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | `http://localhost:3001/api`      | Backend API base URL                     |
| `NEXT_PUBLIC_APP_URL`  | `http://localhost:3000`          | Frontend application URL                 |
| `NEXT_PUBLIC_APP_NAME` | `Electro-Pi`                     | Application display name                 |

### `.env` Example

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Electro-Pi
```

> **Note:** The `.env` file is gitignored. Use `.env.local` for local overrides. The Next.js config falls back to `http://localhost:3001/api` if `NEXT_PUBLIC_API_URL` is not set.

---

## 7. Routing & Pages

### Route Structure

The app uses Next.js **route groups** to separate authenticated and unauthenticated layouts:

| Route              | Group          | Layout                     | Description                    |
| ------------------ | -------------- | -------------------------- | ------------------------------ |
| `/`                | (root)         | Marketing (navbar, footer) | Landing page                   |
| `/auth`            | `(auth)`       | Auth layout                | Login / Register               |
| `/home`            | `(workspace)`  | Sidebar + Header           | Dashboard                      |
| `/profile`         | `(workspace)`  | Sidebar + Header           | User profile                   |
| `/projects`        | `(workspace)`  | Sidebar + Header           | Project list + create dialog   |
| `/projects/[id]`   | `(workspace)`  | Sidebar + Header           | Project detail + task kanban   |
| `/tasks`           | `(workspace)`  | Sidebar + Header           | All tasks list                 |
| `/users`           | `(workspace)`  | Sidebar + Header           | User management (admin only)   |

### Authentication Gates

- **`RequireAuth`** — Wraps the workspace layout. Redirects unauthenticated users to `/auth`.
- **`SessionGate`** — Runs on initial load. Calls `GET /users/members/me` to verify the stored token. Sets user session in the Zustand store.

### Admin-Only Access

- The `/users` page is visible only to admins in the sidebar.
- Create/Edit/Delete actions on projects and tasks are conditionally rendered based on `useIsAdmin()`.
- Backend authorization enforces these restrictions server-side.

---

## 8. Authentication & Authorization

### Token Flow

1. **Login** → `POST /auth/login` → backend returns `{ accessToken, user }`
2. **Token Storage** → `accessToken` saved to `localStorage` under key `"electro-pi-token"`
3. **Token Attachment** → Axios request interceptor reads token from localStorage and sets `Authorization: Bearer <token>` on every request
4. **Session Verification** → On app load, `SessionGate` calls `GET /users/members/me` to validate the token and populate the user session
5. **401 Handling** → Axios response interceptor redirects to `/auth` on 401 (except for login/register/logout/me endpoints, which are in `SKIP_401_REDIRECT`)

### Role System

Roles are stored as a string array (e.g., `["admin", "member"]`):

| Role     | Constant        | Permissions                                    |
| -------- | --------------- | ---------------------------------------------- |
| `admin`  | `UserRoles.ADMIN` | Full CRUD, user management, project creation  |
| `member` | `UserRoles.MEMBER`| View projects/tasks, update assigned tasks    |

Role checks are performed via:
- **`useIsAdmin()`** → returns `boolean` (checks `roles.includes("admin")`)
- **`useHasRole(role)`** → returns `boolean` for any role

Both hooks read from the Zustand auth store.

---

## 9. API Integration Layer

### Axios Client (`src/lib/api/client.ts`)

```typescript
const apiClient = axios.create({
  baseURL: "/api/v1",
  timeout: 30000,
  withCredentials: true,
});
```

**Request Interceptor:**
- Attaches `Authorization: Bearer <token>` from localStorage
- No default `Content-Type` header (Axios auto-detects JSON vs FormData)

**Response Interceptor:**
- Successful responses are logged (method, URL, status, data)
- Errors are logged and transformed into `ApiError` instances
- 401 errors redirect to `/auth` (with exceptions for auth endpoints)
- Network errors show a connection error message

**Note:** `withCredentials: true` sends HTTP-only cookies for refresh token support.

### API Base URL

All API requests use the relative base URL `/api/v1`, which is proxied to the backend via Next.js rewrites:

```typescript
// next.config.ts
async rewrites() {
  return [
    { source: "/api/:path*", destination: `${apiUrl}/:path*` },
    { source: "/uploads/:path*", destination: `${backendBase}/uploads/:path*` },
  ];
}
```

This eliminates CORS issues during development and simplifies deployment.

### Error Handling

The `ApiError` class (`src/lib/api/api-error.ts`) standardizes error responses:

```typescript
class ApiError extends Error {
  status: number;
  code: string;
  details?: Record<string, unknown>;
}
```

Errors are surfaced to the user via `sonner` toast notifications in React Query's `onError` callbacks.

---

## 10. State Management

### Server State (TanStack React Query)

All server data is managed by React Query with the following pattern:

```typescript
// Query (read)
export function useProjects() {
  return useQuery<ProjectsListResponse>({
    queryKey: ["projects"],
    queryFn: () => projectsService.list(),
  });
}

// Mutation (write)
export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create project");
    },
  });
}
```

**Cache keys follow a convention:**
- `["projects"]` — project list
- `["projects", id]` — single project
- `["tasks"]` — task list
- `["tasks", id]` — single task
- `["tasks", "project", projectId]` — project-scoped tasks
- `["users"]` — user list
- `["users", id]` — single user

### Client State (Zustand)

The Zustand auth store (`src/stores/auth-store.ts`) manages:

| State          | Description                                  |
| -------------- | -------------------------------------------- |
| `user`         | Current user (id, email, name, initials, roles) |
| `token`        | JWT access token                             |
| `isAuthenticated` | Whether a valid session exists            |
| `isVerifying`  | Whether initial session check is in progress |

**Actions:** `setUser()`, `setToken()`, `logout()`, `updateUser()`

---

## 11. Component Architecture

### UI Primitives (shadcn/ui)

The project uses `@base-ui/react` primitives styled with Tailwind CSS v4, wrapped in shadcn/ui components under `src/components/ui/`:

- Form elements: `button`, `input`, `dialog`, `dropdown-menu`, `popover`
- Layout: `sidebar`, `sheet`, `separator`
- Feedback: `badge`, `skeleton`, `tooltip`, `avatar`

### Feature Components

- **Auth** (`src/components/auth/`): Login/register form, session gate, route guard
- **Workspace** (`src/components/workspace/`): Sidebar navigation, header bar, placeholder pages
- **Marketing** (`src/components/marketing/`): Landing page sections (hero, features, CTA)

### UI Conventions

- **Buttons**: Use `variant` (`default`, `outline`, `secondary`, `ghost`, `destructive`) and `size` (`xs`, `sm`, `default`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`)
- **Icons**: All icons from `lucide-react`, sized with `size-*` Tailwind classes
- **Text**: Font sizes use `text-[12px]`, `text-[13px]`, `text-[14px]` consistently across the app
- **Colors**: Use CSS variable classes (`text-foreground`, `text-foreground-muted`, `text-primary`, `text-destructive`, etc.)

---

## 12. Services & Hooks

### Services (`src/services/`)

Each service is a named export object with async methods that call the Axios client:

| Service              | Key Methods                                                     |
| -------------------- | --------------------------------------------------------------- |
| `authService`        | `login()`, `register()`, `me()`, `logout()`                     |
| `usersService`       | `list()`, `getById()`, `create()`, `update()`, `activate()`, `deactivate()`, `remove()` |
| `projectsService`    | `list()`, `getById()`, `create()`, `update()`, `remove()`, `addMember()`, `removeMember()`, `close()`, `reopen()` |
| `tasksService`       | `create()`, `update()`, `remove()`, `assign()`, `unassign()`, `listAll()` (member), `listByProject()`, `getById()`, `updateStatus()` |

**File uploads** (project posters, task attachments) use `FormData` with fields named `file` (poster) or `files` (task attachments). No `Content-Type` header is manually set — Axios detects `FormData` and sets the correct `multipart/form-data` boundary.

### Hooks (`src/hooks/`)

| Hook                   | Type    | Endpoint Used          |
| ---------------------- | ------- | ---------------------- |
| `useProjects()`        | Query   | `GET /members`         |
| `useProject(id)`       | Query   | `GET /members/:id`     |
| `useCreateProject()`   | Mutation| `POST /projects`       |
| `useUpdateProject()`   | Mutation| `PATCH /projects/:id`  |
| `useDeleteProject()`   | Mutation| `DELETE /projects/:id` |
| `useAddMember()`       | Mutation| `POST /projects/:id/members/:userId` |
| `useRemoveMember()`    | Mutation| `DELETE /projects/:id/members/:userId` |
| `useCloseProject()`    | Mutation| `PATCH /projects/:id/close` |
| `useReopenProject()`   | Mutation| `PATCH /projects/:id/reopen` |
| `useTasks()`           | Query   | `GET /members/tasks`   |
| `useProjectTasks(id)`  | Query   | `GET /members/tasks/project/:id` |
| `useTask(id)`          | Query   | `GET /members/tasks/:id` |
| `useCreateTask()`      | Mutation| `POST /tasks`          |
| `useUpdateTask()`      | Mutation| `PATCH /tasks/:id`     |
| `useDeleteTask()`      | Mutation| `DELETE /tasks/:id`    |
| `useAssignTask()`      | Mutation| `PATCH /tasks/:id/assign/:userId` |
| `useUnassignTask()`    | Mutation| `DELETE /tasks/:id/assign` |
| `useUpdateTaskStatus()`| Mutation| `PATCH /members/tasks/:id/status` |
| `useUsers()`           | Query   | `GET /users`           |
| `useUser(id)`          | Query   | `GET /users/:id`       |
| `useCreateUser()`      | Mutation| `POST /users`          |
| `useUpdateUser()`      | Mutation| `PATCH /users/:id`     |
| `useActivateUser()`    | Mutation| `PATCH /users/:id/activate` |
| `useDeactivateUser()`  | Mutation| `PATCH /users/:id/deactivate` |
| `useDeleteUser()`      | Mutation| `DELETE /users/:id`    |

---

## 13. Styling & Design System

### Tailwind CSS v4

The project uses Tailwind CSS v4 (not v3) with the `@theme inline` directive for CSS variable mapping. All tokens are defined in `src/app/globals.css`.

### Dark-Only Theme

The app is **permanently dark-themed**. The `<html>` tag has `class="dark"` hardcoded. No light theme variables exist, and there is no theme toggle. CSS variables in `:root` use dark-mode colors directly.

**Primary palette:**
- Background: `#0f0f11` → `#161618` → `#1c1c1e`
- Foreground: `#f5f3ee` → `#a8a49e` → `#6e6b66`
- Accent (primary): `#a78bfa` (purple)
- Accent (warning): `#fbbf24` (amber)
- Destructive: `#f87171` (red)
- Success: `#34d399` (green)

### Typography

| Token             | Font Stack                              |
| ----------------- | --------------------------------------- |
| `--font-sans`     | Geist (from `next/font/google`)         |
| `--font-mono`     | Geist Mono                              |
| `--font-display`  | Playfair Display (used for headings)    |

---

## 14. Form Handling & Validation

Forms use **React Hook Form** with **Zod** schema validation via `@hookform/resolvers`:

```typescript
const createProjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  members: z.array(z.string()).optional(),
});

const { register, handleSubmit, formState: { errors, isValid } } = useForm({
  resolver: zodResolver(createProjectSchema),
  defaultValues: { members: [] },
  mode: "onChange",
});
```

**Pattern:**
- `mode: "onChange"` — validation runs as the user types
- Submit button is `disabled={!isValid || isPending}`
- Inline error messages shown below each field
- Form reset on successful submission

---

## 15. Testing

### Framework

- **Runner**: Vitest (v2)
- **Environment**: jsdom
- **Plugin**: `@vitejs/plugin-react`

### Configuration (`vitest.config.ts`)

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    css: false,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

### Running Tests

```bash
npm test              # Run once
npm run test:watch    # Watch mode
```

### Test Structure

- `tests/setup.ts` — imports `@testing-library/jest-dom/vitest` for DOM matchers
- `tests/example.test.tsx` — sample component test using `render()` and `screen.getByText()`

Tests should be added under `tests/` following the convention `tests/<feature>.test.tsx`.

---

## 16. Docker & Deployment

### Multi-Stage Docker Build

The `Dockerfile` uses three stages to minimize the final image size:

**Stage 1 — `deps`**: Installs only production dependencies (`npm ci --omit=dev`).

**Stage 2 — `builder`**: Installs all dependencies, copies source and `.env`, runs `npm run build` (Next.js standalone output).

**Stage 3 — `runner`**: Copies only the standalone output (`.next/standalone/`), static files, and `.env`. Runs as non-root `nextjs` user.

The final image contains only:
- `server.js` (Next.js standalone server)
- `.next/static/` (pre-rendered static assets)
- `public/` (static public files)
- Minimal `node_modules` (only production deps)
- `.env` (runtime environment)

**Image size is minimized** because dev dependencies, source files, and build artifacts are excluded from the runner stage.

### Commands

```bash
docker build -t electro-pi-client .
docker run -p 3000:3000 electro-pi-client
```

---

## 17. API Endpoints Reference

The frontend consumes the following backend endpoints. All paths are relative to `/api/v1`. Admin-only endpoints are gated by the UI (not called by non-admin users).

### Auth

| Method | Path              | Auth    | Description         |
| ------ | ----------------- | ------- | ------------------- |
| POST   | `/auth/login`     | None    | User login          |
| POST   | `/auth/register`  | None    | User registration   |
| POST   | `/auth/logout`    | Any     | User logout         |
| GET    | `/users/members/me` | Any   | Current user session |

### Projects

| Method | Path                              | Auth   | Description              |
| ------ | --------------------------------- | ------ | ------------------------ |
| GET    | `/members`                        | Any    | List all projects        |
| GET    | `/members/:id`                    | Any    | Get single project       |
| POST   | `/projects`                       | Admin  | Create project (multipart) |
| DELETE | `/projects/:id`                   | Admin  | Delete project           |
| PATCH  | `/projects/:id/close`             | Admin  | Close project            |
| PATCH  | `/projects/:id/reopen`            | Admin  | Reopen project           |
| POST   | `/projects/:id/members/:userId`   | Admin  | Add member to project    |
| DELETE | `/projects/:id/members/:userId`   | Admin  | Remove member from project |

### Tasks

| Method | Path                                  | Auth   | Description                |
| ------ | ------------------------------------- | ------ | -------------------------- |
| GET    | `/members/tasks`                      | Any    | List user's tasks          |
| GET    | `/members/tasks/project/:projectId`   | Any    | List project tasks         |
| GET    | `/members/tasks/:id`                  | Any    | Get single task            |
| PATCH  | `/members/tasks/:id/status`           | Any    | Update task status         |
| POST   | `/tasks`                              | Admin  | Create task (multipart)    |
| PATCH  | `/tasks/:id`                          | Admin  | Update task (multipart)    |
| DELETE | `/tasks/:id`                          | Admin  | Delete task                |
| PATCH  | `/tasks/:id/assign/:userId`           | Admin  | Assign task to user        |
| DELETE | `/tasks/:id/assign`                   | Admin  | Unassign task              |

### Users

| Method | Path                     | Auth   | Description            |
| ------ | ------------------------ | ------ | ---------------------- |
| GET    | `/users`                 | Admin  | List all users         |
| GET    | `/users/:id`             | Admin  | Get single user        |
| POST   | `/users`                 | Admin  | Create user            |
| PATCH  | `/users/:id`             | Admin  | Update user            |
| PATCH  | `/users/:id/activate`    | Admin  | Activate user          |
| PATCH  | `/users/:id/deactivate`  | Admin  | Deactivate user        |
| DELETE | `/users/:id`             | Admin  | Delete user            |

---

## 18. Type System

All API types and constants are defined in `src/types/api.ts`:

### Core Types

| Type                     | Description                                      |
| ------------------------ | ------------------------------------------------ |
| `ApiUser`                | User from auth responses (id, email, name, roles) |
| `UserDto`                | Full user object with timestamps                 |
| `ProjectDto`             | Project with members, creator, status            |
| `TaskDto`                | Task with assignee, creator, images, status      |
| `TaskImageDto`           | Uploaded task image metadata                     |
| `TaskUserDto`            | Compact user (firstName, lastName, profileImage) |

### Response Wrappers

| Type                     | Shape                        |
| ------------------------ | ---------------------------- |
| `AuthResponse`           | `{ message, user, accessToken }` |
| `UsersListResponse`      | `{ message, users[] }`       |
| `SingleUserResponse`     | `{ message, user }`          |
| `ProjectsListResponse`   | `{ message, projects[] }`    |
| `SingleProjectResponse`  | `{ message, project }`       |
| `DeleteProjectResponse`  | `{ message }`                |
| `TasksListResponse`      | `{ message, tasks[] }`       |
| `SingleTaskResponse`     | `{ message, task }`          |
| `PaginatedResponse<T>`   | `{ data[], meta }`           |

### Constants & Enums

| Constant            | Values                                  |
| ------------------- | --------------------------------------- |
| `UserRoles`         | `{ ADMIN: "admin", MEMBER: "member" }` |
| `tasksStatus`       | `{ TODO: "todo", INPROGRESS: "inprogress", DONE: "done" }` |
| `tasksPriority`     | `{ LOW: "low", MEDIUM: "medium", HIGH: "high" }` |
| `STRONG_PASSWORD_REGEX` | Validates 8+ chars with uppercase, lowercase, number, special char |
| `ALLOWED_IMAGE_TYPES` | `["image/png", "image/jpeg", "image/webp"]` |
| `MAX_IMAGE_SIZE`    | `5 * 1024 * 1024` (5MB)                |

---

## 19. Development Roadmap

### Implemented

- [x] Authentication (login, register, session verification)
- [x] Role-based access control (admin/member)
- [x] User management CRUD (list, create, activate, deactivate, delete)
- [x] Project CRUD with file upload (poster image)
- [x] Project member management (add/remove)
- [x] Project status management (close/reopen)
- [x] Task CRUD with file upload (attachments)
- [x] Task kanban board (todo, in progress, done)
- [x] Task bidirectional status workflow
- [x] Task assignment and unassignment
- [x] Task detail modal with full API data
- [x] Docker multi-stage build
- [x] Vitest + React Testing Library setup
- [x] Dark-only theme

### Planned

- [ ] Task image gallery / lightbox
- [ ] Real-time notifications (WebSocket)
- [ ] Project dashboard analytics
- [ ] Task comments/discussions
- [ ] File drag-and-drop upload
- [ ] Project invitation links
- [ ] Activity log / audit trail
- [ ] E2E tests with Playwright
- [ ] CI/CD pipeline configuration
