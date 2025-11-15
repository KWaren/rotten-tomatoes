// /app/api/me/route.js
import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const cookieName = process.env.COOKIE_NAME || "sid";
  const cookie = req.headers.get("cookie") || "";
  const match = cookie
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${cookieName}=`));
  if (!match) return NextResponse.json({ user: null });

  const token = match.split("=")[1];
  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ user: null });

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      email: true,
      name: true,
      surname: true,
      profession: true,
      birthday: true,
      role: true,
      verified: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ user: user ?? null });
}
