// /app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { registerSchema } from '@/validators/auth';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '@/lib/mailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.parse(body);

    // check existing
    const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 409 });

    const hashed = await bcrypt.hash(parsed.password, 12);
    const verificationToken = uuidv4();
    const expires = new Date();
    const hours = Number(process.env.VERIFICATION_TOKEN_EXPIRES_HOURS || 24);
    expires.setHours(expires.getHours() + hours);

    const user = await prisma.user.create({
      data: {
        email: parsed.email,
        password: hashed,
        name: parsed.name,
        surname: parsed.surname,
        profession: parsed.profession,
        birthday: parsed.birthday,
        verified: false,
        verificationToken,
      },
      select: { id: true, email: true, verified: true },
    });

    // send mail (async)
    await sendVerificationEmail(user.email, verificationToken);

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return NextResponse.json({ error: err.errors }, { status: 422 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
