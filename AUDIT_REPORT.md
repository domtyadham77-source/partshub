# Parts Hub — Preview Repository Audit

**Audit date:** 2026-11-21  
**Branch audited:** `preview`  
**Commit audited:** `236a9c9ac476885cae9011fd2f65f70592c50140`  
**Production branch:** `main` — not modified by this audit.

## 1. File count

| Measure | Count |
|---|---:|
| Total tracked files | 319 |
| Non-empty files (more than 1 byte) | 164 |
| Empty / placeholder files (0–1 byte) | 155 |
| Directories | 37 |

> **Important:** “Non-empty” means the file contains bytes; it does not certify that the implementation is complete, secure, connected to the database, or production-ready. Some non-empty files are only deployment configuration or placeholder adapters.

## 2. Non-empty files

### `.github/workflows`
- `.github/workflows/ci.yml`
- `.github/workflows/deploy-preview.yml`
- `.github/workflows/deploy-production.yml`
- `.github/workflows/preview-ci.yml`

### `(root)`
- `.gitignore`
- `index.html`
- `package.json`
- `PROJECT_AUDIT_REPORT.md`
- `README.md`
- `tsconfig.json`
- `vite.config.ts`

### `functions/api`
- `functions/api/[[path]].ts`

### `public`
- `public/icon.svg`
- `public/manifest.webmanifest`
- `public/sw.js`

### `src`
- `src/App.tsx`
- `src/main.tsx`

### `src/components/auth`
- `src/components/auth/RequireAuth.tsx`

### `src/components/cart`
- `src/components/cart/CartEmptyState.css`
- `src/components/cart/CartEmptyState.test.tsx`
- `src/components/cart/CartEmptyState.tsx`
- `src/components/cart/CartItem.css`
- `src/components/cart/CartItem.test.tsx`
- `src/components/cart/CartItem.tsx`
- `src/components/cart/CartSummary.css`
- `src/components/cart/CartSummary.test.tsx`
- `src/components/cart/CartSummary.tsx`

### `src/components/layout`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/MainLayout.tsx`

### `src/components/products`
- `src/components/products/ProductCard.test.tsx`
- `src/components/products/ProductCard.tsx`
- `src/components/products/ProductFilters.test.tsx`
- `src/components/products/ProductFilters.tsx`
- `src/components/products/ProductGallery.css`
- `src/components/products/ProductGallery.test.tsx`
- `src/components/products/ProductGallery.tsx`
- `src/components/products/ProductGrid.test.tsx`
- `src/components/products/ProductGrid.tsx`
- `src/components/products/ProductImageEditor.css`
- `src/components/products/ProductImageEditor.test.tsx`
- `src/components/products/ProductImageEditor.tsx`
- `src/components/products/ProductImageUpload.css`
- `src/components/products/ProductImageUpload.test.tsx`
- `src/components/products/ProductImageUpload.tsx`
- `src/components/products/RelatedProducts.test.tsx`
- `src/components/products/RelatedProducts.tsx`

### `src/components/ui`
- `src/components/ui/Avatar.css`
- `src/components/ui/Avatar.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Button.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Loader.tsx`
- `src/components/ui/Modal.css`
- `src/components/ui/Modal.tsx`
- `src/components/ui/Toast.css`
- `src/components/ui/Toast.tsx`

### `src/config`
- `src/config/env.ts`
- `src/config/permissions.ts`
- `src/config/routes.ts`

### `src/contexts`
- `src/contexts/AuthContext.test.tsx`
- `src/contexts/AuthContext.tsx`
- `src/contexts/CartContext.test.tsx`
- `src/contexts/CartContext.tsx`
- `src/contexts/FavoritesContext.tsx`
- `src/contexts/NotificationContext.tsx`
- `src/contexts/ToastContext.tsx`

### `src/data`
- `src/data/products.ts`

### `src/hooks`
- `src/hooks/useAuth.ts`
- `src/hooks/useCart.ts`
- `src/hooks/useDebounce.ts`
- `src/hooks/useNotifications.ts`

### `src/pages`
- `src/pages/AccountPage.tsx`
- `src/pages/AdminCategoriesPage.tsx`
- `src/pages/AdminDashboardPage.tsx`
- `src/pages/AdminMerchantsPage.tsx`
- `src/pages/AdminNotificationsPage.tsx`
- `src/pages/AdminOrdersPage.tsx`
- `src/pages/AdminProductsPage.tsx`
- `src/pages/AdminReportsPage.tsx`
- `src/pages/AdminSettingsPage.tsx`
- `src/pages/AdminSupportPage.tsx`
- `src/pages/AdminUsersPage.tsx`
- `src/pages/CartPage.tsx`
- `src/pages/CatalogPage.tsx`
- `src/pages/CheckoutPage.tsx`
- `src/pages/FavoritesPage.tsx`
- `src/pages/ForgotPasswordPage.tsx`
- `src/pages/LoginPage.tsx`
- `src/pages/MerchantDashboardPage.tsx`
- `src/pages/MerchantOrdersPage.tsx`
- `src/pages/MerchantProductsPage.tsx`
- `src/pages/MerchantProfilePage.tsx`
- `src/pages/NotFoundPage.tsx`
- `src/pages/NotificationsPage.tsx`
- `src/pages/OrderDetailsPage.tsx`
- `src/pages/OrdersPage.tsx`
- `src/pages/ProductDetailsPage.tsx`
- `src/pages/RegisterPage.tsx`
- `src/pages/SupportPage.tsx`
- `src/pages/WorkshopsPage.tsx`

### `src/routes`
- `src/routes/AppRouter.tsx`

### `src/services`
- `src/services/admin.ts`
- `src/services/analytics.ts`
- `src/services/api.test.ts`
- `src/services/api.ts`
- `src/services/auth.ts`
- `src/services/cart.ts`
- `src/services/categories.ts`
- `src/services/favorites.ts`
- `src/services/merchants.ts`
- `src/services/notifications.ts`
- `src/services/orders.ts`
- `src/services/payments.ts`
- `src/services/products.ts`
- `src/services/search.ts`
- `src/services/security.ts`
- `src/services/settings.ts`
- `src/services/support.ts`
- `src/services/uploads.ts`
- `src/services/users.ts`
- `src/services/workshops.ts`

### `src/styles`
- `src/styles/cart.css`
- `src/styles/catalog-import.css`
- `src/styles/catalog.css`
- `src/styles/components.css`
- `src/styles/favorites.css`
- `src/styles/global.css`
- `src/styles/merchant.css`
- `src/styles/notifications.css`
- `src/styles/orders.css`
- `src/styles/support.css`
- `src/styles/variables.css`
- `src/styles/workshops.css`

### `src/test`
- `src/test/setup.ts`

### `src/types`
- `src/types/api.ts`
- `src/types/cart.ts`
- `src/types/category.ts`
- `src/types/merchant.ts`
- `src/types/notification.ts`
- `src/types/order.ts`
- `src/types/product.ts`
- `src/types/review.ts`
- `src/types/support.ts`
- `src/types/user.ts`

### `src/utils`
- `src/utils/constants.ts`
- `src/utils/errorHandler.ts`
- `src/utils/formatCurrency.ts`
- `src/utils/formatDate.ts`
- `src/utils/storage.ts`
- `src/utils/validators.ts`

### `worker`
- `worker/package.json`
- `worker/README.md`
- `worker/tsconfig.json`
- `worker/wrangler.toml`

### `worker/migrations`
- `worker/migrations/0003_auth_sessions.sql`
- `worker/migrations/0004_auth_rate_limits.sql`
- `worker/migrations/0005_marketplace.sql`
- `worker/migrations/0006_orders.sql`
- `worker/migrations/0007_product_images.sql`
- `worker/migrations/0008_support_tickets.sql`
- `worker/migrations/0009_notifications.sql`
- `worker/migrations/0010_workshop_directory.sql`

### `worker/src`
- `worker/src/index.ts`

## 3. Empty / placeholder files still needing attention

### `public/icons`
- `public/icons/icon-192.png`
- `public/icons/icon-512.png`

### `src/assets`
- `src/assets/logo.png`

### `src/components/layout`
- `src/components/layout/Footer.test.tsx`
- `src/components/layout/Header.test.tsx`
- `src/components/layout/MainLayout.test.tsx`

### `src/components/ui`
- `src/components/ui/Avatar.test.tsx`
- `src/components/ui/Badge.test.tsx`
- `src/components/ui/Button.test.tsx`
- `src/components/ui/Input.test.tsx`
- `src/components/ui/Loader.test.tsx`
- `src/components/ui/Modal.test.tsx`
- `src/components/ui/Toast.test.tsx`

### `src/config`
- `src/config/env.test.ts`
- `src/config/permissions.test.ts`
- `src/config/routes.test.ts`

### `src/contexts`
- `src/contexts/NotificationContext.test.tsx`
- `src/contexts/ToastContext.test.tsx`

### `src/hooks`
- `src/hooks/useAuth.test.ts`
- `src/hooks/useCart.test.ts`
- `src/hooks/useDebounce.test.ts`
- `src/hooks/useNotifications.test.ts`

### `src/pages`
- `src/pages/AccountPage.test.tsx`
- `src/pages/AdminCategoriesPage.test.tsx`
- `src/pages/AdminDashboardPage.test.tsx`
- `src/pages/AdminMerchantsPage.test.tsx`
- `src/pages/AdminOrdersPage.test.tsx`
- `src/pages/AdminProductsPage.test.tsx`
- `src/pages/AdminReportsPage.test.tsx`
- `src/pages/AdminSettingsPage.test.tsx`
- `src/pages/AdminUsersPage.test.tsx`
- `src/pages/CarsPage.test.tsx`
- `src/pages/CarsPage.tsx`
- `src/pages/CartPage.test.tsx`
- `src/pages/CheckoutPage.test.tsx`
- `src/pages/FavoritesPage.test.tsx`
- `src/pages/ForgotPasswordPage.test.tsx`
- `src/pages/HomePage.test.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/LoginPage.test.tsx`
- `src/pages/MerchantDashboardPage.test.tsx`
- `src/pages/MerchantOrdersPage.test.tsx`
- `src/pages/MerchantProductsPage.test.tsx`
- `src/pages/MerchantProfilePage.test.tsx`
- `src/pages/MotorcyclesPage.test.tsx`
- `src/pages/MotorcyclesPage.tsx`
- `src/pages/OrderDetailsPage.test.tsx`
- `src/pages/OrdersPage.test.tsx`
- `src/pages/ProductDetailsPage.test.tsx`
- `src/pages/RegisterPage.test.tsx`

### `src/routes`
- `src/routes/AppRouter.test.tsx`

### `src/services`
- `src/services/admin.test.ts`
- `src/services/analytics.test.ts`
- `src/services/auth.test.ts`
- `src/services/cart.test.ts`
- `src/services/categories.test.ts`
- `src/services/favorites.test.ts`
- `src/services/merchants.test.ts`
- `src/services/notifications.test.ts`
- `src/services/orders.test.ts`
- `src/services/payments.test.ts`
- `src/services/products.test.ts`
- `src/services/reviews.test.ts`
- `src/services/reviews.ts`
- `src/services/search.test.ts`
- `src/services/security.test.ts`
- `src/services/settings.test.ts`
- `src/services/support.test.ts`
- `src/services/uploads.test.ts`
- `src/services/users.test.ts`

### `src/styles`
- `src/styles/animations.css`

### `src/test`
- `src/test/accessibility.test.tsx`
- `src/test/pwa.test.ts`
- `src/test/security.test.ts`
- `src/test/utils.tsx`

### `src/test/integration`
- `src/test/integration/admin-flow.test.tsx`
- `src/test/integration/auth-flow.test.tsx`
- `src/test/integration/cart-flow.test.tsx`
- `src/test/integration/image-editor-flow.test.tsx`
- `src/test/integration/merchant-flow.test.tsx`
- `src/test/integration/notification-flow.test.tsx`
- `src/test/integration/order-flow.test.tsx`
- `src/test/integration/password-reset-flow.test.tsx`
- `src/test/integration/payment-flow.test.tsx`
- `src/test/integration/upload-flow.test.tsx`

### `src/test/mocks`
- `src/test/mocks/handlers.ts`
- `src/test/mocks/server.ts`

### `src/types`
- `src/types/cart.test.ts`

### `src/utils`
- `src/utils/constants.test.ts`
- `src/utils/errorHandler.test.ts`
- `src/utils/formatCurrency.test.ts`
- `src/utils/formatDate.test.ts`
- `src/utils/storage.test.ts`
- `src/utils/validators.test.ts`

### `worker`
- `worker/vitest.config.ts`

### `worker/migrations`
- `worker/migrations/0001_initial_schema.sql`
- `worker/migrations/0002_security_indexes.sql`

### `worker/src/db`
- `worker/src/db/connection.ts`
- `worker/src/db/queries.ts`
- `worker/src/db/schema.sql`

### `worker/src/db/repositories`
- `worker/src/db/repositories/auditLogRepository.ts`
- `worker/src/db/repositories/cartRepository.ts`
- `worker/src/db/repositories/categoryRepository.ts`
- `worker/src/db/repositories/favoriteRepository.ts`
- `worker/src/db/repositories/merchantRepository.ts`
- `worker/src/db/repositories/notificationRepository.ts`
- `worker/src/db/repositories/orderRepository.ts`
- `worker/src/db/repositories/paymentRepository.ts`
- `worker/src/db/repositories/productRepository.ts`
- `worker/src/db/repositories/reviewRepository.ts`
- `worker/src/db/repositories/supportRepository.ts`
- `worker/src/db/repositories/userRepository.ts`

### `worker/src/middleware`
- `worker/src/middleware/auth.ts`
- `worker/src/middleware/permissions.ts`
- `worker/src/middleware/rateLimit.ts`
- `worker/src/middleware/securityHeaders.ts`
- `worker/src/middleware/validation.ts`

### `worker/src/routes`
- `worker/src/routes/admin.ts`
- `worker/src/routes/auth.ts`
- `worker/src/routes/cart.ts`
- `worker/src/routes/categories.ts`
- `worker/src/routes/favorites.ts`
- `worker/src/routes/merchants.ts`
- `worker/src/routes/notifications.ts`
- `worker/src/routes/orders.ts`
- `worker/src/routes/payments.ts`
- `worker/src/routes/products.ts`
- `worker/src/routes/reviews.ts`
- `worker/src/routes/search.ts`
- `worker/src/routes/support.ts`
- `worker/src/routes/uploads.ts`
- `worker/src/routes/users.ts`

### `worker/src/services`
- `worker/src/services/auditService.ts`
- `worker/src/services/cartService.ts`
- `worker/src/services/notificationService.ts`
- `worker/src/services/passwordResetService.ts`
- `worker/src/services/paymentService.ts`
- `worker/src/services/sessionService.ts`
- `worker/src/services/uploadService.ts`

### `worker/tests`
- `worker/tests/auth.test.ts`
- `worker/tests/cart.test.ts`
- `worker/tests/cartRepository.test.ts`
- `worker/tests/cartService.test.ts`
- `worker/tests/database.test.ts`
- `worker/tests/notifications.test.ts`
- `worker/tests/orders.test.ts`
- `worker/tests/passwordReset.test.ts`
- `worker/tests/payments.test.ts`
- `worker/tests/permissions.test.ts`
- `worker/tests/products.test.ts`
- `worker/tests/security.test.ts`
- `worker/tests/uploads.test.ts`

### `worker/tests/helpers`
- `worker/tests/helpers/factories.ts`
- `worker/tests/helpers/mockBindings.ts`
- `worker/tests/helpers/testEnv.ts`

## 4. CI status observed

The completed Preview CI run for commit `f6b59027a31112d8b631c23157fb8155d287e43c` reported success for:
- Frontend verification: `npm install`, `npm run build`, and `npm test`.
- Worker TypeScript check: `npm run typecheck`.

This confirms those workflow steps passed for that exact commit. It does **not** mean every feature is complete or that Cloudflare Preview has been deployed and tested end-to-end.

## 5. Main outstanding implementation areas

1. Fill the remaining worker route, repository, middleware, service, database schema and test placeholders.
2. Complete missing frontend pages/tests/utilities and review all existing implementations for real API wiring.
3. Add and verify the initial database migrations and schema (currently the initial migration files are empty).
4. Add real product image/PWA icon assets; `src/assets/logo.png` and the two public PNG icons are empty.
5. Review authentication, password recovery, permissions, uploads, checkout/payment, merchant approval, admin operations and support flows for security and end-to-end behavior.
6. Configure Preview Cloudflare bindings only after the Preview D1/KV identifiers are confirmed. Do not reuse Production resources.

## 6. Safety boundary

This report is an inventory of the Git tree on `preview`. It does not change `main`, does not deploy anything, and does not certify commercial launch readiness.
