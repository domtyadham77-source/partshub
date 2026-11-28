-- Stable internal merchant routing code and immutable pickup snapshots for logistics.
ALTER TABLE merchant_profiles ADD COLUMN merchant_code TEXT;
UPDATE merchant_profiles SET merchant_code='PHM-'||upper(substr(replace(id,'-',''),1,10)) WHERE merchant_code IS NULL OR merchant_code='';
CREATE UNIQUE INDEX IF NOT EXISTS idx_merchant_profiles_code ON merchant_profiles(merchant_code);
ALTER TABLE orders ADD COLUMN merchant_code_snapshot TEXT NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN merchant_pickup_address_snapshot TEXT NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN merchant_pickup_city_snapshot TEXT NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN merchant_pickup_area_snapshot TEXT NOT NULL DEFAULT '';

-- Structured vehicle and engine catalog. Product fitment records are separate from seller listings.
CREATE TABLE IF NOT EXISTS vehicle_makes (
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL UNIQUE,
 market_scope TEXT NOT NULL DEFAULT 'global',
 source_url TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS vehicle_models (
 id TEXT PRIMARY KEY,
 make_id TEXT NOT NULL REFERENCES vehicle_makes(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 generation TEXT NOT NULL DEFAULT '',
 year_from INTEGER NOT NULL,
 year_to INTEGER NOT NULL,
 market_scope TEXT NOT NULL DEFAULT 'global',
 UNIQUE(make_id,name,generation,market_scope),
 CHECK(year_from<=year_to)
);
CREATE TABLE IF NOT EXISTS vehicle_engine_variants (
 id TEXT PRIMARY KEY,
 model_id TEXT NOT NULL REFERENCES vehicle_models(id) ON DELETE CASCADE,
 label TEXT NOT NULL,
 engine_cc INTEGER NOT NULL CHECK(engine_cc>0),
 engine_code TEXT,
 fuel_type TEXT NOT NULL DEFAULT '',
 transmission TEXT NOT NULL DEFAULT '',
 year_from INTEGER NOT NULL,
 year_to INTEGER NOT NULL,
 market_scope TEXT NOT NULL DEFAULT 'global',
 source_title TEXT NOT NULL,
 source_url TEXT NOT NULL,
 CHECK(year_from<=year_to)
);
CREATE TABLE IF NOT EXISTS product_fitments (
 id TEXT PRIMARY KEY,
 product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
 engine_variant_id TEXT NOT NULL REFERENCES vehicle_engine_variants(id),
 year_from INTEGER,
 year_to INTEGER,
 trim TEXT NOT NULL DEFAULT '',
 part_number TEXT NOT NULL DEFAULT '',
 verification_status TEXT NOT NULL DEFAULT 'needs_confirmation' CHECK(verification_status IN ('verified','needs_confirmation')),
 source_url TEXT NOT NULL DEFAULT '',
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 CHECK(year_from IS NULL OR year_to IS NULL OR year_from<=year_to),
 UNIQUE(product_id,engine_variant_id,year_from,year_to,trim)
);
CREATE INDEX IF NOT EXISTS idx_vehicle_models_make ON vehicle_models(make_id,name);
CREATE INDEX IF NOT EXISTS idx_vehicle_engines_model_year ON vehicle_engine_variants(model_id,year_from,year_to,engine_cc);
CREATE INDEX IF NOT EXISTS idx_product_fitments_product ON product_fitments(product_id,verification_status);
CREATE INDEX IF NOT EXISTS idx_product_fitments_engine ON product_fitments(engine_variant_id,verification_status);

INSERT OR IGNORE INTO vehicle_makes(id,name,market_scope,source_url) VALUES
 ('make-chevrolet','Chevrolet','egypt','https://www.chevroletarabia.com/content/dam/chevrolet/middle-east/egypt/english/index/cars/2019-aveo/mov/02-pdfs/aveo.pdf'),
 ('make-hyundai','Hyundai','egypt','https://hyundai-egypt.net/wp-content/uploads/2024/08/Elantra-AD-Brochure_updated.pdf'),
 ('make-mercedes-benz','Mercedes-Benz','global','https://group.mercedes-benz.com/documents/sustainability/product/daimler-environmental-certificate-mb-c-class.pdf');
INSERT OR IGNORE INTO vehicle_models(id,make_id,name,generation,year_from,year_to,market_scope) VALUES
 ('model-chevrolet-aveo-2019','make-chevrolet','Aveo','Egypt brochure model 2019',2018,2020,'egypt'),
 ('model-hyundai-elantra-ad','make-hyundai','Elantra','AD · brochure variants 2024–2026',2024,2026,'egypt'),
 ('model-mercedes-c180-w205-2015','make-mercedes-benz','C-Class C180','W205 · 2015 model year',2015,2015,'global');
INSERT OR IGNORE INTO vehicle_engine_variants(id,model_id,label,engine_cc,engine_code,fuel_type,transmission,year_from,year_to,market_scope,source_title,source_url) VALUES
 ('engine-aveo-1498-mt','model-chevrolet-aveo-2019','1.5L petrol · 1498 cc',1498,NULL,'Petrol','Manual 5-speed',2018,2020,'egypt','Chevrolet Egypt / Middle East official Aveo 2019 brochure','https://www.chevroletarabia.com/content/dam/chevrolet/middle-east/egypt/english/index/cars/2019-aveo/mov/02-pdfs/aveo.pdf'),
 ('engine-aveo-1498-at','model-chevrolet-aveo-2019','1.5L petrol · 1498 cc',1498,NULL,'Petrol','Automatic 4-speed',2018,2020,'egypt','Chevrolet Egypt / Middle East official Aveo 2019 brochure','https://www.chevroletarabia.com/content/dam/chevrolet/middle-east/egypt/english/index/cars/2019-aveo/mov/02-pdfs/aveo.pdf'),
 ('engine-elantra-ad-1600','model-hyundai-elantra-ad','1.6 MPI petrol · 1600 cc nominal',1600,NULL,'Petrol','Automatic 6-speed',2024,2026,'egypt','Hyundai Egypt Elantra AD brochure; 2026 Egyptian listing spec','https://hyundai-egypt.net/wp-content/uploads/2024/08/Elantra-AD-Brochure_updated.pdf'),
 ('engine-mercedes-c180-1595','model-mercedes-c180-w205-2015','1.595L petrol · 1595 cc',1595,NULL,'Petrol','Market-specific; verify',2015,2015,'global','Mercedes-Benz C-Class technical environmental certificate; confirm import-market variant','https://group.mercedes-benz.com/documents/sustainability/product/daimler-environmental-certificate-mb-c-class.pdf');

-- Upgrade product gallery from one image per listing to an ordered multi-image gallery.
ALTER TABLE product_images RENAME TO product_images_single;
CREATE TABLE product_images (
 id TEXT PRIMARY KEY,
 product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
 content_type TEXT NOT NULL CHECK(content_type IN ('image/jpeg','image/png','image/webp')),
 byte_size INTEGER NOT NULL CHECK(byte_size>0 AND byte_size<=1000000),
 image_data BLOB NOT NULL,
 sort_order INTEGER NOT NULL DEFAULT 0,
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
INSERT INTO product_images(id,product_id,content_type,byte_size,image_data,sort_order,created_at)
 SELECT id,product_id,content_type,byte_size,image_data,0,created_at FROM product_images_single;
DROP TABLE product_images_single;
CREATE INDEX IF NOT EXISTS idx_product_images_product_order ON product_images(product_id,sort_order);
