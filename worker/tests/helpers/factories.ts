export function makeUser(overrides: Record<string, unknown> = {}) {
  return {
    id: "user-test-1",
    full_name: "Test Customer",
    email: "customer@example.test",
    phone: "01000000000",
    role: "customer",
    status: "active",
    created_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

export function makeMerchant(overrides: Record<string, unknown> = {}) {
  return {
    id: "merchant-test-1",
    user_id: "user-test-2",
    store_name: "Test Parts Store",
    description: "Test merchant profile",
    contact_phone: "01000000001",
    status: "active",
    business_type: "parts_store",
    city: "Cairo",
    area: "Nasr City",
    address_line: "Test Street",
    ...overrides,
  };
}

export function makeProduct(overrides: Record<string, unknown> = {}) {
  return {
    id: "product-test-1",
    name: "Brake Pad Set",
    sku: "BP-001",
    price_piasters: 125000,
    stock_quantity: 8,
    merchant_id: "merchant-test-1",
    store_name: "Test Parts Store",
    status: "active",
    category: "car_parts",
    fitment: "Sedan",
    ...overrides,
  };
}
