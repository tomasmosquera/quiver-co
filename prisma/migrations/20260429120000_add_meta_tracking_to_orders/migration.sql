ALTER TABLE "orders"
ADD COLUMN "metaConsentGranted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "metaEventSourceUrl" TEXT,
ADD COLUMN "metaFbp" TEXT,
ADD COLUMN "metaFbc" TEXT,
ADD COLUMN "metaClientUserAgent" TEXT,
ADD COLUMN "metaClientIpAddress" TEXT;
