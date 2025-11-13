import { NextResponse } from 'next/server';
import {
  createComment,
  getCommentsByMovie,
} from '@/lib/comments';

// GET /api/comments?movieId=123
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = parseInt(searchParams.get('movieId'));

    if (!movieId) {
      return NextResponse.json({ error: 'movieId query parameter is required' }, { status: 400 });
    }

    const comments = await getCommentsByMovie(movieId);
    return NextResponse.json({ data: comments });
  } catch (error) {
    console.error('GET /api/comments error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// POST /api/comments
// body: { userId, movieId, content }
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, movieId, content } = body;

    if (!userId || !movieId || !content) {
      return NextResponse.json({ error: 'userId, movieId and content are required' }, { status: 400 });
    }

    const newComment = await createComment(userId, movieId, content);
    return NextResponse.json({ data: newComment }, { status: 201 });
  } catch (error) {
    console.error('POST /api/comments error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
