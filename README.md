# Maa Ki Rasoi - MVP

A production-ready MVP for a home-style meal ordering platform strictly aligned with a 7-day launch goal. It features a lean Supabase + Express + React stack. 

## Features
- **Frontend**: React (Vite), Mobile-first simple UI.
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL (via Supabase).
- **Customers**: Browse menu, Add to cart, Place Order (Cash on Delivery). No login required.
- **Admin**: View and update order statuses, manage menu items, check today's revenue. Password protected via JWT.

## Setup Instructions for Local Development

1. Clone or clone the repository to your local machine.
2. Set up a Supabase project and get the `DATABASE_URL` and `DIRECT_URL`.
3. Inside the root directory (Backend):
   ```bash
   cp .env.example .env
   # Edit .env and enter your PostgreSQL URLs and a random JWT_SECRET.
   npm install
   npx prisma generate
   npx prisma db push
   
   # Start the backend server
   npm run dev
   ```

4. Inside the `frontend` directory:
   ```bash
   cd frontend
   cp .env.example .env
   # Edit VITE_API_URL to point to http://localhost:5000 during local dev
   npm install
   npm run dev
   ```
   
5. Initial Admin setup:
   - Use Postman or CURL to make a `POST` request to `http://localhost:5000/auth/setup` with JSON:
     ```json
     {
       "username": "admin",
       "password": "yourpassword"
     }
     ```
   - *Note: Only one admin user can be created via this route for security purposes. Any future admins must be manually added to the DB.*

## Deployment Steps

This project is built to be deployed seamlessly on modern PaaS providers.

### 1. Database (Supabase)
- Go to [Supabase](https://supabase.com). Create a new Project.
- From Project Settings -> Database, copy the connection string.
  - Transaction Pooler (Port 6543) will be your `DATABASE_URL`.
  - Session Pooler (Port 5432) will be your `DIRECT_URL`.
- Keep these ready. You don't need to manually create tables; Prisma will do it during the backend deployment.

### 2. Backend (Render / Railway)
- Push the repository to GitHub.
- Go to [Render](https://render.com) and create a "New Web Service".
- Connect the GitHub repository.
- Root Directory: Leave empty or `/`
- Build Command: `npm install && npx prisma generate && npx prisma db push`
- Start Command: `npm start`
- Environment Variables:
  - `DATABASE_URL` (From Supabase Transaction Pooler)
  - `DIRECT_URL` (From Supabase Session Pooler)
  - `JWT_SECRET` (Generate a secure random string)
  - `PORT` = `5000`
  - `NODE_ENV` = `production`
  - `CORS_ORIGIN` = `https://your-frontend.vercel.app` (Once Vercel is deployed)
- Deploy your backend and note down the Render URL (e.g., `https://maakirasoi-api.onrender.com`).

### 3. Frontend (Vercel)
- Go to [Vercel](https://vercel.com) and create a New Project.
- Import the same GitHub repository.
- Under Framework Preset, select **Vite** (or React).
- Edit the Root Directory to `frontend`.
- In the Environment Variables section, add:
  - `VITE_API_URL` = (Your Backend Render URL from Step 2)
- Click Deploy.
- Vercel will automatically read the `vercel.json` provided so React Router works correctly.

Congratulations! Your MVP is live and ready to take orders. 🚀
