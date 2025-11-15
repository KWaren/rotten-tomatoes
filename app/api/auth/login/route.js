import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    //  Vérifie si l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    if (!user.verified)
      return NextResponse.json(
        { error: "Email not verified" },
        { status: 403 }
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5️⃣ Supprime le mot de passe avant d'envoyer la réponse
    const { password: _, ...safeUser } = user;

    // 6️⃣ Crée une réponse avec cookie
    const cookieName = process.env.COOKIE_NAME || "sid";
    const response = NextResponse.json({
      message: "Login successful",
      user: safeUser,
    });
    response.cookies.set(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
