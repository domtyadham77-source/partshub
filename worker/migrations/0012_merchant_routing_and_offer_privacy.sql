-- Stable internal merchant routing code and immutable pickup snapshots for logistics.
ALTER TABLE merchant_profiles ADD COLUMN merchant_code TEXT;
UPDATE merchant_profiles SET merchant_code='PHM-'||upper(substr(replace(id,'-',''),1,10)) WHERE merchant_code IS NULL OR merchant_code='';
CREATE UNIQUE INDEX IF NOT EXISTS idx_merchant_profiles_code ON merchant_profiles(merchant_code);
ALTER TABLE orders ADD COLUMN merchant_code_snapshot TEXT NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN merchant_pickup_address_snapshot TEXT NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN merchant_pickup_city_snapshot TEXT NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN merchant_pickup_area_snapshot TEXT NOT NULL DEFAULT '';
