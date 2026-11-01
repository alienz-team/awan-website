// Web-Crypto based signed-cookie session (works in middleware + server actions).
export const COOKIE = "awan_admin";
const TTL_MS = 1000 * 60 * 60 * 12;

const ADMIN_EMAILS = () =>
  [process.env.ADMIN_EMAIL, "admin@awan.local", "awan@awan.local"].filter(Boolean).map((e) => e!.toLowerCase());
const ADMIN_PASSWORD = () => process.env.ADMIN_PASSWORD || "0929491004";
const SECRET = () => process.env.ADMIN_SESSION_SECRET || "awan-dev-secret-change-me";

const enc = new TextEncoder();
async function hmac(data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(SECRET()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export function checkCredentials(email: string, password: string) {
  const okEmail = ADMIN_EMAILS().includes(email.trim().toLowerCase());
  const okPass = safeEqual(password, ADMIN_PASSWORD());
  return okEmail && okPass;
}

export async function createToken(email: string) {
  const exp = Date.now() + TTL_MS;
  const payload = `${email.toLowerCase()}|${exp}`;
  return `${btoa(payload)}.${await hmac(payload)}`;
}

export async function verifyToken(token?: string | null) {
  if (!token) return false;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return false;
  let payload: string;
  try { payload = atob(b64); } catch { return false; }
  const exp = Number(payload.split("|")[1]);
  if (!exp || exp < Date.now()) return false;
  return safeEqual(sig, await hmac(payload));
}

export const SESSION_MAX_AGE = TTL_MS / 1000;
