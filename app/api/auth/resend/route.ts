// /app/api/auth/resend/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/mailer';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email }});
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  if (user.verified) return NextResponse.json({ error: 'Already verified' }, { status: 400 });

  const token = uuidv4();
  await prisma.user.update({ where: { id: user.id }, data: { verificationToken: token }});
  await sendVerificationEmail(user.email, token);

  return NextResponse.json({ ok: true });
}
