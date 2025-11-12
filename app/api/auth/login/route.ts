// /app/api/auth/login/route.ts
import prisma from '@/lib/prisma';
import { loginSchema } from '@/validators/auth';
import bcrypt from 'bcrypt';
import { signSession } from '@/lib/jwt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: parsed.email }});
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const ok = await bcrypt.compare(parsed.password, user.password);
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    if (!user.verified) {
      return NextResponse.json({ error: 'Please verify your email first' }, { status: 403 });
    }

    const token = signSession({ userId: user.id, role: user.role });

    const cookieName = process.env.COOKIE_NAME || 'sid';
    const secure = process.env.COOKIE_SECURE === 'true';
    const expiresSeconds = 60 * 60 * 24 * 7; // 7 days - adjust with JWT_EXPIRES_IN if needed

    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
    res.headers.append('Set-Cookie',
      `${cookieName}=${token}; HttpOnly; Path=/; Max-Age=${expiresSeconds}; SameSite=Lax; ${secure ? 'Secure;' : ''}`
    );
    return res;
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return NextResponse.json({ error: err.errors }, { status: 422 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
