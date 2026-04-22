import { NextRequest, NextResponse } from 'next/server';
import { getMockDocument } from '@/lib/mockDb';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hash = searchParams.get('hash');

  if (!hash) {
    return NextResponse.json({ error: 'Hash is required' }, { status: 400 });
  }

  const document = getMockDocument(hash);

  if (!document) {
    return NextResponse.json({ error: 'Document not found in Mock DB' }, { status: 404 });
  }

  return NextResponse.json(document);
}
