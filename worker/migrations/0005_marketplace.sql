CREATE TABLE IF NOT EXISTS merchant_profiles (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
 store_name TEXT NOT NULL,
 description TEXT NOT NULL DEFAULT '',
 contact_phone TEXT,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','active','rejected','suspended')),
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE IF NOT EXISTS products (
 id TEXT PRIMARY KEY,
 merchant_id TEXT NOT NULL REFERENCES merchant_profiles(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 category TEXT NOT NULL CHECK(category IN ('car_parts','motorcycle_parts','workshop')),
 fitment TEXT NOT NULL DEFAULT '',
 sku TEXT,
 description TEXT NOT NULL DEFAULT '',
 price_piasters INTEGER NOT NULL CHECK(price_piasters > 0),
 stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK(stock_quantity >= 0),
 status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','active','archived')),
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_merchant_profiles_status ON merchant_profiles(status);
CREATE INDEX IF NOT EXISTS idx_products_status_category ON products(status,category);
CREATE INDEX IF NOT EXISTS idx_products_merchant ON products(merchant_id,status);
CREATE INDEX IF NOT EXISTS idx_products_search_name ON products(name);
