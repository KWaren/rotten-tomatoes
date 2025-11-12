import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const email = url.searchParams.get("email")
  const token = url.searchParams.get("token")

  if (!email || !token) {
    return NextResponse.json({ error: "Invalid link" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || user.verificationToken !== token) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 400 })
  }

  await prisma.user.update({
    where: { email },
    data: { verified: true, verificationToken: null },
  })

  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?verified=true`)
}
