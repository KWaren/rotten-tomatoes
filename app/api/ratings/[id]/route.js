import { NextResponse } from "next/server";
import { getRatingById, updateRating, deleteRating } from "@/lib/ratings";

// GET /api/ratings/:id
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const rating = await getRatingById(id);
    if (!rating) return NextResponse.json({ error: "Rating not found" }, { status: 404 });
    return NextResponse.json({ data: rating });
  } catch (error) {
    console.error(`GET /api/ratings/${params.id} error:`, error);
    return NextResponse.json({ error: error.message || "Internal error" }, { status: 500 });
  }
}

// PUT /api/ratings/:id
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "No data provided for update" }, { status: 400 });
    }
    const updated = await updateRating(parseInt(id), body);
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error(`PUT /api/ratings/${params.id} error:`, error);
    return NextResponse.json({ error: error.message || "Internal error" }, { status: 500 });
  }
}

// DELETE /api/ratings/:id
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await deleteRating(parseInt(id));
    return NextResponse.json({ data: { id }, message: "Deleted" });
  } catch (error) {
    console.error(`DELETE /api/ratings/${params.id} error:`, error);
    return NextResponse.json({ error: error.message || "Internal error" }, { status: 500 });
  }
}
