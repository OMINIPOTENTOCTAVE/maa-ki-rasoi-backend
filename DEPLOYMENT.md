# 🚀 MAA KI RASOI - Deployment Guide
**Last Updated:** 2026-02-24

## Architecture Overview
```
┌─────────────────────────────────────────────────┐
│                   VERCEL (Frontend)             │
│  ┌─────────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Customer PWA│ │ Admin    │ │ Delivery App │  │
│  │ (React+Vite)│ │ Panel    │ │ (React+Vite) │  │
│  └──────┬──────┘ └────┬─────┘ └──────┬───────┘  │
└─────────┼─────────────┼──────────────┼──────────┘
          │   API Calls (HTTPS)        │
          ▼             ▼              ▼
┌─────────────────────────────────────────────────┐
│               RENDER (Backend)                   │
│           Node.js / Express API                  │
│           Port: 5000  (render.yaml)              │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│              SUPABASE (Database)                 │
│           PostgreSQL (Prisma ORM)                │
└─────────────────────────────────────────────────┘
```

---

## ✅ FRONTEND — Already Deployed to Vercel

| App | Live URL | Status |
|-----|----------|--------|
| **Customer PWA** | https://maa-ki-rasoi-customer.vercel.app | ✅ Live |
| **Admin Panel** | https://maa-ki-rasoi-admin.vercel.app | ✅ Live |
| **Delivery App** | https://delivery-two-blue.vercel.app | ✅ Live |

> All 3 apps use `VITE_API_URL` environment variable pointing to the Render backend.
> Production `.env.production` files are configured to `https://maa-ki-rasoi-api.onrender.com`

### Re-deploying Frontends
```bash
# From each app directory:
cd apps/customer && vercel deploy --prod --yes
cd apps/admin && vercel deploy --prod --yes
cd apps/delivery && vercel deploy --prod --yes
```

---

## 🔧 BACKEND — Deploy to Render

### Step 1: Go to Render Dashboard
1. Visit https://dashboard.render.com
2. Sign in with GitHub (same account as the repo)
3. Click **"New +"** → **"Web Service"**

### Step 2: Connect Repository
1. Search for `OMINIPOTENTOCTAVE/maa-ki-rasoi-backend`
2. Select the `main` branch

### Step 3: Configure Build Settings
The `render.yaml` is already configured, but if prompted:
- **Name:** `maa-ki-rasoi-api`
- **Environment:** `Node`
- **Build Command:** `npm install && npx prisma generate`
- **Start Command:** `npm run start`
- **Plan:** Free

### Step 4: Set Environment Variables
Add these in Render's dashboard under **Environment → Environment Variables**:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | `postgresql://postgres.mgzzonfqtxddtufjkiqw:MaaRasoi2025Secure@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1` | Supabase pooler |
| `DIRECT_URL` | `postgresql://postgres.mgzzonfqtxddtufjkiqw:MaaRasoi2025Secure@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres` | Supabase direct |
| `JWT_SECRET` | `maakirasoi-production-ready-secret-key-2026` | Change for production! |
| `NODE_ENV` | `production` | |
| `CORS_ORIGIN` | `https://maa-ki-rasoi-customer.vercel.app,https://maa-ki-rasoi-admin.vercel.app,https://delivery-two-blue.vercel.app` | Comma-separated frontend URLs |
| `FAST2SMS_API_KEY` | `YWL4N70qz8upCO5MSgRGsH3FnloiJAjVrx6DaQmtf1ZvPIdk2XBsnEV4utmc3JvMaeriO6C12lDLKSYq` | SMS gateway |
| `RAZORPAY_KEY_ID` | (your key) | Get from Razorpay dashboard |
| `RAZORPAY_KEY_SECRET` | (your key) | Get from Razorpay dashboard |

### Step 5: Deploy
Click **"Create Web Service"** — Render will auto-build and deploy.

### Step 6: Verify
```
curl https://maa-ki-rasoi-api.onrender.com/health
# Expected: {"status":"OK","timestamp":"..."}
```

---

## 🔑 IMPORTANT: Post-Deploy Checklist

- [ ] Backend health check returns OK
- [ ] Customer PWA loads and shows login screen
- [ ] OTP delivery works via Fast2SMS
- [ ] Admin can log in and see dashboard
- [ ] Create first admin account: `POST /auth/register` with `{ "username": "admin", "password": "YourSecurePassword" }`
- [ ] Menu items can be created from admin panel
- [ ] Subscription flow works end-to-end
- [ ] Razorpay payment flow works (test mode first)

---

## 🔄 Future Re-deployments

### Backend (auto-deploys on push to main)
```bash
git push origin main
# Render auto-deploys on push
```

### Frontend (manual via CLI)
```bash
cd apps/customer && vercel deploy --prod --yes
cd apps/admin && vercel deploy --prod --yes
cd apps/delivery && vercel deploy --prod --yes
```

Or push to main and configure Vercel GitHub integration for auto-deploy.
