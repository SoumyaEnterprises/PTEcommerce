# PT. HI-TECH — Admin Portal (Demo Build)

A fully interactive admin dashboard for managing the PT. HI-TECH storefront's
products, categories, and brands. **This build runs entirely on mock data
and `localStorage` — there is no backend, database, or network call
anywhere in the app.** It exists to demonstrate the exact UI/UX of the
real admin product before any backend work begins.

---

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you'll land on the login page.

### Demo login

```
Email:    admin@pthitech.co.id
Password: HiTech2026!
```

Click **"Use demo admin credentials"** on the login screen to autofill both
fields. There's also a "Forgot password?" flow — it's a UI-only mock and
does not send real email.

---

## What's implemented

- **Auth (mock)** — login form, remember me, forgot password flow, session
  persisted to `localStorage` via Zustand, automatic logout after 15 minutes
  of inactivity, protected route group (`/(dashboard)/*` redirects to
  `/login` if not authenticated).
- **Dashboard** — stat cards (products, in stock, out of stock, categories,
  brands, orders/customers placeholders, revenue estimate), a revenue trend
  chart, a stock health donut chart, and a recent activity feed that updates
  live as you make changes elsewhere in the app.
- **Products** — full CRUD:
  - List page with search (name/SKU/tag), filters (brand, category, status,
    stock level, featured), sorting, pagination, and bulk actions (publish,
    hide, delete).
  - Add/Edit form: name, SKU, brand, category, description, dynamic
    specifications (key/value rows), pricing (price + optional discount +
    currency), stock + low-stock threshold, drag-and-drop multi-image
    upload with thumbnail selection, tags, and visibility flags (featured /
    bestseller / new arrival / active-hidden-draft).
  - Delete with a confirmation dialog (single and bulk).
- **Categories** — add/edit/delete with image upload, shown as a card grid.
- **Brands** — add/edit/delete with logo upload, shown as a card grid.
- **Inventory** — current stock, low-stock and out-of-stock views, and a
  restock action that increments stock and is reflected immediately
  everywhere (dashboard stats, product list, inventory list).
- **Toasts** for every success/error state; a polished confirm-dialog
  component for every destructive action.
- **Sidebar** lists reserved-but-locked nav items (Orders, Customers,
  Coupons, Reviews, Analytics, Shipping, Payments, Vendors) so the
  information architecture for future modules is visible today.

Everything above is wired to **React Query** for caching/invalidation, so
the UI behaves like it's talking to a real API (loading states, optimistic
cache invalidation on mutation, etc.) even though the "network" calls are
just `setTimeout`-delayed in-memory operations.

---

## Project structure

```
src/
  app/
    login/page.tsx              — public login page
    (dashboard)/                — protected route group
      layout.tsx                 — sidebar + topbar + auth guard
      dashboard/page.tsx
      products/page.tsx          — list
      products/new/page.tsx      — create
      products/[id]/page.tsx     — edit
      categories/page.tsx
      brands/page.tsx
      inventory/page.tsx
  components/
    ui/                          — Button, Input, Modal, ConfirmDialog, Toast, etc.
    layout/                      — Sidebar, Topbar
    dashboard/                   — StatCard, ActivityFeed, charts
    products/                    — table, form, image uploader, filters, badges
    categories/ brands/          — form modals
  lib/
    data/
      adapter.ts                 — DataAdapter interface (the contract)
      mock-adapter.ts             — current implementation (localStorage)
      hooks.ts                   — React Query hooks components actually use
      index.ts                   — the ONE line that selects which adapter is active
    seed-products.ts seed-categories.ts seed-brands.ts
    product-schema.ts            — Zod schema + RHF types for the product form
    use-auth-guard.ts
  store/
    auth-store.ts                — mock session (Zustand + persist)
    toast-store.ts
  types/index.ts                 — Product / Category / Brand / filters, etc.
```

---

## How this becomes the real thing (Supabase migration path)

This codebase was deliberately structured so the **entire backend swap is
one file plus one line**, with zero changes to any page or component:

1. **Create the Supabase project** and run the schema below.
2. **Write `src/lib/data/supabase-adapter.ts`** that implements the same
   `DataAdapter` interface defined in `src/lib/data/adapter.ts` — same
   method names, same inputs/outputs, just backed by real `supabase-js`
   calls instead of the in-memory arrays in `mock-adapter.ts`.
3. **Change one import** in `src/lib/data/index.ts`:
   ```ts
   // before
   import { mockAdapter } from "./mock-adapter";
   export const dataAdapter: DataAdapter = mockAdapter;

   // after
   import { supabaseAdapter } from "./supabase-adapter";
   export const dataAdapter: DataAdapter = supabaseAdapter;
   ```
4. **Replace the auth store's `login()`** in `src/store/auth-store.ts` with
   `supabase.auth.signInWithPassword()`, and replace the hand-rolled
   `localStorage` session with Supabase's real session/JWT (Supabase's
   client already persists sessions for you).
5. **Image uploads**: in `src/components/products/image-uploader.tsx`, the
   `URL.createObjectURL(file)` call is clearly commented as the one line to
   replace with an upload to Supabase Storage, returning the public URL.

Nothing in `app/`, `components/products/`, `components/categories/`, or
`components/brands/` needs to change, because they only ever call the hooks
in `src/lib/data/hooks.ts`, which only ever call `dataAdapter`.

### Suggested Supabase schema

```sql
create table brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo text,
  created_at timestamptz default now()
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  image text,
  created_at timestamptz default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  sku text unique not null,
  brand_id uuid references brands(id),
  category_id uuid references categories(id),
  description text,
  specifications jsonb default '[]',
  price numeric not null,
  discount_price numeric,
  currency text default 'IDR',
  stock integer default 0,
  low_stock_threshold integer default 10,
  images jsonb default '[]',     -- [{ id, url, isThumbnail }]
  featured boolean default false,
  bestseller boolean default false,
  new_arrival boolean default false,
  warranty text,
  tags text[] default '{}',
  status text default 'active', -- active | hidden | draft
  meta_title text,
  meta_description text,
  canonical_url text,
  og_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table admin_users (
  id uuid primary key references auth.users(id),
  name text,
  role text default 'admin'
);
```

Row-level security: enable RLS on all tables, and only allow
`select`/`insert`/`update`/`delete` on `products`, `categories`, and
`brands` to rows where `auth.uid()` exists in `admin_users` — the storefront
(public, unauthenticated) should only ever be able to `select` rows where
`status = 'active'`.

---

## Notes & known limitations (by design, for a demo)

- Uploaded images are local object URLs (`URL.createObjectURL`) — they live
  only in the current browser tab/session and are never sent anywhere. They
  disappear on refresh because object URLs aren't persisted to
  `localStorage` (only metadata like "is this the thumbnail" would survive
  a refresh if you re-pick the same files).
- "Orders," "Customers," "Revenue," and similar dashboard numbers are
  static placeholders — there's no real commerce data model yet. The
  sidebar deliberately shows these as locked, reserved nav items.
- There is no real password hashing, JWT, or RBAC here — that's explicitly
  out of scope for this milestone per the client's request. The login form
  and session model are shaped so swapping in Supabase Auth is mechanical
  (see migration path above).
