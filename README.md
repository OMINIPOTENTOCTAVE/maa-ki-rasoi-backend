# 🍛 Maa Ki Rasoi (MKR) PWA v4.0

**Premium Home-Style Meal Subscription Platform**

Maa Ki Rasoi (MKR) is a state-of-the-art, mobile-first PWA designed to deliver healthy, "ghar jaisa khana" (home-cooked food) through a seamless hybrid model (Subscription + One-Time Orders). Built with a focus on consistency, premium aesthetics, and operational efficiency.

[![Live Demo](https://img.shields.io/badge/Status-Live--On--Cloud-success?style=for-the-badge)](https://maakirasoi-customer-2026.web.app)
[![Design](https://img.shields.io/badge/UI--UX-Premium--Refactor--v3.0-orange?style=for-the-badge)](#)

---

## ✨ Key Features

### 🍱 For Customers (PWA)
- **Secure Razorpay Checkout**: Fully integrated online payments for all plans and one-time orders.
- **3-Tier Subscriptions**: Flexible plans to suit every need:
    - **Basic (₹1,999)**: 1 Meal/Day (Lunch or Dinner)
    - **Standard (₹3,499)**: 2 Meals/Day (Lunch + Dinner)
    - **Premium (₹5,999)**: 3 Meals/Day (Breakfast + Lunch + Dinner)
- **10 PM IST Cutoff**: Smart subscription logic. Subscribe before 10 PM to start tomorrow; else, start the day after.
- **Pure Veg Guarantee**: 100% vegetarian meals curated from local home-kitchen networks.
- **In-App Payment History**: Tracking for all successful and failed transactions.

### 🛠 For Operations (Admin & Delivery)
- **Revenue Dashboard**: Real-time tracking of Today's and Month-to-date Subscription + Instant Order revenue.
- **Payment Operations**: Detailed transaction logs with Razorpay ID mapping and failure alerts (< 24hr).
- **Dispatch Manifests**: Automated rider route optimization via address-clustered manifests.
- **Subscription Engine**: Automated daily order generation from active subscription pools.
- **Granular Logging**: Detailed system-level logs for audit-ready transaction tracking.

---

## 🎨 Design System (v3.0)

The application features a custom-built design system focused on "Warmth and Trust":
- **Palette**: `Brand Saffron` (#C8550A), `Antique Cream` (#F8F7F5), and `Kitchen Brown` (#2D2418).
- **Typography**: `Fraunces` (Headings) & `DM Sans` (Body).
- **Glassmorphism**: Subtle backdrop blurs and floating navigation for a premium mobile feel.
- **Micro-animations**: Smooth layout transitions and skeleton loading states.

---

## 🏗 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Core** | Node.js (Express 5), React 18 (Vite) |
| **Styling** | Vanilla CSS + Tailwind (Custom Tokens) |
| **Database** | PostgreSQL + Prisma ORM |
| **Payments** | Razorpay (HMAC SHA256 Secure Verification) |
| **Auth** | JWT + Firebase Auth (Google & Phone OTP) |
| **Infra** | Google Cloud Run (API), Firebase Hosting (Frontends), Cloud SQL (DB) |

---

## 📂 Project Structure

```bash
maakirasoi/
├── src/                  # Backend API (Standard SOP Compliant)
│   ├── modules/          # Route & Controller logic (Payment, Sub, Order, Analytics)
│   ├── middleware/        # Auth & Admin protection
│   └── prisma.js          # Shared Prisma client instance
├── apps/
│   ├── customer/         # Premium PWA (Razorpay Integrated)
│   ├── admin/            # Operational Dashboard (Revenue & Audit)
│   └── delivery/         # Rider Management App
└── prisma/               # Database Schema (Payment & Audit Logs)
```

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
git clone https://github.com/OMINIPOTENTOCTAVE/maa-ki-rasoi-backend.git
npm install
npx prisma generate
npx prisma db push
npm run dev # http://localhost:5000
```

### 2. Apps Setup (Customer PWA)
```bash
cd apps/customer
npm install
npm run dev # http://localhost:5173
```

---

## 🌐 Live Deployment

The platform is fully operational on Google Cloud Platform:
- 🥘 **[Customer PWA](https://maakirasoi-customer-2026.web.app)** - Order and manage subscriptions.
- 👨‍🍳 **[Admin Dashboard](https://maakirasoi-admin-2026.web.app)** - Operational control and analytics.
- 📦 **[Delivery Partner](https://maakirasoi-delivery-2026.web.app)** - Rider tracking and dispatch.
- 🔌 **[Backend API](https://maakirasoi-api-213402009735.asia-south1.run.app)** - Secure Cloud Run endpoint.

---

## 📱 Download APKs

Direct access to the latest mobile builds:
- [⬇️ Customer App](https://github.com/OMINIPOTENTOCTAVE/maa-ki-rasoi-backend/raw/main/apks/MaaKiRasoi-Customer.apk)
- [⬇️ Delivery Partner](https://github.com/OMINIPOTENTOCTAVE/maa-ki-rasoi-backend/raw/main/apks/MaaKiRasoi-Delivery.apk)
- [⬇️ Admin Console](https://github.com/OMINIPOTENTOCTAVE/maa-ki-rasoi-backend/raw/main/apks/MaaKiRasoi-Admin.apk)

---

## 📜 License
ISC © 2026 Maa Ki Rasoi.
