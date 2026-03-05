-- Migration: add_pause_meals_updatedAt
-- Safely adds new columns to existing tables without data loss
-- Date: 2026-03-05

-- Customer: add tokenVersion and updatedAt
ALTER TABLE "Customer"
  ADD COLUMN IF NOT EXISTS "tokenVersion" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();

-- Subscription: add paused, pausedAt, mealsRemaining, updatedAt
ALTER TABLE "Subscription"
  ADD COLUMN IF NOT EXISTS "paused" BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS "pausedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "mealsRemaining" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();

-- SubscriptionDelivery: add updatedAt
ALTER TABLE "SubscriptionDelivery"
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();

-- Create a trigger to keep updatedAt current on Customer
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ BEGIN
  CREATE TRIGGER set_customer_updated_at
    BEFORE UPDATE ON "Customer"
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER set_subscription_updated_at
    BEFORE UPDATE ON "Subscription"
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER set_delivery_updated_at
    BEFORE UPDATE ON "SubscriptionDelivery"
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
