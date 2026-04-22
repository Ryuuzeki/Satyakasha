import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Hitung Hash SHA-256 (Identitas Dokumen) secara konsisten di server
    const documentHash = crypto.createHash('sha256').update(buffer).digest('hex');

    return NextResponse.json({
      status: 'success',
      documentHash,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
