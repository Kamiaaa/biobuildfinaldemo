// app/api/news-events/[id]/route.ts

// ✅ Use Node.js runtime to enable Buffer, stream, etc.
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import connectMongo from '@/lib/mongoose';
import NewsEvent from '@/models/NewsEvent';
import cloudinary from '@/lib/cloudinary';

// GET: Single News/Event
export async function GET(_: NextRequest, context: { params: { id: string } }) {
  await connectMongo();
  const { id } = await context.params;
  const item = await NewsEvent.findById(id);
  if (!item) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

// PUT: Update News/Event
// PUT: Update News/Event
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    await connectMongo();
    
    const { id } = await context.params;

    const body = await req.json();

    const { type, title, date, summary, location, image } = body;

    const updated = await NewsEvent.findByIdAndUpdate(
      id,
      {
        type,
        title,
        date,
        summary,
        location: type === 'event' ? location : '',
        image,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ message: 'Failed to update' }, { status: 500 });
  }
}


// DELETE: Remove News/Event
export async function DELETE(_: NextRequest, context: { params: { id: string } }) {
  try {
    await connectMongo();
    const { id } = await context.params;
    await NewsEvent.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ message: 'Failed to delete' }, { status: 500 });
  }
}
