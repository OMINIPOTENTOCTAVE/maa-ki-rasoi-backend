# Maa Ki Rasoi MVP (7-Day Launch)

Lean production-ready MVP for taking real COD orders in one locality.

## What is built

- **Customer app (no login):** menu, category filter, cart, COD checkout.
- **Admin app (login only):** manage menu, view/filter orders, update order status, see today's revenue.
- **Backend API:** Node + Express + Prisma + Supabase PostgreSQL.
- **Security basics:** bcrypt password hashing, JWT auth for admin routes, request validation, centralized error handler.

## Project structure

- `src/` - Express backend
- `prisma/` - Prisma schema + admin seed script
- `frontend/` - React mobile-first app (customer + admin UI)

## Database schema (Prisma)

Tables:
- `menu_items`
- `orders`
- `order_items`
- `admin_users`

All primary IDs use UUID and include timestamps.

## Backend setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure env:
   ```bash
   cp .env.example .env
   ```
3. Set `DATABASE_URL` to Supabase Postgres pooled connection string.
4. Generate Prisma client + apply migrations:
   ```bash
   npm run prisma:generate
   npx prisma migrate dev --name init
   ```
5. Seed admin user:
   ```bash
   npm run prisma:seed
   ```
6. Run backend:
   ```bash
   npm run dev
   ```

Production start script:
```bash
npm start
```

## Frontend setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Configure env:
   ```bash
   cp .env.example .env
   ```
3. Run frontend:
   ```bash
   npm run dev
   ```

## API summary

### Public
- `GET /api/menu` (supports `?category=`)
- `POST /api/orders`

### Admin auth
- `POST /api/auth/admin/login`

### Admin protected (JWT)
- `GET /api/menu/admin`
- `POST /api/menu/admin`
- `PATCH /api/menu/admin/:id`
- `GET /api/admin/orders` (supports `?status=`)
- `PATCH /api/admin/orders/:id/status`
- `GET /api/admin/revenue/today`

## Deploy in production

### 1) Supabase (database)
1. Create Supabase project.
2. Copy connection string into backend `DATABASE_URL`.
3. Run migrations from CI or first deploy instance.
4. Run `npm run prisma:seed` once to create admin user.

### 2) Backend (Render/Railway)
- Root directory: repo root
- Build command:
  ```bash
  npm install && npm run prisma:generate && npm run prisma:migrate
  ```
- Start command:
  ```bash
  npm start
  ```
- Environment variables:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `NODE_ENV=production`
  - `PORT` (platform-managed)

### 3) Frontend (Vercel)
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Env variable:
  - `VITE_API_BASE_URL=https://<your-backend-domain>/api`

## Notes for launch

- COD only (no payment gateway).
- Customer login intentionally omitted for fast conversion.
- Status flow: `Pending -> Confirmed -> Preparing -> Delivered`.
- Designed to comfortably handle first 50–100 daily orders.
