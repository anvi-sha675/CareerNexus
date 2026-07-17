# CareerNexus — Frontend

A production-ready, frontend-only React application for CareerNexus, an AI-powered hiring platform connecting students and recruiters. Built with React 19, Vite, Tailwind CSS v4, and a fully mocked (but backend-ready) service layer, so the entire app is usable end to end without a live API.

**53 pages · ~35 reusable components · 65 passing automated tests · verified production build.**

📚 **Full technical documentation — system architecture, data flow, routing, every page/component reference, user flows, and mermaid diagrams for all of it — lives in [`/docs`](./docs/00-README.md). Start there if you want to understand how this is built, not just how to run it.**

---

## 1. Setup in your own environment

### Prerequisites

- Node.js 18.18+ (Node 20 LTS recommended)
- npm 9+ (comes with Node)

### Steps

```bash
# 1. Unzip the project and move into it
unzip careernexus-frontend.zip
cd careernexus-frontend

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`). The app runs fully in **demo/mock mode** immediately — no backend, no environment variables required. Every service call falls back to realistic mock data if no API is reachable.

**To try each role:** go to `/login`, enter any email, pick a role (Student / Recruiter / Admin) with the pills above the form, and log in. There's no real password check in demo mode.

### All available scripts

```bash
npm run dev        # start the Vite dev server with hot reload
npm run build       # production build → dist/
npm run preview     # serve the production build locally, to sanity-check before deploying
npm run lint         # oxlint (ESLint-compatible) static analysis
npm run test        # run the full automated test suite once
npm run test:watch   # run tests in watch mode while developing
```

---

## 2. Connecting a real backend

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

```
VITE_API_URL=https://your-api.example.com/api
VITE_SOCKET_URL=https://your-api.example.com
```

Every function in `src/services/*.js` calls the real endpoint first via Axios and only falls back to mock data if that request fails — so connecting a backend is just a matter of implementing matching REST routes. Open any file in `src/services/` to see the exact endpoint shape (method, path, payload) each screen expects.

---

## 3. Testing

```bash
npm run test
```

This runs **89 tests across 29 test files** with Vitest + React Testing Library + jsdom, covering:

- **Utilities** — formatters, validators, CSV export, class-name merging
- **Core components** — Button, Badge, Modal, Table, Pagination, EmptyState, ErrorState, form fields
- **Hooks** — `usePagination`, `useDebounce`
- **Context** — `AuthContext` (login/logout persistence), `ThemeContext` (dark-mode toggle + persistence), `ToastContext`
- **Page-level integration tests** — Landing, Login, Student Dashboard, Jobs (search/filter), Applicants, Admin Dashboard, each rendered against a **mocked service layer** to confirm the UI correctly requests, receives, and displays data the way it would against a real backend

All 89 tests pass, and `npm run build` / `npm run lint` both complete with **zero errors** on a fresh `npm install`.

---

## 4. Deployment

The build output (`npm run build` → `dist/`) is a static SPA. Because client-side routes like `/student/dashboard` don't exist as real files, your host needs a rewrite rule that serves `index.html` for any unmatched path. This is already configured for the two most common hosts:

- **Netlify** — `public/_redirects` is included (`/* /index.html 200`)
- **Vercel** — `vercel.json` is included with a catch-all rewrite

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Vercel

```bash
npm run build
vercel --prod
```

(Vercel auto-detects Vite; `vercel.json` handles the SPA rewrite.)

### Any static host (S3 + CloudFront, GitHub Pages, nginx, etc.)

1. `npm run build`
2. Upload the contents of `dist/` to your host
3. Configure a fallback so any unknown path serves `index.html` with a 200 status (not a redirect) — e.g. for nginx:
   ```
   location / {
     try_files $uri /index.html;
   }
   ```

### Environment variables at build time

Set `VITE_API_URL` and `VITE_SOCKET_URL` in your host's environment variable settings before running the build — Vite bakes `import.meta.env.VITE_*` values in at build time, not runtime.

---

## 5. Architecture

```
src/
  components/
    common/        Button, Card, Modal, Drawer, Table, Pagination, Tabs, Accordion,
                    Timeline, Skeleton, EmptyState, ErrorState, ConfirmDialog, Avatar,
                    Badge, StatCard, SearchInput, Spinner, FileUpload, ResumePreview,
                    Breadcrumbs, PageHeader, ErrorBoundary
    layout/        Navbar, Footer, Sidebar, MobileDrawer, DashboardTopbar,
                    NotificationDropdown, ProfileDropdown, ThemeSwitch, CommandPalette,
                    PublicLayout, AuthLayout, DashboardLayout, navConfig
    forms/         TextField, SelectField, TextareaField, Checkbox, PasswordStrengthMeter
    jobs/          JobCard, CompanyCard, FilterPanel
    charts/        ChartCard, AreaTrendChart, BarComparisonChart, DonutChart,
                    FunnelBarChart, WeeklyActivityChart
    dashboard/     ApplicationTracker, RecentJobsList, PipelineOverview, ResumeStatusCard,
                    CalendarWidget, SkillMatchSummary, PerformanceInsights
    profile/       ProfileCompletionWidget, SectionEditor (generic CRUD list editor
                    shared by Skills/Education/Experience/Projects/Certifications)
    notifications/ NotificationItem
  pages/
    public/    Landing, About, Features, Contact, FAQ, Privacy, Terms, NotFound, Forbidden, Maintenance
    auth/      Login, Register, ForgotPassword, ResetPassword, VerifyEmail
    student/   Dashboard, Profile, Skills, Education, Experience, Projects, Certifications,
               ResumeBuilder, ResumeUpload, ResumeParserResult, Jobs, JobDetails,
               Applications, ApplicationDetails, SavedJobs, InterviewSchedule, Notifications
    recruiter/ Dashboard, CompanyProfile, CreateJob, EditJob, JobManagement (with per-job
               analytics drawer), Applicants, ApplicantDetails, CandidateProfile,
               CandidateComparison, MatchingDashboard, InterviewSchedule (reschedule/cancel), Analytics
    admin/     Dashboard, ManageUsers, Recruiters, CompanyVerification, JobModeration,
               PlatformAnalytics, Reports, FeedbackManagement, SystemHealth,
               DatabaseStatus, SystemSettings (Roles & Permissions / Audit Logs /
               Security Center / Support Tickets tabs)
    shared/    Settings, Messages
  context/     AuthContext, ThemeContext, ToastContext, SocketContext
  services/    api.js (Axios instance) + one service module per resource, each with a
               mock-data fallback in services/mock/mockData.js
  hooks/       useAsync, useDebounce, usePagination, useMediaQuery, useClickOutside
  routes/      AppRoutes (lazy-loaded, role-based), ProtectedRoute
  utils/       cn, constants, formatters, validators, exportCsv
  test/        Vitest setup + shared test-utils (provider-wrapped render helper)
```

### Notable implementation details

- **Role-based access** — `ProtectedRoute` reads the authenticated user's role and redirects to `/403` if a route's `roles` prop doesn't include it.
- **Dark mode** — toggled via `ThemeContext`, persisted to `localStorage`, applied through a Tailwind `dark:` variant on `<html>`.
- **Toasts** — global `ToastContext` + `useToast()` hook, used for every async action's success/error feedback.
- **Loading/empty/error states** — every data-driven page uses the shared `Skeleton`, `EmptyState`, and `ErrorState` components.
- **CSV export** — real client-side CSV generation (Applicants, Manage Users, Reports) via `utils/exportCsv.js` — actually downloads a file, not a placeholder toast.
- **Command palette** — `Ctrl/Cmd+K` inside any dashboard opens quick navigation.
- **Accessibility** — semantic landmarks, ARIA labels on icon-only buttons, keyboard-dismissible modals/drawers, visible focus rings, `aria-live` toasts.
- **Code splitting** — every route is `React.lazy`-loaded via `AppRoutes.jsx` (verified in the build output: each page ships as its own chunk).

---

## 6. Known limitations (frontend-only, by design)

- All data is mocked in `src/services/mock/mockData.js`. Nothing persists across a page reload — that requires a real backend.
- Socket.io is wired but inactive until `VITE_SOCKET_URL` is set to a real server.
- File uploads (resume, avatar, cover image, gallery photos, logo) validate and preview locally but do not upload anywhere.
- PDF report export (Admin → Reports) shows an informational toast rather than generating a real PDF — CSV export in the same page is fully real. Wiring a PDF library (e.g. `pdf-lib` or a backend endpoint) was left out to avoid adding a heavy dependency you didn't ask for; happy to add it if you want it.
- System Health / Database Status pages are read-only mock dashboards — in production these would read from your actual monitoring/DB provider's API, not from this frontend.
