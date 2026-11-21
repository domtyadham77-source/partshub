# Parts Hub Preview API

This Worker is also exposed through the Cloudflare Pages Function at `/api/*` in this repository.

## Preview setup (manual Cloudflare steps)

1. Create a separate D1 database for Preview. Do not reuse the production database.
2. In the Cloudflare Pages Preview environment, add a D1 binding named `DB` pointing to that Preview database.
3. Apply the SQL migrations in `worker/migrations/` to the Preview D1 database, in numerical order.
4. Deploy the Preview branch and test `/api/health`.
5. Configure the Production Pages environment separately later; do not copy the Preview D1 binding into Production.

The Wrangler file contains a deliberately obvious placeholder database ID. Replace it only if deploying this Worker independently. Never commit credentials or real secrets.

## Authentication

- Passwords use PBKDF2-SHA-256 with a per-user random salt.
- Sessions use random opaque tokens; only SHA-256 token hashes are stored in D1.
- Session cookies are HttpOnly, Secure, SameSite=Lax, and expire after the configured TTL.
- Merchant signups start with `pending` status.
- Password reset intentionally returns `RECOVERY_NOT_CONFIGURED` until a verified email delivery provider and one-time-token flow are connected.

## Product photos

Product photos are stored in the Preview D1 database in `product_images`, not R2. The first version allows one edited image per product, JPG/PNG/WebP, maximum 1 MB. Public images are served only when both the product and seller are active; draft images are private to their merchant. This is a deliberately small initial limit to protect D1 storage and transfer usage.
