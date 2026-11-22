# Parts Hub

Parts Hub is an automotive and motorcycle parts marketplace for Egypt. Development and verification happen on the `preview` branch. The `main` branch and Production resources must remain untouched until Preview has been tested and explicitly approved.

## Application structure

- `src/`: React + TypeScript storefront, customer and merchant experiences, admin pages, shared UI, and browser-side services.
- `functions/api/[[path]].ts`: Cloudflare Pages Function entry point that forwards same-origin `/api/*` requests to the Worker application.
- `worker/src/`: API routing, authentication, authorization, database repositories, and business services.
- `worker/migrations/`: ordered D1 schema migrations.
- `public/`: PWA manifest, service worker, and static brand assets.
- `index.html`: Vite document shell and page metadata.

## Local development

Install dependencies and start the frontend:

```bash
npm install
npm run dev
```

Build and test the frontend:

```bash
npm run build
npm test
```

Check the Worker separately:

```bash
cd worker
npm install
npm run typecheck
npm test
```

## Cloudflare Pages Preview

1. Connect the repository to a dedicated Cloudflare Pages project.
2. Set the production branch for that Preview project to `preview`.
3. Build command: `npm run build`.
4. Build output directory: `dist`.
5. Add a D1 binding named `DB` to the Pages Functions Preview environment. It must point to the dedicated Preview database, never the Production database.
6. Apply every SQL migration in `worker/migrations/` in ascending filename order, from `0001_initial_schema.sql` through the latest numbered migration.
7. Verify `/api/health`, then test customer registration, merchant registration, admin approval, product publishing, cart, checkout, and order processing.

The Pages Function in `functions/api/[[path]].ts` serves the API on the same origin. The independent `worker/wrangler.toml` is a separate deployment configuration; its D1 database ID is deliberately a placeholder. Do not deploy that standalone Worker until a real Preview D1 database ID has been supplied and reviewed.

## First administrator

Do not expose public administrator registration. Register the intended administrator through the normal account flow, then promote that account in the Preview D1 console only:

```sql
UPDATE users
SET role = 'admin',
    status = 'active',
    updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
WHERE email = 'YOUR_ADMIN_EMAIL';
```

Do not run this against Production until Production is explicitly approved.

## Preview limitations

- Cash on delivery is the only enabled payment method. Card and wallet payments need a selected and configured payment provider.
- Password recovery delivery is not considered operational until a verified private delivery channel is configured.
- Delivery fees are not calculated automatically; sellers must confirm delivery charges.
- Workshop booking and advanced reporting require further implementation and verification.
- Product images are stored in D1; no R2 binding is required by the current Preview design.

## Deployment safety

Preview is the only branch used for current development. Do not merge to `main`, change Production bindings, or deploy standalone Worker configuration without explicit approval.
