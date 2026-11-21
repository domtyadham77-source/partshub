CREATE TABLE IF NOT EXISTS orders (
 id TEXT PRIMARY KEY,
 order_number TEXT NOT NULL UNIQUE,
 customer_id TEXT NOT NULL REFERENCES users(id),
 merchant_id TEXT NOT NULL REFERENCES merchant_profiles(id),
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','accepted','rejected','processing','shipped','delivered','cancelled')),
 subtotal_piasters INTEGER NOT NULL CHECK(subtotal_piasters >= 0),
 shipping_fee_piasters INTEGER NOT NULL DEFAULT 0 CHECK(shipping_fee_piasters >= 0),
 total_piasters INTEGER NOT NULL CHECK(total_piasters >= 0),
 payment_method TEXT NOT NULL DEFAULT 'cash_on_delivery' CHECK(payment_method IN ('cash_on_delivery')),
 payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK(payment_status IN ('unpaid','paid','refunded')),
 recipient_name TEXT NOT NULL,
 recipient_phone TEXT NOT NULL,
 address_line TEXT NOT NULL,
 city TEXT NOT NULL,
 area TEXT NOT NULL DEFAULT '',
 notes TEXT NOT NULL DEFAULT '',
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE IF NOT EXISTS order_items (
 id TEXT PRIMARY KEY,
 order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
 product_id TEXT NOT NULL REFERENCES products(id),
 product_name TEXT NOT NULL,
 sku TEXT,
 unit_price_piasters INTEGER NOT NULL CHECK(unit_price_piasters > 0),
 quantity INTEGER NOT NULL CHECK(quantity > 0),
 line_total_piasters INTEGER NOT NULL CHECK(line_total_piasters > 0)
);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id,created_at);
CREATE INDEX IF NOT EXISTS idx_orders_merchant ON orders(merchant_id,status,created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
