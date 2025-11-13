import { NextResponse } from 'next/server';
import {
  getCommentById,
  updateComment,
  deleteComment,
} from '@/lib/comments';

// GET /api/comments/:id
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const comment = await getCommentById(parseInt(id));
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
    return NextResponse.json({ data: comment });
  } catch (error) {
    console.error(`GET /api/comments/${params.id} error:`, error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// PUT /api/comments/:id
// body: partial data to update (e.g. { comment: 'new text' })
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'No data provided for update' }, { status: 400 });
    }

    const updated = await updateComment(parseInt(id), body);
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error(`PUT /api/comments/${params.id} error:`, error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// DELETE /api/comments/:id
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await deleteComment(parseInt(id));
    return NextResponse.json({ data: { id }, message: 'Deleted' });
  } catch (error) {
    console.error(`DELETE /api/comments/${params.id} error:`, error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
