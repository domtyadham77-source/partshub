# Single administrator setup (Cloudflare Pages)

Parts Hub is hosted on **Cloudflare Pages**. The API code is executed by the Pages Function at `functions/api/[[path]].ts`, which forwards `/api/*` requests to the shared API module in `worker/src`. The `worker` folder is the source-code location; this setup does **not** require creating or deploying a separate Cloudflare Worker.

Public registration is disabled in both the frontend routes and the API. Sign-in is restricted to one active administrator configured in the Cloudflare Pages environment.

## Configure Preview first

In the Cloudflare dashboard:

1. Open **Workers & Pages** and select the **Parts Hub Pages project**.
2. Open **Settings → Variables and Secrets**.
3. Add `ADMIN_EMAIL` as a plain-text variable with value `domtyadham7@gmail.com`.
4. Add `ADMIN_PASSWORD` as an encrypted **Secret**. Choose a strong password; do not put it in GitHub or source files.
5. Make sure these values are set for the **Preview** environment first, then redeploy the Preview deployment so the Pages Function receives them.

The Pages Function also needs the existing D1 binding named `DB` under the Pages project's **Settings → Bindings**. Point Preview to the Preview D1 database only. Do not reuse the Production database.

## How first sign-in works

On the first successful sign-in, the Pages Function creates the administrator only if no administrator exists. If another administrator already exists, or the configured email belongs to a non-admin account, setup is refused rather than silently changing that account. Sessions belonging to old customer/merchant accounts are retired after a successful administrator sign-in.

The configured `ADMIN_PASSWORD` is the source of truth. When you rotate that Secret in Cloudflare Pages, sign in with the new value; the API updates the PBKDF2 password hash in D1 and revokes the previous administrator sessions.

The requested temporary password `123` is not committed or embedded in code. It is extremely weak and must not be used in Production.

## Production

Only after Preview login and the `/admin` dashboard have been tested, configure `ADMIN_EMAIL` and `ADMIN_PASSWORD` separately for the **Production** environment in the same Pages project settings. Keep the Production D1 binding pointed at the Production database. This code change does not alter Cloudflare settings, deploy Pages, or modify D1 data.

After configuring Preview and deploying the Preview branch, open `/login`. A successful administrator sign-in redirects to `/admin`.
