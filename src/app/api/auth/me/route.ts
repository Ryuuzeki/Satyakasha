import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { getInstitutionData } from '@/lib/mockDb';

const SESSION_SECRET = process.env.SESSION_SECRET || 'SuperSecretSessionToken123456789!';

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const [base64Data, signature] = token.split('.');
  
  if (!base64Data || !signature) {
    return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
  }

  // Verifikasi Signature
  const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(base64Data).digest('hex');
  if (expectedSignature !== signature) {
    return NextResponse.json({ error: 'Token tampered' }, { status: 401 });
  }

  try {
    const sessionStr = Buffer.from(base64Data, 'base64').toString('utf-8');
    const session = JSON.parse(sessionStr);

    if (session.expiresAt && session.expiresAt < Date.now()) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    // Ambil data SaaS langganan dari mock database
    const institutionName = session.institutionName;
    const { plan, credits } = getInstitutionData(institutionName);

    return NextResponse.json({ 
      institutionName,
      plan,
      credits 
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to parse session' }, { status: 401 });
  }
}
