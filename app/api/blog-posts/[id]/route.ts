// app/api/blog-posts/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongoose';
import BlogPost from '@/models/BlogPost';

// GET single blog post
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await connectMongo();
  const { id } = params;
  const post = await BlogPost.findById(id);
  if (!post) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(post);
}

// UPDATE blog post
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectMongo();
    const { id } = params;
    const data = await req.json();
    const updatedPost = await BlogPost.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ message: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE blog post
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectMongo();
    const { id } = params;
    await BlogPost.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ message: 'Failed to delete post' }, { status: 500 });
  }
}
