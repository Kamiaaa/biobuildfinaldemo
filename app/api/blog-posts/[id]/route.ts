//app/api/blog-posts/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongoose';
import BlogPost from '@/models/BlogPost';

export async function GET(_: NextRequest, context: { params: { id: string } }) {
  await connectMongo();
  const { id } = await context.params;
  const post = await BlogPost.findById(id);
  if (!post) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    await connectMongo();
    const { id } = await context.params;
    const data = await req.json();
    const updatedPost = await BlogPost.findByIdAndUpdate(id, data, {
      new: true,
    });
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ message: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: { params: { id: string } }) {
  try {
    await connectMongo();
    const { id } = await context.params;
    await BlogPost.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ message: 'Failed to delete post' }, { status: 500 });
  }
}