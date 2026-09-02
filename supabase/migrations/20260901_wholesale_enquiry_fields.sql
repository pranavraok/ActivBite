ALTER TABLE wholesale_enquiries
  ADD COLUMN IF NOT EXISTS shop_type VARCHAR(100),
  ADD COLUMN IF NOT EXISTS location VARCHAR(255),
  ADD COLUMN IF NOT EXISTS preferred_pack VARCHAR(100),
  ADD COLUMN IF NOT EXISTS source VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_wholesale_enquiries_created_at
  ON wholesale_enquiries (created_at DESC);
