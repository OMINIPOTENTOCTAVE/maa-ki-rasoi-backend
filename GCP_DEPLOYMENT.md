# 🌩️ MAA KI RASOI — Google Cloud Deployment Guide
**Region:** `asia-south1` (Mumbai) | **Last Updated:** 2026-02-25

## Architecture
```
Firebase Hosting          Cloud Run (Mumbai)      Supabase
┌─────────────┐           ┌──────────────────┐    ┌──────────┐
│ Customer PWA├──────────▶│                  │    │          │
│ Admin Panel ├──────────▶│  Node.js API     ├───▶│ Postgres │
│ Delivery App├──────────▶│  (Docker)        │    │          │
└─────────────┘           └──────────────────┘    └──────────┘
       ▲                          ▲
  CDN (Indian POPs)        Artifact Registry
                           (Docker images)
```

---

## One-Time Setup

### Prerequisites
- [ ] [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) installed
- [ ] [Firebase CLI](https://firebase.google.com/docs/cli) installed (`npm i -g firebase-tools`)
- [ ] GCP project created at console.cloud.google.com
- [ ] Billing enabled on the project

### Step 1 — Run the setup script
```bash
# Set your environment variables first
export DATABASE_URL="postgresql://..."
export DIRECT_URL="postgresql://..."
export JWT_SECRET="your-production-jwt-secret"
export FAST2SMS_API_KEY="your-key"
export RAZORPAY_KEY_ID="rzp_live_..."
export RAZORPAY_KEY_SECRET="your-secret"

# Run the setup (replace YOUR_PROJECT_ID)
chmod +x gcp-setup.sh
./gcp-setup.sh YOUR_PROJECT_ID
```

This will:
- Enable all required Google Cloud APIs
- Create the Docker image repository in Artifact Registry
- Store all secrets securely in Secret Manager
- Grant Cloud Build the correct permissions
- Wire up automatic deployment on every `git push` to `main`

### Step 2 — Initialize Firebase for each app
```bash
# Do this once per app. Choose "Hosting: Configure files for Firebase Hosting"
cd apps/customer && firebase init hosting --project YOUR_PROJECT_ID
cd apps/admin    && firebase init hosting --project YOUR_PROJECT_ID
cd apps/delivery && firebase init hosting --project YOUR_PROJECT_ID
```
> When asked:
> - **Public directory:** `dist`
> - **Single-page app:** `Yes`
> - **Overwrite index.html:** `No`

### Step 3 — Trigger first deployment
```bash
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=_PROJECT_ID=YOUR_PROJECT_ID,_REGION=asia-south1,_SERVICE=maa-ki-rasoi-api,_REPO=maa-ki-rasoi
```

---

## Auto-Deployments (After Setup)

Every `git push origin main` automatically:
1. Builds a new Docker image
2. Deploys backend to Cloud Run
3. Builds all 3 frontend apps
4. Deploys them to Firebase Hosting

```bash
# Just push — everything deploys automatically
git push origin main
```

---

## Updating Secrets

```bash
# Example: Update Razorpay key
echo -n "rzp_live_newkey" | gcloud secrets versions add RAZORPAY_KEY_ID --data-file=-

# Then redeploy Cloud Run to pick up the new secret
gcloud run deploy maa-ki-rasoi-api --region=asia-south1 --image=LATEST_IMAGE_URL
```

---

## Monitoring & Logs

```bash
# Stream live API logs
gcloud run services logs tail maa-ki-rasoi-api --region=asia-south1

# View recent errors
gcloud logging read "resource.type=cloud_run_revision AND severity=ERROR" --limit=50
```

---

## Cost Estimate (INR)

| Service | Free Tier | ~Monthly at 100 users/day |
|---|---|---|
| Cloud Run | 2M requests free | ₹0–50 |
| Artifact Registry | 0.5 GB free | ₹0 |
| Firebase Hosting | 10 GB free | ₹0 |
| Secret Manager | 6 secrets free | ₹0 |
| **Total** | | **₹0–50/month** |

> Note: Set `min-instances=0` to stay on free tier (will have cold starts). Set `min-instances=1` (~₹400/month) for instant responses.

---

## Rollback

```bash
# List recent revisions
gcloud run revisions list --service=maa-ki-rasoi-api --region=asia-south1

# Roll back to a previous revision
gcloud run services update-traffic maa-ki-rasoi-api \
  --region=asia-south1 \
  --to-revisions=maa-ki-rasoi-api-00042-abc=100
```
