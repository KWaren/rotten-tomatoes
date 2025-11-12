import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, context) {
  const { token } = await context.params;

  if (!token)
    return NextResponse.json({ error: "Token missing" }, { status: 400 });

  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
  });

  if (!user)
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );

  await prisma.user.update({
    where: { id: user.id },
    data: {
      verified: true,
      verificationToken: null,
    },
  });

  return NextResponse.json({ message: "Email verified successfully!" });
}
