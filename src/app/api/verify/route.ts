import { NextResponse } from 'next/server';
import crypto from 'crypto';
import lighthouse from '@lighthouse-web3/sdk';
import { encryptBuffer } from '@/lib/encryption';

export const runtime = 'nodejs';

const MAX_UPLOAD_SIZE_MB = 4;
const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;

type DuplicateCheckResult = {
  isDuplicate?: boolean;
  confidenceScore?: number | string;
  details?: unknown;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `Ukuran file terlalu besar. Maksimal ${MAX_UPLOAD_SIZE_MB}MB untuk upload dashboard.`,
        },
        { status: 413 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Process Hashing (SHA-256)
    const documentHash = crypto.createHash('sha256').update(buffer).digest('hex');

    // 2. Integrasi riil ke AI Microservice (DuplicateGuard) Python
    try {
      const aiFormData = new FormData();
      const blob = new Blob([buffer], { type: file.type });
      aiFormData.append('file', blob, file.name || 'document.jpeg');

      const aiResponse = await fetch('http://127.0.0.1:8000/api/ai/duplicate-check', {
        method: 'POST',
        body: aiFormData,
      });
      
      if (aiResponse.ok) {
        const aiResult = await aiResponse.json() as DuplicateCheckResult;
        
        // Blokir jika terdeteksi duplikat (Skor kemiripan yang tinggi via Computer Vision/NLP)
        if (aiResult.isDuplicate) {
          return NextResponse.json({ 
            error: `Verifikasi Ditolak: Dokumen ini terdeteksi sebagai duplikat dengan skor kemiripan ${aiResult.confidenceScore}%. Hentikan upaya double-spending.`,
            details: aiResult.details
          }, { status: 406 });
        }
      } else {
        console.warn("Layanan AI merespons dengan error:", await aiResponse.text());
      }
    } catch (aiErr: unknown) {
      console.warn("AI DuplicateGuard service sedang offline atau tidak dapat dijangkau. Bekerja dalam mode Fallback...", getErrorMessage(aiErr));
    }

    // 3. Integrasi Jaringan DePIN Filecoin (Bank-Level Privacy via AES-256 Encryption)
    let ipfsCID = 'mock-cid-pending';
    
    if (process.env.LIGHTHOUSE_API_KEY) {
      try {
        // Enkripsi file Biner sebelum masuk ke jaringan publik DePIN!
        const encryptedBuffer = encryptBuffer(buffer);

        // Upload Buffer terenkripsi ke ekosistem DePIN Filecoin via Lighthouse Web3
        const uploadResponse = await lighthouse.uploadBuffer(
          encryptedBuffer,
          process.env.LIGHTHOUSE_API_KEY
        );
        
        ipfsCID = uploadResponse.data.Hash;
        console.log("Successfully anchored to Filecoin DePIN. CID:", ipfsCID);
      } catch (depinError: unknown) {
        console.warn("DePIN (Filecoin) upload failed:", getErrorMessage(depinError));
        ipfsCID = 'fallback-mock-cid-' + Date.now();
      }
    } else {
      console.warn("LIGHTHOUSE_API_KEY is not set in environment.");
      ipfsCID = 'fallback-mock-cid-no-apikey';
    }

    // 4. Return respon JSON ke klien
    return NextResponse.json({
      status: 'success',
      documentHash,
      ipfsCID,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
