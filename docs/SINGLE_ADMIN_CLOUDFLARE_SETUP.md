# Single administrator setup (Cloudflare Worker)

Public registration is disabled in the frontend and Worker API. Sign-in is restricted to the administrator configured through Worker secrets.

Set these in the Worker environment (never commit their values):

- `ADMIN_EMAIL`: plain-text Worker variable set to `domtyadham7@gmail.com`.
- `ADMIN_PASSWORD`: **Worker Secret** containing the password you choose in Cloudflare.

On first successful sign-in, the Worker creates the administrator only if no administrator exists. If another administrator already exists, or the configured email belongs to a non-admin account, setup is refused rather than overwriting an account. Customer/merchant sessions from any previous installation are revoked on successful administrator sign-in.

The configured password is the source of truth. When you change `ADMIN_PASSWORD` in Cloudflare, sign in with the new value; the Worker updates the PBKDF2 hash in D1 and revokes the previous administrator sessions. No password value is stored in this repository.

The requested temporary password `123` is not committed or embedded in code. It is extremely weak; do not use it in production. Configure Preview and Production secrets separately. This code change does not itself alter Cloudflare settings, deploy the Worker, or change D1 data.

After setting both secrets and deploying the Worker, open `/login`. A successful sign-in redirects to `/admin`.
