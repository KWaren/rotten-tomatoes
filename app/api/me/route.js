import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const cookieName = process.env.COOKIE_NAME || "sid";

  const token = req.cookies.get(cookieName)?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ user: null });
  }

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
