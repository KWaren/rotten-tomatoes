import { NextResponse } from "next/server";

export async function POST(req) {
  const cookieName = process.env.COOKIE_NAME || "sid";
  const res = NextResponse.json({ ok: true });
  res.headers.append(
    "Set-Cookie",
    `${cookieName}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; ${
      process.env.COOKIE_SECURE === "true" ? "Secure;" : ""
    }`
  );
  return res;
}
