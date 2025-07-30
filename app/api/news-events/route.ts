import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import connectMongo from '@/lib/mongoose';
import NewsEvent from '@/models/NewsEvent';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// ✅ GET Handler – now supports both paginated and full fetch
export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

    if (pageParam && limitParam) {
      const page = parseInt(pageParam);
      const limit = parseInt(limitParam);
      const skip = (page - 1) * limit;

      const total = await NewsEvent.countDocuments();
      const data = await NewsEvent.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return NextResponse.json({ data, total });
    }

    // If no pagination query, return full list (used in view page)
    const items = await NewsEvent.find().sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error('GET /api/news-events error:', error);
    return NextResponse.json({ message: 'Failed to fetch news/events' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const body = await req.json();
    const { type, title, date, summary, location, image } = body;

    if (!type || !title || !date || !summary || !image) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Save to MongoDB
    const newItem = new NewsEvent({
      type,
      title,
      date,
      summary,
      location: type === 'event' ? location : '',
      image, // this is already uploaded to Cloudinary on the client
    });

    await newItem.save();

    return NextResponse.json({ message: 'News/Event added successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/news-events error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

