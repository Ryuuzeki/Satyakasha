import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';

const VALID_INSTITUTIONS: Record<string, string> = {
  'BANK-2026': 'Bank Central Asia',
  'AUDIT-2026': 'KAP PricewaterhouseCoopers',
  'CORP-2026': 'PT Telkom Indonesia'
};

const SESSION_SECRET = process.env.SESSION_SECRET || 'SuperSecretSessionToken123456789!';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    const formattedCode = (code || '').trim().toUpperCase();
    const institutionName = VALID_INSTITUTIONS[formattedCode];

    if (!institutionName) {
      return NextResponse.json({ error: 'Kode Otoritas tidak valid.' }, { status: 401 });
    }

    // Buat data sesi yang bisa diverifikasi
    const sessionData = JSON.stringify({ institutionName, expiresAt: Date.now() + 1000 * 60 * 60 * 24 }); // 24 hours
    const base64Data = Buffer.from(sessionData).toString('base64');
    
    // Tanda tangani data dengan HMAC agar tidak bisa dimanipulasi klien
    const signature = crypto.createHmac('sha256', SESSION_SECRET).update(base64Data).digest('hex');
    const token = `${base64Data}.${signature}`;

    // Set HttpOnly, Secure, SameSite=Strict Cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
