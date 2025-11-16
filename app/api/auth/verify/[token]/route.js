import { prismaDirect } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { token } = await context.params;

  if (!token) {
    const referer =
      req.headers.get("referer") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";
    return NextResponse.redirect(referer);
  }

  const user = await prismaDirect.user.findFirst({
    where: { verificationToken: token },
  });

  if (!user) {
    const referer =
      req.headers.get("referer") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";
    return NextResponse.redirect(referer);
  }

  await prismaDirect.user.update({
    where: { id: user.id },
    data: { verified: true, verificationToken: null },
  });

  const successUrl = "http://localhost:3000/login";

  return NextResponse.redirect(successUrl);
}
