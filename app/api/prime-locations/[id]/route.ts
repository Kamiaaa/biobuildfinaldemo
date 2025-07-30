// app/api/prime-locations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongoose';
import { PrimeLocation } from '@/models/PrimeLocation';

export async function PATCH(req: NextRequest,  context: { params: { id: string } }) {
  try {
    await connectMongo();
    const { id } = await context.params;
    const body = await req.json();
    const updated = await PrimeLocation.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      return NextResponse.json({ message: 'Location not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Location updated', location: updated });
  } catch (err) {
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}

export const DELETE = async (_: NextRequest, context: { params: { id: string } }) => {
  await connectMongo();
  const { id } = await context.params;
  const location = await PrimeLocation.findByIdAndDelete(id);
  if (!location) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Product deleted' });
};


