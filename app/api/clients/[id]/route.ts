// app/api/clients/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongoose';
import Client from '@/models/Client';
import cloudinary from '@/lib/cloudinary';

// GET a single client
export async function GET(_: NextRequest, context: { params: { id: string } }) {
  try {
    await connectMongo();
    const { id } = await context.params;
    const client = await Client.findById(id);

    if (!client) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('GET client error:', error);
    return NextResponse.json({ message: 'Failed to fetch client' }, { status: 500 });
  }
}

// UPDATE a client
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    await connectMongo();
    const { id } = await context.params;
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const file = formData.get('image') as File | null;

    let updateData: { name: string; image?: string } = { name };

    if (file && file.name) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadRes = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'clients' }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(buffer);
      });

      updateData.image = uploadRes.secure_url;
    }

    const updatedClient = await Client.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedClient) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Client updated successfully', client: updatedClient });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ message: 'Failed to update client' }, { status: 500 });
  }
}

// DELETE a client
export async function DELETE(_: NextRequest, context: { params: { id: string } }) {
  try {
    await connectMongo();
    const { id } = await context.params;

    const deleted = await Client.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ message: 'Failed to delete client' }, { status: 500 });
  }
}
