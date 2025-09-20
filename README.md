# Sa3aMatch – Football Field Booking Platform

Sa3aMatch is a **modern, professional web platform** dedicated to booking football fields in Khouribga. It allows users to easily reserve a field by the hour, check availability, view weather forecasts, and manage favorite fields. Field owners can manage reservations through a secure admin dashboard.

---

## ✨ Features

### 🔓 User Side

- Secure account creation and login with **Clerk**
- Interactive map with **Leaflet.js + OpenStreetMap**
- Real-time availability grid (past or booked slots disabled)
- Direct booking with flexible payments (cash, bank transfer proof, optional Stripe)
- Email confirmations & reminders via **Resend**
- Favorites management for quick access
- Detailed field profiles (price, availability, photos, reviews)
- Upload documents (ID, license, proof)
- Upcoming matches & booking history
- Weather forecast for the booked time slot (via OpenWeatherMap)
- GPS directions to the field
- Profile management: update email, phone, password, picture
- GDPR consent & terms acceptance

### ⭐ Advanced User Features

- Smart availability grid with automatic updates
- Advanced filters (location, price, rating, lighting, etc.)
- Ratings & reviews system for fields
- Invoice & receipt generation after booking
- Partial deposit (acompte) support

### 🛠 Admin Side

- Secure admin access with role-based authorization
- Dashboard for managing:
    - Fields
    - Reservations
    - Time slots
    - Users
    - Payouts & statistics
- Reservation approval/rejection lifecycle
- Analytics (revenue, utilization, popular hours)

---

## 🧱 Tech Stack

- **Framework**: React + Vite
- **Language**: TypeScript 5.5.4 (compatible with @typescript-eslint)
- **UI**: Tailwind CSS + Custom Components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State/Data**: TanStack Query + Server Actions
- **Forms & Validation**: React Hook Form + Zod
- **Maps**: Leaflet + OpenStreetMap
- **Weather**: OpenWeatherMap API
- **Charts**: Recharts
- **Payments**: Cash, bank transfer, optional Stripe
- **Email**: Clerk (auth) + Resend (transactional)

- **Testing**: Vitest + React Testing Library + Playwright
- **CI/CD**: GitHub Actions → Vercel
- **Logging**: Vercel Analytics + Pino

---

## 📁 Project Structure

```
/ (Next.js App Router)
  app/
    (marketing)/page.tsx
    (dashboard)/layout.tsx page.tsx
    bookings/page.tsx
    favorites/page.tsx
    fields/page.tsx
    fields/[id]/page.tsx
    admin/
      layout.tsx
      page.tsx
      fields/page.tsx
      bookings/page.tsx
      users/page.tsx
  api/
    fields/route.ts
    fields/[id]/route.ts
    bookings/route.ts
    bookings/[id]/route.ts
    favorites/route.ts
    uploads/route.ts
    stripe/webhook/route.ts
    notifications/route.ts
  components/
  lib/        # db, auth, validation, utils
  server/     # server actions
  scripts/seed.ts
  public/
  .github/workflows/

```

---

## 🗄 Database Schema (MongoDB)

- **Users**: Clerk userId, favorites, role, phone
- **Fields**: name, location, price, photos, availability
- **Bookings**: fieldId, userId, slot, status, payment method, proof
- **TimeSlots**: ensure no double-booking
- **Audit Logs**: admin actions

---

## 🔐 Authentication & Authorization

- **Clerk** handles signup, login, MFA, social logins
- Roles: `user` (default) and `admin`
- Admin routes (`/admin/*`) require `admin` role
- API routes validated with Clerk’s SDK

---

## 📧 Email Notifications

- **Clerk** → auth emails (verification, reset, login)
- **Resend** → booking lifecycle:
    - Booking created (pending)
    - Approved / Rejected
    - Canceled
    - Reminder (24h before)

---

## 🧠 Booking Rules

- Atomic transactions for concurrency safety
- No double-booking enforced with `timeSlots`
- Lifecycle: pending → approved/rejected → canceled

---

## 📊 Admin Analytics

- Revenue & payouts
- Field utilization %
- Popular hours
- Built with MongoDB aggregation + Recharts

---

## 🧪 Testing Strategy

- Unit tests: booking logic, validation
- Integration tests: API routes with Clerk & Mongo mocked
- E2E tests: booking flows, proof uploads, emails (mocked)

---

##⚙️ Development

```bash
# Install dependencies
bun install

# Run dev server
bun run dev

# Run tests
bun run test

```

---

## 🔑 Environment Variables
# Supabase Configuration
VITE_SUPABASE_URL=https://ckdlgwswjfasclyyahrx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrZGxnd3N3amZhc2NseXlhaHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjE3MzgsImV4cCI6MjA3MjkzNzczOH0.y6DJwxDGb70j09LTBvsq9j2Z4GiNLlyzW_o1pSERffA

# Weather Configuration - Khouribga, Morocco
VITE_LATITUDE=32.8811
VITE_LONGITUDE=-6.9063

# Optional configurations
VITE_SUPABASE_SERVICE_ROLE_KEY=<<OPTIONAL_SERVICE_ROLE_KEY>>
NEXT_PUBLIC_MAP_TILES_URL=<<MAP_TILES_URL>>
VITE_STRIPE_SECRET_KEY=<<OPTIONAL_STRIPE_SECRET_KEY>>
VITE_STRIPE_WEBHOOK_SECRET=<<OPTIONAL_STRIPE_WEBHOOK_SECRET>>
NEXT_PUBLIC_SITE_URL=<<SITE_URL>>
.

---

## 🚀 Deployment

* **Frontend & API** → Vercel
* **Database** → MongoDB Atlas
* **CI/CD** → GitHub Actions

---

## ✅ Acceptance Criteria

* Users can browse, book, and favorite fields
* No double-booking possible
* Booking lifecycle enforced
* Resend delivers booking emails
* Admins manage fields, bookings, analytics
* Mobile-first & i18n-ready (English → Arabic/French)
* Fully secure & production-deployed

---

## 📜 License

MIT © Sa3aMatch
