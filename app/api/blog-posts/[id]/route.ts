// app/api/blog-posts/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongoose';
import BlogPost from '@/models/BlogPost';

// GET single blog post
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  await connectMongo();
  const { id } = context.params;

  const post = await BlogPost.findById(id);
  if (!post) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(post);
}

// PUT (update blog post)
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectMongo();
    const { id } = context.params;
    const data = await request.json();
    const updatedPost = await BlogPost.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ message: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE (delete blog post)
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectMongo();
    const { id } = context.params;
    await BlogPost.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ message: 'Failed to delete post' }, { status: 500 });
  }
}
