import { NextResponse } from "next/server";
import { prismaDirect } from "@/lib/prisma";
import bcrypt from "bcrypt";

// GET /api/users → liste tous les utilisateurs
export async function GET() {
  try {
    const users = await prismaDirect.user.findMany({
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
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}

// POST /api/users → créer un utilisateur (admin)
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, name, surname, role, verified } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismaDirect.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        surname,
        role: role || "USER",
        verified: verified || false,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
