# 🍛 MAA KI RASOI — COMPLETE PLATFORM DOCUMENT
**Version:** 1.0 — Master Edition
**Contains:** Platform Overview · Authentication · Business Logic
**For:** Antigravity Agent · Developers · Investors
**Status:** Final · Audited · Production-Ready

---

## 📋 TABLE OF CONTENTS

1. [Platform Overview & Architecture](#part-1)
2. [Authentication Architecture](#part-2)
3. [Business Logic](#part-3)
   - Module 0: Menu Management
   - Module 1: Subscription Lifecycle
   - Module 2: Payments & Refunds
   - Module 3: Order Generation & Delivery
   - Module 4: Admin Controls

---

# ═══════════════════════════════════════════
# PART 1 — PLATFORM OVERVIEW & ARCHITECTURE
# ═══════════════════════════════════════════

## 🧠 WHO YOU ARE

You are the **principal engineer and product owner** of Maa Ki Rasoi (MKR) — a production-grade meal subscription platform serving home-style Indian food. You are responsible for making every part of this system work perfectly, in sync, and ready to scale.

You think in **systems**, not files. Every change you make must be evaluated for its impact on all 4 apps, the database, and the API. You never fix one thing and break another.

**Your north star:** A customer places an order → it flows from the PWA → through the API → into the database → out to the Admin Dashboard → into the Delivery Partner's manifest → back to the customer as a status update. This loop must be unbreakable.

---

## 🌐 THE PLATFORM

| App | URL | Purpose |
|-----|-----|---------|
| Customer PWA | https://maakirasoi-customer-2026.web.app | Orders, subscriptions, pause, support |
| Admin Dashboard | https://maakirasoi-admin-2026.web.app | Dispatch, menu, operations, analytics |
| Delivery Partner | https://maakirasoi-delivery-2026.web.app | Rider manifests, delivery status |
| Backend API | https://maakirasoi-api-213402009735.asia-south1.run.app | All business logic |
| Database | PostgreSQL via Prisma ORM | Single source of truth |

**Tech Stack:**
- Frontend: React 18 + Vite + Tailwind CSS + shadcn/ui + framer-motion + Lucide React + Google Material Symbols
- Backend: Node.js + Express.js + Prisma ORM
- Auth: Firebase (Google OAuth IdP) + Custom JWT (session management) + Fast2SMS (OTP)
- Payments: Razorpay SDK
- Infra: Firebase Hosting (frontend) + Vercel / Google Cloud Run (backend) + Supabase / Neon (PostgreSQL)
- Version Control: Git + GitHub

**Design System:**
- Brand Saffron: `#C8550A` | Antique Cream: `#F8F7F5` | Kitchen Brown: `#2D2418`
- Fonts: Fraunces (headings) + DM Sans (body)
- Components: shadcn/ui with MKR tokens
- Motion: framer-motion on all transitions
- Toasts: sonner

---

## 📐 ARCHITECTURE PRINCIPLES
*(Follow these on every task, forever)*

**1. Single Source of Truth**
PostgreSQL is always the source of truth. No app caches state locally that contradicts the DB.

**2. API-First**
No app writes directly to the database. Everything goes through the backend API.

**3. Consistent Response Shape**
```json
{ "success": true/false, "data": {}, "message": "Human readable string" }
```

**4. Named Exports Only**
All React components use named exports. No default exports on shared components.

**5. data-testid on Everything**
Every interactive element has `data-testid` in kebab-case (e.g. `subscribe-btn`, `otp-input`).

**6. Mobile-First**
Every UI decision starts at 390px width. Desktop is an enhancement.

**7. Expandability**
Every module is self-contained: routes → controller → service → schema.
Adding a new feature = adding a new module folder. Never scatter logic.

---

## 🔄 THE CORE BUSINESS LOOP

```
Customer logs in (Firebase Google / OTP)
    ↓
Selects a plan → Pays via Razorpay OR chooses COD
    ↓
Subscription created in DB (status: ACTIVE)
    ↓
Admin publishes tomorrow's menu (before 10 PM IST)
    ↓
10:30 PM cron generates Orders for all active subscriptions
    ↓
Admin generates Dispatch Manifest → assigns riders
    ↓
Delivery Partner receives manifest → marks orders DELIVERED
    ↓
Customer sees order status updated in Order History
    ↓
Customer can PAUSE (before 10 PM IST cutoff)
    ↓
Subscription resumes next eligible day
```

**Every step of this loop must work before launch.**

---

## ✅ MASTER LAUNCH CHECKLIST

### 🔴 Must be green before going live:
```
[ ] Google Sign-In works on live URL
[ ] OTP login works (Fast2SMS delivering)
[ ] Razorpay test payment completes, subscription activates
[ ] COD order creates successfully
[ ] Smart pause works, 10 PM IST cutoff enforced
[ ] Admin can see new subscriptions and orders
[ ] Dispatch manifest generates correctly
[ ] Delivery partner can mark orders delivered
[ ] Admin sees delivery status update
[ ] API health check returns 200
[ ] Protected routes reject unauthenticated requests
[ ] All 4 apps load without console errors
[ ] VITE_API_URL set to production backend (not localhost)
```

### 🟠 Within 48 hours of launch:
```
[ ] Order history correct for all users
[ ] Meal credits calculated accurately
[ ] Support ticket creation works
[ ] Menu page shows today's items
[ ] Admin can toggle menu item availability
[ ] COD orders visible and confirmable in Admin
[ ] Rider app shows correct manifest
[ ] All error states show friendly messages
```

### 🟡 Within first week:
```
[ ] Daily order generation cron tested in production
[ ] Subscription expiry handled correctly
[ ] Manifest PDF download works
[ ] Admin analytics show correct numbers
[ ] Holiday management tested
```

---

## 🐛 BUG LOG FORMAT

```
BUG-{number}: {title}
Severity  : P0 / P1 / P2
App       : Customer / Admin / Delivery / API
Flow      : Which user flow is broken
Symptom   : What the user sees
Root Cause: What's actually wrong
Fix       : What you'll change (ask before doing)
```

---

## 🔁 HOW TO ADD A NEW FEATURE

Always in this order:
1. **Schema first** — add to `prisma/schema.prisma`, run migration
2. **API second** — create module: routes / controller / service / schema
3. **Admin UI third** — admin controls before customer exposure
4. **Customer UI last** — only after admin control exists
5. **Test the loop** — verify data flows end to end

---

## 📞 ESCALATION GUIDE

| Symptom | Check First |
|---------|-------------|
| Google Sign-In fails | Firebase Console → Auth → Authorized Domains |
| OTP not received | Fast2SMS dashboard → credits → API logs |
| Payment fails | Razorpay Dashboard → Test/Live mode → Webhook logs |
| API returns 500 | Cloud Run / Vercel → Logs → filter by error |
| DB connection fails | Check DATABASE_URL in env → connection pool settings |
| Deploy fails | Check build logs → `npm run build` locally first |
| Subscription not activating | Check Razorpay webhook → `/api/payments/verify` logs |

---

# ═══════════════════════════════════════════
# PART 2 — AUTHENTICATION ARCHITECTURE
# ═══════════════════════════════════════════

## How Auth Works in MKR

MKR uses a **hybrid auth pattern**:
- **Firebase** = Identity Provider only (Google OAuth)
- **Custom JWT** = All session management and API authorization
- Firebase is NOT used for API route protection

---

## Flow 1 — Google Sign-In

```
Customer taps "Continue with Google"
    ↓
Firebase Client SDK opens Google OAuth popup
Google returns Firebase idToken (short-lived, ~1 hour)
    ↓
Frontend POSTs idToken to: POST /api/auth/google
    ↓
Backend verifies: GET https://oauth2.googleapis.com/tokeninfo?id_token={idToken}
Google returns: { googleId, email, name }
    ↓
Backend checks Prisma Customer table:
  NEW customer    → CREATE new row
  OTP customer    → UPDATE row, link googleId
  Existing Google → proceed (no change)
    ↓
Firebase job is DONE. Backend takes over completely.
    ↓
Backend generates two custom JWTs via jsonwebtoken + JWT_SECRET:
  accessToken:  { id, email, role: 'customer' } → 15 minutes
  refreshToken: { id, version }                 → 30 days
    ↓
accessToken  → stored in localStorage as 'customer_token'
refreshToken → set as httpOnly cookie
    ↓
All API calls: Authorization: Bearer {customer_token}
```

---

## Flow 2 — OTP Sign-In (Fast2SMS)

```
Customer enters phone number
    ↓
POST /api/auth/send-otp { phone: "91XXXXXXXXXX" }
Backend generates 6-digit OTP → stores with 10-min expiry → sends via Fast2SMS
    ↓
Customer enters OTP
    ↓
POST /api/auth/verify-otp { phone, otp }
Backend validates → same JWT generation as Google flow
```

---

## Flow 3 — Token Refresh

```
API returns 401 (accessToken expired)
    ↓
Frontend intercepts → POST /api/auth/refresh
Backend reads refreshToken from httpOnly cookie
Validates token + version → issues new accessToken
    ↓
Frontend retries original request with new token
If refresh also expired → redirect to login
```

---

## Flow 4 — Admin Auth

```
POST /api/auth/admin/login { email, password }
Backend validates against Admin table (bcrypt)
Issues JWT: { id, email, role: 'admin' } → 8 hours
Stored in localStorage as 'admin_token'
All admin routes: authenticateAdmin middleware
  → verifies JWT + checks role === 'admin'
  → returns 403 if customer token used
```

---

## Middleware

### authMiddleware (Customer routes)
```js
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = req.cookies?.customer_token ||
    (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

  if (!token) return res.status(401).json({
    success: false, message: "Authentication required"
  });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'customer') return res.status(403).json({
      success: false, message: "Customer access only"
    });
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') return res.status(401).json({
      success: false, message: "Token expired", code: "TOKEN_EXPIRED"
    });
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
```

### authenticateAdmin (Admin routes)
```js
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = req.cookies?.admin_token ||
    (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

  if (!token) return res.status(401).json({
    success: false, message: "Admin authentication required"
  });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({
      success: false, message: "Forbidden: Admin access only"
    });
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid admin token" });
  }
};
```

---

## Frontend Token Management

```js
// Send token on every request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('customer_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on expiry
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 &&
        error.response?.data?.code === 'TOKEN_EXPIRED') {
      try {
        const { data } = await axios.post('/api/auth/refresh');
        localStorage.setItem('customer_token', data.accessToken);
        error.config.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(error.config);
      } catch {
        localStorage.removeItem('customer_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

---

## Auth Rules — Never Violate

```
❌ Never use Firebase Admin SDK for API route protection
❌ Never store Firebase idToken in localStorage
❌ Never use Firebase idToken as a session token for API calls
❌ Never send refreshToken in response body (httpOnly cookie only)
❌ Never store admin_token and customer_token under the same key
✅ Always verify Firebase idToken server-side via tokeninfo endpoint
✅ Always issue your own JWT immediately after Firebase verification
✅ Always return code: "TOKEN_EXPIRED" so frontend knows to refresh vs re-login
```

---

## Environment Variables

```dotenv
# Backend
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=30d
FIREBASE_PROJECT_ID=maa-ki-rasoi-app-2026
FAST2SMS_API_KEY=your_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
DATABASE_URL=your_postgres_url

# Frontend (all 3 PWAs)
VITE_API_URL=https://your-backend-url.com
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=maa-ki-rasoi-app-2026.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=maa-ki-rasoi-app-2026
VITE_RAZORPAY_KEY_ID=your_key
```

---

# ═══════════════════════════════════════════
# PART 3 — BUSINESS LOGIC
# ═══════════════════════════════════════════

## 🏢 THE BUSINESS — COMPLETE GROUND TRUTH

### What MKR Is
A daily home-style meal subscription platform. One central kitchen.
Three revenue streams — platform supports the first, the other two run themselves.

| Stream | Frequency | Platform |
|--------|-----------|----------|
| Tiffin subscriptions + one-time orders | Daily — core business | Full platform |
| Street stall | Daily — same kitchen | Offline, no platform needed |
| Bulk orders | Rare, occasional | Admin manual entry only |

### The Product — One Tiffin, ₹100

**Physical tiffin:** 4 stainless steel containers stacked in a carrier

| Container | Contents | Changes Daily? |
|-----------|----------|---------------|
| 1 | Steamed Rice | No — always rice |
| 2 | 4 Fresh Rotis / Phulka | No — always 4 rotis |
| 3 | Item A (from daily selection) | Yes |
| 4 | Item B (from daily selection) | Yes |
| + | Salad / Kachumber (small pouch) | Yes — seasonal |

**Daily item pool — admin picks ANY 2 for containers 3 & 4:**
```
Fixed rotation:     Rajma | Chole | Kadhi
Paneer (rotational): Kadahi Paneer | Shahi Paneer | Matar Paneer
Vegetable:          Mix Veg | Seasonal vegetable
```

**Sample weekly rotation:**
| Day | Container 3 | Container 4 |
|-----|------------|------------|
| Monday | Rajma | Kadahi Paneer |
| Tuesday | Chole | Mix Veg |
| Wednesday | Kadhi | Shahi Paneer |
| Thursday | Rajma | Seasonal Veg |
| Friday | Chole | Matar Paneer |
| Saturday | Kadhi | Mix Veg |

10 possible combinations from 7 items — built-in variety, zero extra cost.

### Pricing — The Only Rule
```
₹100 = 1 tiffin. Always. No hidden charges. No conditions.
Discounts come ONLY from validated PromoCode records.
Never hardcode any price other than 100 in the codebase.
```

### Plans
| Plan | Tiffins | Total |
|------|---------|-------|
| Weekly | 6 (Mon–Sat) | ₹600 |
| Monthly | 26 (Mon–Sat, ~1 month) | ₹2,600 |
| Pro-rated | remainingDeliveryDays × ₹100 | Calculated |

### Delivery Operations
| Subscriber Type | Delivery By |
|----------------|-------------|
| Weekly / Monthly | In-house riders |
| One-time orders | Third-party (Rapido / Dunzo) |

- **Delivery days:** Monday to Saturday
- **Sunday:** No operations — no orders, no deliveries
- **Time slots:** Fixed per delivery zone — no customer choice
- **Coverage:** Single city, defined delivery zones
- **Both lunch AND dinner** — same daily menu, different slots

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## MODULE 0 — MENU MANAGEMENT
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Schema

```prisma
MenuItem {
  id        String   @id
  name      String   // "Rajma", "Chole", "Kadahi Paneer" etc.
  category  String   // FIXED_GRAVY | PANEER | VEGETABLE
  isVeg     Boolean  @default(true)   // always true — hard enforced
  isActive  Boolean  @default(true)
  imageUrl  String?
  createdAt DateTime @default(now())
}

DailyMenu {
  id          String    @id
  date        DateTime  @unique
  item1Id     String               // Container 3
  item2Id     String               // Container 4
  saladNote   String?              // e.g. "Kachumber" or "Cucumber"
  status      String    @default("DRAFT")  // DRAFT | PUBLISHED
  publishedAt DateTime?
  publishedBy String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

**Seed MenuItem table once:**
```
FIXED_GRAVY: Rajma, Chole, Kadhi
PANEER:      Kadahi Paneer, Shahi Paneer, Matar Paneer
VEGETABLE:   Mix Veg, Seasonal Veg
```

### Menu Rules

**Admin workflow:** Pick 2 items → Save as draft → Publish before 10 PM. That's it.

**Validation:**
- `item1Id ≠ item2Id` — can't pick same item twice
- Both items must be `isActive = true`
- `isVeg` is always `true` — backend rejects `isVeg: false` at creation

**Publication deadline:** 10 PM IST
- 9:45 PM: alert admin if tomorrow's menu still DRAFT
- 10:30 PM: order generation runs regardless
  - Menu published → orders get `dailyMenuId`
  - Menu NOT published → orders get `dailyMenuId = null` + admin alert

**Customer visibility (Phase 1 — Launch):**
- Today's menu shown from 6 AM IST
- No advance view (keeps it simple, prevents swap requests)
- "Maa never asked what you wanted — she made what's best for you" 🙂

### Menu APIs
```
GET  /api/content/menu/today          → today's published menu (public)
POST /api/admin/menu                  → create DRAFT
PATCH /api/admin/menu/:id             → update draft
PATCH /api/admin/menu/:id/publish     → publish
GET  /api/admin/menu/unpublished      → dates with no published menu
GET  /api/admin/menu/items            → full item pool
POST /api/admin/menu/items            → add new item to pool
```

**Today's menu response:**
```json
{
  "data": {
    "date": "2026-03-10",
    "tiffin": {
      "container1": { "name": "Steamed Rice",    "qty": "1 bowl" },
      "container2": { "name": "Phulka Roti",     "qty": "4 pieces" },
      "container3": { "name": "Rajma",           "qty": "1 bowl" },
      "container4": { "name": "Kadahi Paneer",   "qty": "1 bowl" },
      "extras":     { "name": "Kachumber Salad", "qty": "1 pouch" }
    },
    "tag": "100% Pure Veg · Made Fresh · Zero Preservatives"
  }
}
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## MODULE 1 — SUBSCRIPTION LIFECYCLE
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### States
```
PENDING_PAYMENT → ACTIVE → PAUSED → ACTIVE
                         → EXPIRED
                         → CANCELLED
PENDING_COD     → ACTIVE (after first delivery + cash collected)
```

### Schema
```prisma
Subscription {
  id                  String   @id
  userId              String
  mealSlot            String   // "LUNCH" | "DINNER"
  planType            String   // "WEEKLY" | "MONTHLY" | "PRORATED"
  status              String
  startDate           DateTime
  endDate             DateTime
  totalTiffins        Int
  tiffinsDelivered    Int      @default(0)
  tiffinsRemaining    Int
  paused              Boolean  @default(false)
  pauseEffectiveFrom  DateTime?
  pausedTotalDays     Int      @default(0)
  paymentMethod       String   // "RAZORPAY" | "COD"
  autoRenew           Boolean  @default(false)
  securityDepositPaid Boolean  @default(false)
  securityDepositAmt  Int      @default(0)
  deliveryZoneId      String
  riderId             String?
  promoCodeApplied    String?
  discountAmount      Float    @default(0)
  cancelledAt         DateTime?
  cancelledBy         String?
  cancellationReason  String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

### Creation

**Validation:**
1. No existing `ACTIVE` / `PENDING_COD` for same `userId + mealSlot`
   - One LUNCH + one DINNER allowed simultaneously
   - Two LUNCH = blocked: "You already have an active Lunch subscription."
2. Pincode in active delivery zone
   - Else: "We don't deliver to your area yet. Join the waitlist!"
3. Plan must be `isActive: true`

**Start date:**
```
Before 10 PM IST → startDate = tomorrow (skip Sunday → Monday)
After 10 PM IST  → startDate = day after tomorrow (skip Sunday → Monday)
```

**End date:**
```
Count forward from startDate
Skip all Sundays + admin holidays
Stop when count = totalTiffins
endDate = last delivery date
```

**Pro-rated:**
```
Wednesday signup before 10 PM → starts Thursday
Remaining: Thu + Fri + Sat = 3 tiffins = ₹300
Next cycle: customer picks Weekly or Monthly
```

### Pause / Resume — 10 PM IST Rule

**Why 10 PM?** Kitchen prep starts 5 AM. Ingredients ordered, staff rostered the night before. After 10 PM, tomorrow's production is locked. Real operational constraint.

```
Before 10 PM → effective from TOMORROW
After 10 PM  → effective from DAY AFTER TOMORROW
If effective date = Sunday → push to MONDAY
```

**Pause:** Calculate `pauseEffectiveFrom` → cancel orders on/after that date → do NOT decrement `tiffinsRemaining` → set `paused = true, status = PAUSED`

**Resume:** Calculate `resumeEffectiveFrom` → count paused delivery days → extend `endDate` by that count → set `paused = false, status = ACTIVE`

**Edge cases:**
| Scenario | Behaviour |
|----------|-----------|
| Pause Saturday after 10 PM | Effective Tuesday (skip Sun → Mon) |
| Already paused | "Paused since {date}" — no-op |
| Already active on resume | "Subscription is active" — no-op |
| Pause + resume same day | Net zero — log only |
| 1 tiffin remaining | Allow pause — extend end by 1 day |
| Paused > 30 days | Auto-resume, notify customer |
| Expires while paused | Mark EXPIRED, flag `expiredWhilePaused = true` |
| Admin pause | Bypasses 10 PM — effective tomorrow always |

### Expiry

**Nightly job — `endDate < today AND status IN (ACTIVE, PAUSED)`:**
1. Set `status = EXPIRED`
2. Cancel future orders
3. If `securityDepositPaid AND tiffinsDelivered >= totalTiffins × 0.8` → refund record (PENDING)
4. If `tiffinsRemaining > 0` → flag for admin review (no auto-refund)
5. Notify customer

### Cancellation

**Policy (shown at signup):**
> "Cancel anytime. Refund = undelivered tiffins × ₹100. COD deposit refunded after 5 deliveries."

**Refund formula:**
```
refundAmount = tiffinsRemaining × 100
COD + tiffinsDelivered >= 5  → add ₹500 deposit
COD + tiffinsDelivered < 5   → deposit forfeited
Cancelled after 10 PM        → today's tiffin not refundable
```

**Steps:** Calculate refund → set CANCELLED → cancel future orders → create PENDING refund → notify admin + customer

### Auto-Renewal
- `autoRenew = true` → charge same plan via Razorpay mandate on expiry
- New subscription starts next delivery day, fresh record
- Payment fails → `autoRenew = false`, notify customer

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## MODULE 2 — PAYMENTS & REFUNDS
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Payment Matrix

| Customer | Method | Deposit | Checkout Amount |
|----------|--------|---------|----------------|
| Online subscriber | Razorpay | ❌ | tiffins × ₹100 |
| COD subscriber (new) | Cash | ✅ ₹500 on delivery | ₹0 at checkout |
| COD subscriber (returning) | Cash | ❌ | Plan price on delivery |
| One-time order | Razorpay only | ❌ | qty × ₹100 + delivery fee |

### Razorpay

```js
// Create order
const order = await razorpay.orders.create({
  amount: totalTiffins * 100 * 100,  // paise
  currency: "INR",
  receipt: `mkr_${userId}_${planType}_${Date.now()}`,
  notes: { userId, planType, mealSlot, type: "SUBSCRIPTION" }
});

// Webhook — ALWAYS verify signature first
const signature = crypto
  .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
  .update(JSON.stringify(req.body)).digest("hex");

if (signature !== req.headers["x-razorpay-signature"]) {
  return res.status(400).json({ success: false });
}

// Idempotency — prevent duplicate activation
const exists = await Payment.findOne({ razorpayPaymentId: paymentId });
if (exists) return res.status(200).json({ success: true });
```

**Reconciliation job (every 15 min):** Find `PENDING_PAYMENT` subscriptions older than 10 min → query Razorpay → activate if captured (handles missed webhooks).

### COD Flow

```
Checkout → PENDING_COD → admin notified

First delivery:
  Rider collects: ₹500 deposit + pro-rated amount
  Example: 3-day pro-rated = ₹500 + ₹300 = ₹800

Admin confirms → ACTIVE, securityDepositPaid = true

Future cycles: plan price only (no deposit)
```

**COD failures:**
| Scenario | Action |
|----------|--------|
| Not home — attempt 1 | Reschedule |
| Not home — attempt 2 | Cancel + notify |
| Refuses to pay | Cancel + COD blacklist |

### One-Time Orders

```
Price = quantity × ₹100
Delivery fee = actual Rapido/Dunzo quote (customer pays)
Shown at checkout: "₹{tiffinPrice} + ₹{deliveryFee} delivery"
Payment: Razorpay only
Dispatch: third-party only
```

### Bulk Orders (Admin Only)
```
POST /api/admin/orders/bulk
{ customerName, phone, quantity, amount, deliveryDate, address, notes }
No automation. Admin tracks manually. Rare use only.
```

### Refunds

```prisma
Refund {
  id               String
  subscriptionId   String?
  orderId          String?
  userId           String
  amount           Float
  reason           String  // CANCELLATION|DEPOSIT_RETURN|MISSED_DELIVERY|GOODWILL|DOUBLE_CHARGE
  status           String  // PENDING|APPROVED|REJECTED|PROCESSING|COMPLETED
  method           String  // RAZORPAY_REFUND|CASH|BANK_TRANSFER|TIFFIN_CREDIT
  razorpayRefundId String?
  approvedBy       String?
  approvedAt       DateTime?
  processedAt      DateTime?
  notes            String?
  createdAt        DateTime
}
```

| Scenario | Amount | Method | SLA |
|----------|--------|--------|-----|
| Cancellation | tiffinsRemaining × ₹100 | Original method | 5–7 days |
| Missed delivery | 1 tiffin credit (default) | Tiffin credit | Instant |
| Missed (cash request) | ₹100 | Razorpay | 5–7 days |
| COD deposit | ₹500 | Cash / bank transfer | 3–5 days |
| Double charge | Duplicate amount | Razorpay | 2–3 days |
| Goodwill | Admin-specified | Admin decides | 1–2 days |

**ALL refunds require admin approval. No automatic payouts. Ever.**

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## MODULE 3 — ORDER GENERATION & DELIVERY
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Daily Order Generation

**Cron: 10:30 PM IST** (after 10 PM pause cutoff is locked)

```js
async function generateDailyOrders(targetDate) {
  if (isSunday(targetDate)) return;           // Never on Sunday
  if (await isHoliday(targetDate)) return;    // Never on holidays

  const menu = await getDailyMenu(targetDate);
  if (!menu?.status === "PUBLISHED") alertAdmin(`⚠️ No menu for ${targetDate}`);

  const subscriptions = await prisma.subscription.findMany({
    where: {
      status: "ACTIVE",
      startDate: { lte: targetDate },
      endDate:   { gte: targetDate },
      OR: [
        { paused: false },
        { paused: true, pauseEffectiveFrom: { gt: targetDate } }
      ]
    }
  });

  for (const sub of subscriptions) {
    const exists = await prisma.order.findFirst({
      where: { subscriptionId: sub.id, date: targetDate }
    });
    if (exists) continue; // Idempotent

    await prisma.order.create({
      data: {
        subscriptionId: sub.id, userId: sub.userId,
        date: targetDate, mealSlot: sub.mealSlot,
        dailyMenuId: menu?.id ?? null,
        status: "PENDING", deliveryType: "IN_HOUSE",
        deliveryAddress: sub.user.primaryAddress.fullAddress,
        deliveryZoneId: sub.deliveryZoneId,
        paymentMethod: sub.paymentMethod,
      }
    });
  }
}
```

**Manual trigger:** `POST /api/admin/generate-orders { date, force: false }`

### Order State Machine

```
PENDING → ASSIGNED → OUT_FOR_DELIVERY → DELIVERED
                                      → FAILED → RESCHEDULED
```

| Transition | Side Effects |
|-----------|--------------|
| → ASSIGNED | `riderId` set |
| → OUT_FOR_DELIVERY | `pickedUpAt`, customer notified |
| → DELIVERED | `deliveredAt`, `tiffinsDelivered++`, `tiffinsRemaining--` |
| → FAILED | `tiffinsRemaining` unchanged, +1 credit added, customer notified |
| → RESCHEDULED | New order created for next delivery day |

**DELIVERED is irreversible.** Disputes via support ticket only.
**On `tiffinsRemaining === 0`:** trigger expiry flow immediately.

**Failed reasons:** NOT_HOME | WRONG_ADDRESS | REFUSED | FOOD_ISSUE | OTHER

### Dispatch Manifest

Admin generates ~9 PM: `POST /api/admin/manifests/generate { date }`

**Grouping:** Separate LUNCH and DINNER → group by zone → sort by pincode/street → assign one rider per zone per slot

**PDF export:** `GET /api/admin/manifests/:id/pdf` — print-ready for riders without smartphones

### One-Time Order Dispatch

```
Payment captured → deliveryType = THIRD_PARTY
    ↓
Call Rapido/Dunzo API { pickup: kitchen, drop: customer }
    ↓
Store trackingId + estimatedDelivery
    ↓
Customer gets tracking link via WhatsApp/SMS
    ↓
Third-party webhook updates order status
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## MODULE 4 — ADMIN CONTROLS
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Feature Flags

| Key | Default | Description |
|-----|---------|-------------|
| `ACCEPT_NEW_SUBSCRIPTIONS` | `true` | Master kill switch |
| `COD_ENABLED` | `true` | Toggle COD payment |
| `ONE_TIME_ORDERS_ENABLED` | `true` | Toggle one-time orders |
| `AUTO_RENEW_ENABLED` | `false` | Enable after mandate setup |
| `PAUSE_CUTOFF_TIME_IST` | `22:00` | The 10 PM rule |
| `MAX_PAUSE_DAYS` | `30` | Auto-resume threshold |
| `COD_DEPOSIT_AMOUNT` | `500` | Adjustable |
| `MENU_PUBLISH_DEADLINE_IST` | `21:45` | Alert time |
| `MENU_VISIBLE_FROM_HOUR_IST` | `6` | Show from 6 AM |
| `DELIVERY_DAYS` | `[1,2,3,4,5,6]` | Mon–Sat |

### Admin Overrides (All require `adminNote`)

| Action | Endpoint |
|--------|----------|
| Force-activate subscription | `POST /api/admin/subscriptions/:id/force-activate` |
| Add tiffin credits | `PATCH /api/admin/subscriptions/:id/add-credits` |
| Extend subscription | `PATCH /api/admin/subscriptions/:id/extend` |
| Manual refund | `POST /api/admin/refunds` |
| COD blacklist | `PATCH /api/admin/users/:id/cod-blacklist` |
| Assign/reassign rider | `PATCH /api/admin/orders/:id/assign-rider` |
| Publish menu | `PATCH /api/admin/menu/:id/publish` |
| Create bulk order | `POST /api/admin/orders/bulk` |
| Mark holiday | `POST /api/admin/holidays` |
| Force-pause subscription | `PATCH /api/admin/subscriptions/:id/pause` |

### Audit Log (Append-Only — Never Delete)

```prisma
AuditLog {
  id         String   @id
  adminId    String
  action     String
  targetType String
  targetId   String
  before     Json?
  after      Json?
  reason     String?
  ipAddress  String?
  createdAt  DateTime @default(now())
}
```

### Dashboard Analytics

```json
{
  "today": {
    "ordersGenerated": 52, "ordersDelivered": 47, "ordersFailed": 2,
    "lunchOrders": 28, "dinnerOrders": 24,
    "menuPublished": true, "codCashCollected": 4600, "oneTimeOrders": 5
  },
  "thisMonth": {
    "newSubscriptions": 31, "cancelledSubscriptions": 3,
    "churnRate": "9.7%", "grossRevenue": 89400,
    "refundsIssued": 2100, "netRevenue": 87300,
    "activeSubscriptions": 94, "avgRevenuePerUser": 950
  },
  "alerts": [
    { "type": "MENU_NOT_PUBLISHED", "priority": "CRITICAL" },
    { "type": "COD_UNCONFIRMED",    "count": 4, "priority": "HIGH" },
    { "type": "REFUND_PENDING",     "count": 2, "priority": "HIGH" },
    { "type": "EXPIRING_THIS_WEEK", "count": 11,"priority": "MEDIUM" },
    { "type": "FAILED_DELIVERIES",  "count": 2, "priority": "MEDIUM" }
  ]
}
```

### Holiday Management

- Admin adds holidays ≥ 48 hours in advance
- No orders generated on holidays (hard block)
- All active subscriptions auto-extended by 1 delivery day
- Customer notified 2 days before: "🎉 No delivery on {date} — {name}. Plan extended by 1 day!"

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 10 RULES — NEVER VIOLATE
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```
1.  ₹100 = 1 tiffin. The only price in the system.
    Discounts come from validated PromoCode only. Never hardcode anything else.

2.  NEVER decrement tiffinsRemaining for FAILED deliveries.
    Customer didn't receive food. They are owed that tiffin.

3.  NEVER generate orders on Sunday or admin-marked holidays.
    Check BOTH conditions before every generation run.

4.  NEVER process a Razorpay webhook without signature verification.
    A forged webhook could fraudulently activate subscriptions.

5.  NEVER charge a security deposit to a prepaid (Razorpay) customer.
    Deposit is COD-only. Enforce at payment creation — not just in UI.

6.  NEVER auto-refund without admin approval.
    Always create a PENDING record. Human eyes on every payout.

7.  NEVER allow two ACTIVE subscriptions for same userId + mealSlot.
    One lunch per person. One dinner per person. Hard DB constraint.

8.  NEVER delete from AuditLog. It is append-only. Forever.

9.  ALWAYS recalculate endDate after every pause/resume/holiday/extension.
    Never use a stale or original endDate after any modification.

10. ALWAYS use IST (UTC+5:30) for ALL time-based business rules.
    The 10 PM cutoff, cron jobs, menu deadlines — always IST.
    Never use UTC or server local time for business logic.
```

---

## 🧮 IMPLEMENTATION ORDER

```
Step 1:  Prisma migration — DailyMenu, MenuItem, mealSlot,
         tiffinsDelivered, tiffinsRemaining, COD fields, AuditLog, Holiday

Step 2:  Seed MenuItem — Rajma, Chole, Kadhi, Kadahi Paneer,
         Shahi Paneer, Matar Paneer, Mix Veg, Seasonal Veg

Step 3:  src/utils/timeUtils.js — ALL date/time logic in ONE file:
         toIST(), isAfterCutoff(), getEffectiveDate()
         getNextDeliveryDate(), addDeliveryDays(), countDeliveryDays()
         isHoliday(), isSunday(), calculateEndDate(), calculateProRatedTiffins()

Step 4:  AppSettings service — in-memory cache, 5-min TTL

Step 5:  Menu service — CRUD, publish, admin alerts, today's API

Step 6:  Auth service — Google + OTP + JWT + refresh

Step 7:  Subscription service — full lifecycle

Step 8:  Payment service — Razorpay + COD + Refund + Reconciliation job

Step 9:  Order generation service + cron at 10:30 PM IST

Step 10: Delivery state machine + rider assignment + manifest + PDF

Step 11: One-time order service + Rapido/Dunzo dispatch

Step 12: Admin overrides + AuditLog middleware

Step 13: Analytics endpoint + dashboard alerts

Step 14: Holiday management + auto-notifications
```

---

## 🔭 FUTURE EXPANSION (Schema Ready — Not Yet Active)

```prisma
// Add to Subscription now — activate later
promoCodeApplied  String?
discountAmount    Float    @default(0)
mealPreference    String?  // JAIN | LOW_SPICE | NO_ONION_GARLIC
kitchenId         String?  // multi-kitchen expansion

// New tables — schema now, build later
PromoCode     { code, discountType, discountValue, maxUses, expiresAt }
ReferralCode  { code, ownerId, discountPercent, usageCount }
Notification  { userId, type, message, read, channel, sentAt }
WaitlistEntry { phone, email, pincode, createdAt }
MenuWeekPlan  { weekStartDate, mon, tue, wed, thu, fri, sat }
PremiumTiffin { extraItem, additionalPrice }
```

---

*Every rule maps to a real operational decision.
Every edge case maps to a real customer scenario.
This is not a demo. This is Maa Ki Rasoi. 🍛*
