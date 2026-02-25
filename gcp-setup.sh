#!/bin/bash
# ── Maa Ki Rasoi — Google Cloud One-Time Setup Script ─────────────────────
# Run this ONCE to set up the GCP project before the first deployment.
# Usage: chmod +x gcp-setup.sh && ./gcp-setup.sh YOUR_PROJECT_ID

set -e

PROJECT_ID=${1:-"maa-ki-rasoi"}
REGION="asia-south1"   # Mumbai
SERVICE="maa-ki-rasoi-api"
REPO="maa-ki-rasoi"

echo "🚀 Setting up Google Cloud for Maa Ki Rasoi..."
echo "   Project: $PROJECT_ID | Region: $REGION"

# 1. Set active project
gcloud config set project $PROJECT_ID

# 2. Enable required APIs
echo "⚙️  Enabling APIs..."
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  firebase.googleapis.com

# 3. Create Artifact Registry repo for Docker images
echo "📦 Creating Artifact Registry..."
gcloud artifacts repositories create $REPO \
  --repository-format=docker \
  --location=$REGION \
  --description="Maa Ki Rasoi Docker images" 2>/dev/null || echo "   (repo already exists)"

# 4. Store secrets in Secret Manager
echo "🔐 Storing secrets..."
echo -n "$DATABASE_URL"     | gcloud secrets create DATABASE_URL     --data-file=- 2>/dev/null || gcloud secrets versions add DATABASE_URL     --data-file=<(echo -n "$DATABASE_URL")
echo -n "$DIRECT_URL"       | gcloud secrets create DIRECT_URL       --data-file=- 2>/dev/null || gcloud secrets versions add DIRECT_URL       --data-file=<(echo -n "$DIRECT_URL")
echo -n "$JWT_SECRET"       | gcloud secrets create JWT_SECRET       --data-file=- 2>/dev/null || gcloud secrets versions add JWT_SECRET       --data-file=<(echo -n "$JWT_SECRET")
echo -n "$FAST2SMS_API_KEY" | gcloud secrets create FAST2SMS_API_KEY --data-file=- 2>/dev/null || gcloud secrets versions add FAST2SMS_API_KEY --data-file=<(echo -n "$FAST2SMS_API_KEY")
echo -n "$RAZORPAY_KEY_ID"  | gcloud secrets create RAZORPAY_KEY_ID  --data-file=- 2>/dev/null || gcloud secrets versions add RAZORPAY_KEY_ID  --data-file=<(echo -n "$RAZORPAY_KEY_ID")
echo -n "$RAZORPAY_KEY_SECRET" | gcloud secrets create RAZORPAY_KEY_SECRET --data-file=- 2>/dev/null || gcloud secrets versions add RAZORPAY_KEY_SECRET --data-file=<(echo -n "$RAZORPAY_KEY_SECRET")

# Firebase Hosting URLs will be set after first firebase deploy
CORS="https://maa-ki-rasoi-customer.web.app,https://maa-ki-rasoi-admin.web.app,https://maa-ki-rasoi-delivery.web.app"
echo -n "$CORS" | gcloud secrets create CORS_ORIGIN --data-file=- 2>/dev/null || gcloud secrets versions add CORS_ORIGIN --data-file=<(echo -n "$CORS")

# Firebase CI token (needed for Cloud Build to deploy Firebase)
echo ""
echo "🔑 Generating Firebase CI token..."
echo "   You will be redirected to sign in with Google."
FIREBASE_TOKEN=$(npx firebase-tools login:ci 2>/dev/null | tail -1)
echo -n "$FIREBASE_TOKEN" | gcloud secrets create FIREBASE_TOKEN --data-file=- 2>/dev/null || gcloud secrets versions add FIREBASE_TOKEN --data-file=<(echo -n "$FIREBASE_TOKEN")

# 5. Grant Cloud Build permission to access secrets + deploy Cloud Run
echo "🔐 Granting IAM permissions..."
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
CB_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$CB_SA" --role="roles/run.admin"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$CB_SA" --role="roles/secretmanager.secretAccessor"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$CB_SA" --role="roles/artifactregistry.writer"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$CB_SA" --role="roles/iam.serviceAccountUser"

# 6. Connect GitHub repo + create Cloud Build trigger
echo "🔗 Creating Cloud Build trigger (push to main)..."
gcloud builds triggers create github \
  --repo-name="maa-ki-rasoi-backend" \
  --repo-owner="OMINIPOTENTOCTAVE" \
  --branch-pattern="^main$" \
  --build-config="cloudbuild.yaml" \
  --name="deploy-on-push-to-main" \
  --substitutions="_REGION=$REGION,_SERVICE=$SERVICE,_REPO=$REPO" \
  2>/dev/null || echo "   (trigger already exists)"

echo ""
echo "✅ Setup complete! Future pushes to 'main' will auto-deploy everything."
echo ""
echo "📋 Next Steps:"
echo "   1. Initialize Firebase in each app directory:"
echo "      cd apps/customer && firebase init hosting"
echo "      cd apps/admin    && firebase init hosting"
echo "      cd apps/delivery && firebase init hosting"
echo ""
echo "   2. Trigger first manual deploy:"
echo "      gcloud builds submit --config=cloudbuild.yaml --substitutions=_PROJECT_ID=$PROJECT_ID,_REGION=$REGION,_SERVICE=$SERVICE,_REPO=$REPO"
