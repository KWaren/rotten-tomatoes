import { NextResponse } from "next/server";
import { prismaDirect } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET(req, context) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "ID missing" }, { status: 400 });
  }

  const user = await prismaDirect.user.findUnique({
    where: { id: parseInt(id) },
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

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user, { status: 200 });
}

//  PUT /api/users/:id
export async function PUT(req, context) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const data = await req.json();
    const { name, surname, email, password, role, profession, birthday } = data;

    const updatedData = { name, surname, email, role, profession, birthday };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const user = await prismaDirect.user.update({
      where: { id: parseInt(id) },
      data: updatedData,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}

// DELETE /api/users/:id
export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    await prismaDirect.user.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error deleting user" }, { status: 500 });
  }
}
