# Parts Hub

Automotive and motorcycle parts marketplace for Egypt. The project is developed on `preview`; `main` remains untouched until the Preview environment is tested and explicitly approved.

## Current implementation

- React + TypeScript + Vite responsive storefront.
- Live product catalog and product details backed by Cloudflare D1.
- Customer and merchant registration/sign-in using PBKDF2 password hashes and HttpOnly session cookies.
- Merchant accounts start pending and require admin approval.
- Merchant product drafts, product moderation, and product image crop/rotate/upload.
- D1 image storage (one image per product, maximum 1 MB); no R2 binding is required.
- Persistent cart and saved products in the browser.
- Checkout creates one order per seller; seller confirmation rechecks and reserves stock.
- Customer order history and merchant order processing.
- Admin overview, merchant review, product moderation, user controls, and order monitoring.
- Preview CI checks the frontend build/tests and Worker TypeScript.

## Local development

```bash
npm install
npm run dev
```

Build and test:

```bash
npm run build
npm test
```

Worker typecheck:

```bash
cd worker
npm install
npm run typecheck
```

## Cloudflare Preview setup

1. Create a dedicated D1 database for Preview. Never reuse the Production database.
2. In the Cloudflare Pages project, open **Settings → Functions → D1 database bindings** for the Preview environment and add binding name `DB` pointing to the Preview D1 database.
3. Apply every SQL migration in `worker/migrations/` in ascending filename order (0003 through 0007). The first two legacy migration files are empty placeholders.
4. Ensure the Pages project builds from the `preview` branch using `npm run build` with output directory `dist`.
5. The Pages Function at `functions/api/[[path]].ts` serves the API under the same origin at `/api/*`; no separate API URL is needed for the default setup.
6. Test `/api/health`, then register a customer and a merchant account. Approve the merchant and its product drafts from the admin panel.

The Preview D1 binding is a manual Cloudflare setting and is intentionally not stored in Git. The independent Worker config in `worker/wrangler.toml` contains a placeholder D1 ID and must not be deployed until that ID is replaced.

## First administrator

Register the intended administrator as a normal customer account first. Then, in the Preview D1 console only, promote that account:

```sql
UPDATE users
SET role = 'admin', status = 'active', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
WHERE email = 'YOUR_ADMIN_EMAIL';
```

Do not expose admin registration publicly. Repeat separately in Production only after the Production environment is approved.

## Deliberate Preview limitations

- Cash on delivery is the only enabled payment method. Card and wallet payments require choosing and configuring a payment provider.
- Password recovery email delivery is not configured; the API clearly reports that it is unavailable rather than pretending to send a code.
- Delivery fees are not calculated yet; sellers confirm them with the customer.
- Workshop booking, reviews, advanced reporting, and additional product images are still planned.
- Product images are limited to 1 MB and stored in D1 to avoid an R2 dependency.

## Deployment safety

Production deployment is intentionally manual. The placeholder deployment workflows no longer deploy anything automatically. Do not merge to `main` or configure Production resources until Preview is verified and approved.
