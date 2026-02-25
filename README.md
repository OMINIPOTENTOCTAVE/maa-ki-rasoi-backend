# 🍛 Maa Ki Rasoi

A home-style meal ordering platform — daily tiffin subscriptions, instant orders, and delivery management. Pure Veg. ₹100/meal.

## 📱 Download Apps (APKs)

- [⬇️ Download Customer App](https://github.com/OMINIPOTENTOCTAVE/maa-ki-rasoi-backend/raw/main/apks/MaaKiRasoi-Customer.apk)
- [⬇️ Download Delivery Partner App](https://github.com/OMINIPOTENTOCTAVE/maa-ki-rasoi-backend/raw/main/apks/MaaKiRasoi-Delivery.apk)
- [⬇️ Download Admin App](https://github.com/OMINIPOTENTOCTAVE/maa-ki-rasoi-backend/raw/main/apks/MaaKiRasoi-Admin.apk)

## Architecture

```
maakirasoi/
├── src/                  # Backend API (Express + Prisma)
│   ├── modules/          # Route handlers (auth, menu, orders, subscriptions, delivery)
│   ├── middleware/        # Auth middleware, rate limiting
│   └── server.js         # Entry point
├── prisma/               # Database schema & migrations
├── apps/
│   ├── customer/         # Customer PWA (Vite + React + Tailwind)
│   ├── admin/            # Admin dashboard (Vite + React)
│   └── delivery/         # Delivery partner app (Vite + React + Tailwind)
├── render.yaml           # Render deployment config
└── .github/workflows/    # CI pipeline
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express 5, Prisma ORM |
| Database | PostgreSQL (Supabase) |
| Frontend | React 18, Vite, Tailwind CSS |
| Auth | JWT + OTP via Fast2SMS |
| Payments | Razorpay |
| Hosting | Render (API), Vercel/Render (Apps) |

## Local Development

### Prerequisites
- Node.js 20+
- PostgreSQL database (or [Supabase](https://supabase.com) free tier)

### 1. Backend Setup
```bash
git clone https://github.com/OMINIPOTENTOCTAVE/maa-ki-rasoi-backend.git
cd maa-ki-rasoi-backend

cp .env.example .env
# Edit .env with your database URLs, JWT secret, and API keys

npm install
npx prisma generate
npx prisma db push

npm run dev          # Starts on http://localhost:5000
```

### 2. Frontend Apps
```bash
# Customer App
cd apps/customer
npm install
npm run dev          # http://localhost:5173

# Admin App (separate terminal)
cd apps/admin
npm install
npm run dev          # http://localhost:5174

# Delivery App (separate terminal)
cd apps/delivery
npm install
npm run dev          # http://localhost:5175
```

### 3. Initial Admin Setup
```bash
curl -X POST http://localhost:5000/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "yourpassword"}'
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string (transaction pooler) | ✅ |
| `DIRECT_URL` | PostgreSQL direct connection (for migrations) | ✅ |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ |
| `PORT` | Server port (default: 5000) | ❌ |
| `NODE_ENV` | `development` or `production` | ❌ |
| `FAST2SMS_API_KEY` | Fast2SMS API key for OTP | ✅ (production) |
| `RAZORPAY_KEY_ID` | Razorpay key ID | ✅ (production) |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | ✅ (production) |
| `CORS_ORIGIN` | Allowed frontend origin | ❌ |

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for full deployment instructions.

**Quick summary:**
- **Database**: Supabase (free tier PostgreSQL)
- **Backend**: Render Web Service (`render.yaml` included)
- **Frontend**: Vercel or Render Static Sites

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/otp/request` | Send OTP to phone |
| `POST` | `/auth/otp/verify` | Verify OTP & login |
| `POST` | `/auth/login` | Admin login |
| `GET` | `/menu` | Get today's menu |
| `GET` | `/subscriptions` | Get user subscriptions |
| `POST` | `/subscriptions` | Create subscription |
| `GET` | `/orders` | Get orders |
| `POST` | `/orders` | Place instant order |
| `GET` | `/delivery/tasks` | Get delivery tasks |

See [Postman Collection](MAA_KI_RASOI_Postman_Collection.json) for full API documentation.

## License

ISC
