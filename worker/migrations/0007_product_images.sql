CREATE TABLE IF NOT EXISTS product_images (
 id TEXT PRIMARY KEY,
 product_id TEXT NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
 content_type TEXT NOT NULL CHECK(content_type IN ('image/jpeg','image/png','image/webp')),
 byte_size INTEGER NOT NULL CHECK(byte_size > 0 AND byte_size <= 1000000),
 image_data BLOB NOT NULL,
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
