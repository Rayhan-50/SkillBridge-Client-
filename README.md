# SkillBridge — Client

<p align="center">
  <strong>A modern, role-based tutoring platform frontend built for students, tutors, and admins.</strong><br/>
  Built with Next.js · React 19 · TypeScript · Tailwind CSS · TanStack Query
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
</p>

---

## 📖 Overview

SkillBridge is an online tutoring marketplace that connects students with expert tutors. This repository is the **Next.js frontend client**, providing a full-featured, responsive UI for browsing tutors, managing bookings, leaving reviews, and administering the platform.

**🌐 Live Demo:** [https://skillbridge-client-coral.vercel.app](https://skillbridge-client-coral.vercel.app)  
**🔗 Backend API:** [https://skillbridge-server-nu.vercel.app](https://skillbridge-server-nu.vercel.app)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS 4.x |
| UI Components | shadcn/ui, Radix UI, Lucide React |
| Data Fetching | TanStack React Query v5 + Axios |
| Forms | TanStack React Form + Zod |
| Auth | Better Auth (client SDK) |
| Date Handling | date-fns, react-day-picker |
| Theming | next-themes (dark/light mode) |
| Notifications | Sonner |
| Deployment | Vercel |

---

## ✨ Features

- 🎨 **Modern UI** — Glassmorphic design with smooth animations and dark/light mode support
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop
- 🔐 **Role-Based Interface** — Distinct dashboards for `STUDENT`, `TUTOR`, and `ADMIN` roles
- 📅 **Booking System** — Browse tutor schedules, create bookings, track session status
- ⭐ **Review System** — Leave star ratings and comments after completed sessions
- 🧑‍🏫 **Tutor Profiles** — Rich profiles with bio, subjects, hourly rate, and availability
- 🛡️ **Admin Dashboard** — Manage users, categories, and platform-wide statistics
- ⚡ **Optimistic UI** — TanStack Query for caching, background refetching, and optimistic updates
- 🔒 **Protected Routes** — Middleware-based route guards with session verification

---

## 📁 Project Structure

```
SkillBridge-client/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── (admin)/                  # Admin-only pages
│   │   ├── (auth)/                   # Login & register pages
│   │   ├── (commonLayout)/           # Public pages (home, tutors)
│   │   ├── (dashboardLayout)/        # Shared dashboard shell
│   │   ├── (student)/                # Student dashboard pages
│   │   └── (tutor)/                  # Tutor dashboard pages
│   ├── components/
│   │   ├── auth/                     # Auth forms (login, register)
│   │   ├── common/                   # Shared UI (cards, loaders, pagination)
│   │   ├── layout/                   # Navbar, Sidebar, Footer
│   │   ├── modules/                  # Feature modals (BookingModal, ReviewModal)
│   │   ├── tutor/                    # Tutor-specific components (ProfileSettingsForm)
│   │   └── ui/                       # Low-level shadcn/ui primitives
│   ├── hooks/                        # Custom React hooks
│   ├── providers/                    # Global providers (Auth, Query, Theme)
│   ├── services/                     # Axios API service functions
│   ├── constants/                    # App-wide constants (routes, config)
│   ├── types/                        # Shared TypeScript interfaces
│   ├── lib/                          # Utility helpers (auth client, api setup)
│   ├── env.ts                        # Type-safe env validation (t3-env)
│   └── middleware.ts                 # Route guards & session verification
├── public/                           # Static assets
├── .env                              # Environment variables (not committed)
├── next.config.ts                    # Next.js config (rewrites proxy to backend)
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- Backend server running (see [SkillBridge Server](https://github.com/Rayhan-50/SkillBridge-server))

### 1. Clone & Install

```bash
git clone https://github.com/Rayhan-50/SkillBridge-client.git
cd SkillBridge-client
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
# Used server-side by Next.js rewrites to proxy /api/* to backend
BACKEND_URL="https://skillbridge-server-nu.vercel.app"

# Used client-side (relative paths for cookie compatibility)
NEXT_PUBLIC_API_URL="/api"
NEXT_PUBLIC_BETTER_AUTH_URL="/api/auth"
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local development server with hot-reload |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `BACKEND_URL` | ✅ Server-only | Full URL of the backend API (used by Next.js rewrites) |
| `NEXT_PUBLIC_API_URL` | ✅ Client | Relative path for API calls (`/api`) |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | ✅ Client | Relative path for auth endpoints (`/api/auth`) |

> **Note:** All `/api/*` requests from the client are transparently proxied to the backend via `next.config.ts` rewrites — no CORS issues and cookies work seamlessly.

---

## 🎨 UI/UX Highlights

- **Glassmorphism** — Frosted-glass card effects and layered depth throughout the UI
- **Dark / Light Mode** — Seamless theme switching via `next-themes`, persisted per user
- **Micro-animations** — Smooth hover states, modal transitions, and loading skeletons
- **Role Dashboards** — Completely different sidebar navigation and page sets per role
- **Booking Flow** — Multi-step modal with date picker, time slot selection, and price preview
- **Toast Notifications** — Non-intrusive success/error feedback via Sonner
- **Protected Layouts** — Route groups with middleware-level session checks before render

---

## 🖼️ Screenshots

> _Live at [https://skillbridge-client-coral.vercel.app](https://skillbridge-client-coral.vercel.app)_

| Page | Description |
|---|---|
| `/` | Landing page with hero, features, and tutor showcase |
| `/tutors` | Browse & filter tutors by subject, price, and rating |
| `/student/dashboard` | Student bookings, upcoming sessions, and reviews |
| `/tutor/dashboard` | Tutor profile, booking requests, and earnings |
| `/admin/dashboard` | Platform stats, user management, and categories |

---

## 🔮 Future Improvements

- [ ] Real-time booking notifications (WebSockets / Server-Sent Events)
- [ ] In-app messaging between students and tutors
- [ ] Payment flow (Stripe integration)
- [ ] Calendar view for tutor availability
- [ ] Progressive Web App (PWA) support
- [ ] Comprehensive E2E test suite (Playwright)

---

## 👤 Author

**Rayhan**  
📧 rayhanahmed.nstu@gmail.com  
🔗 [GitHub](https://github.com/Rayhan-50)

---

<p align="center">Made with ❤️ for the SkillBridge platform</p>
