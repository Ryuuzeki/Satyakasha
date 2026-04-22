import { NextResponse } from 'next/server';
import crypto from 'crypto';
import pinataSDK from '@pinata/sdk';
import { encryptBuffer } from '@/lib/encryption';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
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
        const aiResult = await aiResponse.json();
        
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
    } catch (aiErr: any) {
      console.warn("AI DuplicateGuard service sedang offline atau tidak dapat dijangkau. Bekerja dalam mode Fallback...", aiErr.message);
    }

    // 3. Integrasi IPFS (Bank-Level Privacy via AES-256 Encryption)
    let ipfsCID = 'mock-cid-pending';
    
    if (process.env.PINATA_JWT) {
      try {
        const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });
        
        // Enkripsi file Biner sebelum masuk ke jaringan publik IPFS!
        const encryptedBuffer = encryptBuffer(buffer);

        // Buat stream dari buffer karena pinataSDK memerlukan readable stream dengan properties
        const { Readable } = require('stream');
        const stream = Readable.from(encryptedBuffer);
        // @ts-ignore
        stream.path = file.name ? `encrypted_${file.name}` : 'encrypted_document.bin'; 

        const options = {
            pinataMetadata: { name: file.name ? `ENC_${file.name}` : 'Satyakasha_Secure_Doc' }
        };

        const result = await pinata.pinFileToIPFS(stream, options);
        ipfsCID = result.IpfsHash;
      } catch (pinataError: any) {
        console.warn("Pinata upload failed:", pinataError.message);
        ipfsCID = 'fallback-mock-cid-' + Date.now();
      }
    } else {
      console.warn("PINATA_JWT is not set in environment.");
      ipfsCID = 'fallback-mock-cid-no-jwt';
    }

    // 4. Return respon JSON ke klien
    return NextResponse.json({
      status: 'success',
      documentHash,
      ipfsCID,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
