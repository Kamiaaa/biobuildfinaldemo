import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongoose';
import BlogPost from '@/models/BlogPost';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectMongo();
    const post = await BlogPost.findById(params.id);
    if (!post) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectMongo();
    const data = await req.json();
    
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    const existingPost = await BlogPost.findById(params.id);
    if (!existingPost) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(params.id, data, {
      new: true,
    });
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ message: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectMongo();
    const deletedPost = await BlogPost.findByIdAndDelete(params.id);
    if (!deletedPost) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ message: 'Failed to delete post' }, { status: 500 });
  }
}