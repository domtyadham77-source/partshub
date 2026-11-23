import type { Env } from "../index";

type PublicUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: "customer" | "merchant" | "admin";
  status: "active" | "pending" | "suspended";
  createdAt: string;
};

const json = (data: unknown, status = 200, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });
const fail = (status: number, code: string, message: string) => json({ error: { code, message } }, status);
function cookieValue(request: Request, name: string) {
  return request.headers.get("Cookie")?.split(";").map(x => x.trim()).find(x => x.startsWith(name + "="))?.slice(name.length + 1) || null;
}
function hex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, "0")).join("");
}
function randomToken(bytes = 32) {
  const data = new Uint8Array(bytes);
  crypto.getRandomValues(data);
  return [...data].map(b => b.toString(16).padStart(2, "0")).join("");
}
async function digest(value: string) {
  return hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}
async function passwordHash(password: string, salt: string, iterations = 310000) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({
    name: "PBKDF2",
    salt: Uint8Array.from(salt.match(/.{2}/g)!.map(x => parseInt(x, 16))),
    iterations,
    hash: "SHA-256",
  }, key, 256);
  return hex(bits);
}
async function constantTimeSecretMatch(candidate: string, expected: string) {
  const [left, right] = await Promise.all([digest(candidate), digest(expected)]);
  let difference = 0;
  for (let i = 0; i < left.length; i++) difference |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return difference === 0;
}
function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}
function publicUser(row: any): PublicUser {
  return { id: row.id, fullName: row.full_name, email: row.email, phone: row.phone, role: row.role, status: row.status, createdAt: row.created_at };
}
async function allowAuthAttempt(request: Request, env: Env, scope: string, limit: number, windowSeconds = 900) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const key = await digest(scope + ":" + ip);
  const since = new Date(Date.now() - windowSeconds * 1000).toISOString();
  const row = await env.DB.prepare("SELECT COUNT(*) AS total FROM auth_attempts WHERE key_hash=? AND created_at>?")
    .bind(key, since).first<{ total: number }>();
  await env.DB.prepare("INSERT INTO auth_attempts(id,key_hash) VALUES(?,?)").bind(crypto.randomUUID(), key).run();
  await env.DB.prepare("DELETE FROM auth_attempts WHERE created_at<?").bind(new Date(Date.now() - 86400000).toISOString()).run();
  return (row?.total || 0) < limit;
}
async function createSession(userId: string, env: Env) {
  const token = randomToken();
  const days = Math.min(30, Math.max(1, Number(env.SESSION_TTL_DAYS) || 14));
  const expires = new Date(Date.now() + days * 86400000).toISOString();
  await env.DB.prepare("INSERT INTO sessions(id,user_id,token_hash,expires_at) VALUES(?,?,?,?)")
    .bind(crypto.randomUUID(), userId, await digest(token), expires).run();
  return { token, expires };
}
function sessionCookie(token: string, maxAge: number) {
  return `ph_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}
function clearCookie() {
  return "ph_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0";
}

export function matchesAuthRoute(pathname: string, method: string): boolean {
  return (pathname === "/api/auth/me" && method === "GET")
    || (["/api/auth/logout", "/api/auth/register", "/api/auth/login", "/api/auth/forgot-password"].includes(pathname) && method === "POST");
}

/** Handles the authentication endpoints. Returns null when the request belongs to another route. */
export async function handleAuthRoute(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  if (!matchesAuthRoute(url.pathname, request.method)) return null;

  if (url.pathname === "/api/auth/me") {
    const token = cookieValue(request, "ph_session");
    if (!token) return json({ data: { user: null } });
    const row = env.ADMIN_EMAIL ? await env.DB.prepare("SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.status='active' AND u.role='admin' AND lower(u.email)=?")
      .bind(await digest(token), new Date().toISOString(), env.ADMIN_EMAIL.trim().toLowerCase()).first<any>() : null;
    return json({ data: { user: row ? publicUser(row) : null } });
  }

  if (url.pathname === "/api/auth/logout") {
    const token = cookieValue(request, "ph_session");
    if (token) await env.DB.prepare("DELETE FROM sessions WHERE token_hash=?").bind(await digest(token)).run();
    return json({ data: { success: true } }, 200, { "Set-Cookie": clearCookie() });
  }

  let body: any;
  try { body = await request.json(); }
  catch { return fail(400, "INVALID_JSON", "Request body must be valid JSON."); }

  if (url.pathname === "/api/auth/register") {
    return fail(403, "REGISTRATION_DISABLED", "Parts Hub accounts are currently invitation-only.");
    if (!env.DB) return fail(503, "DATABASE_NOT_CONFIGURED", "The preview database is not connected yet. Please try again later.");
    if (!await allowAuthAttempt(request, env, "register", 6)) return fail(429, "RATE_LIMITED", "Too many sign-up attempts. Try again later.");
    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim() || null;
    const password = String(body.password || "");
    const role = body.role === "merchant" ? "merchant" : "customer";
    const businessType = String(body.businessType || "parts_store");
    if (role === "merchant" && !["parts_store", "garage", "maintenance_center", "motorcycle_workshop"].includes(businessType)) return fail(422, "INVALID_BUSINESS_TYPE", "Choose a valid seller business type.");
    if (fullName.length < 2 || fullName.length > 90) return fail(422, "INVALID_NAME", "Enter your full name.");
    if (!validEmail(email)) return fail(422, "INVALID_EMAIL", "Enter a valid email address.");
    if (phone && phone.length > 30) return fail(422, "INVALID_PHONE", "Enter a valid phone number.");
    if (password.length < 10 || password.length > 128) return fail(422, "WEAK_PASSWORD", "Password must be at least 10 characters.");
    const existing = await env.DB.prepare("SELECT id FROM users WHERE email=?").bind(email).first();
    if (existing) return fail(409, "EMAIL_EXISTS", "An account with this email already exists.");
    const id = crypto.randomUUID(), salt = randomToken(16), hash = await passwordHash(password, salt);
    try {
      const statements = [env.DB.prepare("INSERT INTO users(id,full_name,email,phone,role,status,password_hash,password_salt) VALUES(?,?,?,?,?,?,?,?)")
        .bind(id, fullName, email, phone, role, role === "merchant" ? "pending" : "active", hash, salt)];
      if (role === "merchant") statements.push(env.DB.prepare("INSERT INTO merchant_profiles(id,user_id,store_name,status,business_type) VALUES(?,?,?,?,?)")
        .bind(crypto.randomUUID(), id, fullName, "pending", businessType));
      await env.DB.batch(statements);
    } catch (error) {
      const duplicate = await env.DB.prepare("SELECT id FROM users WHERE email=?").bind(email).first();
      if (duplicate) return fail(409, "EMAIL_EXISTS", "An account with this email already exists.");
      console.error("registration_database_write_failed", error);
      return fail(500, "REGISTRATION_FAILED", "We could not create your account right now. Please try again later.");
    }
    const session = await createSession(id, env);
    const row = await env.DB.prepare("SELECT * FROM users WHERE id=?").bind(id).first<any>();
    const maxAge = Math.floor((new Date(session.expires).getTime() - Date.now()) / 1000);
    return json({ data: { user: publicUser(row) } }, 201, { "Set-Cookie": sessionCookie(session.token, maxAge) });
  }

  if (url.pathname === "/api/auth/login") {
    if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) return fail(503, "ADMIN_LOGIN_NOT_CONFIGURED", "Administrator sign-in is not configured yet.");
    if (!await allowAuthAttempt(request, env, "login", 8)) return fail(429, "RATE_LIMITED", "Too many sign-in attempts. Try again in 15 minutes.");
    const email = String(body.email || "").trim().toLowerCase(), password = String(body.password || "");
    const configuredEmail = env.ADMIN_EMAIL.trim().toLowerCase();
    if (!validEmail(configuredEmail) || email !== configuredEmail || !password || !await constantTimeSecretMatch(password, env.ADMIN_PASSWORD)) return fail(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
    const existing = await env.DB.prepare("SELECT * FROM users WHERE email=?").bind(configuredEmail).first<any>();
    const adminCount = await env.DB.prepare("SELECT COUNT(*) AS total FROM users WHERE role='admin'").first<{ total: number }>();
    if (existing && existing.role !== "admin") return fail(409, "ADMIN_EMAIL_IN_USE", "The configured administrator email belongs to a non-admin account. Resolve it before continuing.");
    if ((adminCount?.total || 0) > (existing ? 1 : 0)) return fail(409, "ADMIN_ALREADY_BOOTSTRAPPED", "More than one administrator already exists. Resolve the existing accounts before continuing.");
    if (!existing && (adminCount?.total || 0) > 0) return fail(409, "ADMIN_ALREADY_BOOTSTRAPPED", "An administrator already exists. The configured email cannot create another administrator.");
    if (existing?.status === "suspended") return fail(403, "ACCOUNT_SUSPENDED", "This administrator account is suspended.");
    let userId = existing?.id as string | undefined;
    if (!existing) {
      userId = crypto.randomUUID(); const salt = randomToken(16); const hash = await passwordHash(password, salt);
      try {
        await env.DB.prepare("INSERT INTO users(id,full_name,email,phone,role,status,password_hash,password_salt,password_iterations) VALUES(?,?,?,NULL,'admin','active',?,?,310000)")
          .bind(userId, "Parts Hub Administrator", configuredEmail, hash, salt).run();
      } catch (error) { console.error("admin_bootstrap_failed", error); return fail(500, "ADMIN_BOOTSTRAP_FAILED", "Administrator setup could not be completed. Please try again."); }
    } else {
      const candidateHash = await passwordHash(password, existing.password_salt, existing.password_iterations || 310000);
      if (candidateHash !== existing.password_hash) {
        const salt = randomToken(16), hash = await passwordHash(password, salt);
        await env.DB.batch([
          env.DB.prepare("UPDATE users SET password_hash=?,password_salt=?,password_iterations=310000,status='active',updated_at=? WHERE id=? AND role='admin'").bind(hash, salt, new Date().toISOString(), existing.id),
          env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(existing.id),
        ]);
      }
    }
    // This is a single-owner installation: retire any legacy customer/merchant sessions.
    await env.DB.prepare("DELETE FROM sessions WHERE user_id IN (SELECT id FROM users WHERE role!='admin')").run();
    const session = await createSession(userId!, env);
    const row = await env.DB.prepare("SELECT * FROM users WHERE id=? AND role='admin' AND status='active'").bind(userId).first<any>();
    if (!row) return fail(500, "ADMIN_ACCOUNT_UNAVAILABLE", "Administrator account could not be loaded.");
    const maxAge = Math.floor((new Date(session.expires).getTime() - Date.now()) / 1000);
    return json({ data: { user: publicUser(row) } }, 200, { "Set-Cookie": sessionCookie(session.token, maxAge) });
  }

  return fail(503, "RECOVERY_NOT_CONFIGURED", "Password recovery email delivery is not configured yet. Your account has not been changed.");
}
