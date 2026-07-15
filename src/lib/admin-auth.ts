export const ADMIN_SESSION_COOKIE = "survay_admin_session"
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days

function getAdminEmail() {
  return process.env.ADMIN_EMAIL ?? "admin@survay.com"
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "bitbrains"
}

function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ??
    `survay-session:${getAdminEmail()}:${getAdminPassword()}`
  )
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

async function hmac(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  )

  return toHex(signature)
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

export function validateAdminCredentials(email: string, password: string) {
  return (
    safeEqual(email.trim().toLowerCase(), getAdminEmail().toLowerCase()) &&
    safeEqual(password, getAdminPassword())
  )
}

export async function createAdminSessionToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const payload = `${getAdminEmail().toLowerCase()}:${expiresAt}`
  const signature = await hmac(payload)
  return `${expiresAt}.${signature}`
}

export async function verifyAdminSessionToken(token: string | undefined | null) {
  if (!token) return false

  const [expiresAtRaw, signature] = token.split(".")
  const expiresAt = Number(expiresAtRaw)

  if (!expiresAtRaw || !signature || !Number.isFinite(expiresAt)) {
    return false
  }

  if (expiresAt < Math.floor(Date.now() / 1000)) {
    return false
  }

  const payload = `${getAdminEmail().toLowerCase()}:${expiresAt}`
  const expected = await hmac(payload)
  return safeEqual(signature, expected)
}

export function adminSessionCookieOptions(maxAge = SESSION_TTL_SECONDS) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  }
}
