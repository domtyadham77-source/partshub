ALTER TABLE merchant_profiles ADD COLUMN business_type TEXT NOT NULL DEFAULT 'parts_store' CHECK(business_type IN ('parts_store','garage','maintenance_center','motorcycle_workshop'));
ALTER TABLE merchant_profiles ADD COLUMN city TEXT NOT NULL DEFAULT '';
ALTER TABLE merchant_profiles ADD COLUMN area TEXT NOT NULL DEFAULT '';
ALTER TABLE merchant_profiles ADD COLUMN address_line TEXT NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS idx_merchants_directory ON merchant_profiles(status,business_type,city);
