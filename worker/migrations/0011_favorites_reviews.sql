-- User-owned favorites and product reviews.
CREATE TABLE IF NOT EXISTS favorites (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 UNIQUE(user_id,product_id)
);
CREATE INDEX IF NOT EXISTS idx_favorites_user_created ON favorites(user_id,created_at);
CREATE TABLE IF NOT EXISTS reviews (
 id TEXT PRIMARY KEY,
 product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
 comment TEXT NOT NULL DEFAULT '',
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 UNIQUE(product_id,user_id)
);
CREATE INDEX IF NOT EXISTS idx_reviews_product_created ON reviews(product_id,created_at);