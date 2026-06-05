import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import {
  registerMockDocument,
  getInstitutionData,
  updateCredits,
} from "@/lib/mockDb";

const SESSION_SECRET =
  process.env.SESSION_SECRET || "SuperSecretSessionToken123456789!";

/**
 * POST /api/register
 *
 * Menggantikan alur Checkout + Webhook Midtrans.
 * Langkah:
 *   1. Validasi session cookie (pastikan user login)
 *   2. Cek kuota institusi
 *   3. Kurangi 1 credit
 *   4. Daftarkan dokumen ke mock database
 *   5. Return receipt data
 */
export async function POST(req: NextRequest) {
  try {
    // ── 1. Validasi Session ──────────────────────────────────────────
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Tidak terautentikasi. Silakan login kembali." },
        { status: 401 }
      );
    }

    const [base64Data, signature] = token.split(".");

    if (!base64Data || !signature) {
      return NextResponse.json(
        { error: "Format token tidak valid." },
        { status: 401 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(base64Data)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { error: "Token tidak sah." },
        { status: 401 }
      );
    }

    let institutionName: string;
    try {
      const sessionStr = Buffer.from(base64Data, "base64").toString("utf-8");
      const session = JSON.parse(sessionStr);

      if (session.expiresAt && session.expiresAt < Date.now()) {
        return NextResponse.json(
          { error: "Sesi telah kadaluarsa. Silakan login kembali." },
          { status: 401 }
        );
      }

      institutionName = session.institutionName;
    } catch {
      return NextResponse.json(
        { error: "Gagal membaca data sesi." },
        { status: 401 }
      );
    }

    // ── 2. Parse Request Body ────────────────────────────────────────
    const body = await req.json();
    const { documentHash, ipfsCID, recipientName } = body;

    if (!documentHash || !ipfsCID || !recipientName) {
      return NextResponse.json(
        { error: "Semua parameter (documentHash, ipfsCID, recipientName) wajib disertakan." },
        { status: 400 }
      );
    }

    // ── 3. Cek & Kurangi Kuota ───────────────────────────────────────
    const institutionData = getInstitutionData(institutionName);

    if (institutionData.credits <= 0) {
      return NextResponse.json(
        {
          error:
            "Kuota dokumen Anda telah habis. Silakan upgrade paket untuk melanjutkan.",
        },
        { status: 403 }
      );
    }

    const success = updateCredits(institutionName, -1);
    if (!success) {
      return NextResponse.json(
        { error: "Gagal mengurangi kuota. Saldo tidak cukup." },
        { status: 403 }
      );
    }

    // ── 4. Daftarkan Dokumen ─────────────────────────────────────────
    const orderId = `DOC-${documentHash.substring(0, 8)}-${Date.now()}`;

    registerMockDocument({
      documentHash,
      ipfsCID,
      institutionName,
      recipientName,
      registeredBy: "Relayer-" + institutionName,
      timestamp: Date.now(),
    });

    // ── 5. Return Receipt ────────────────────────────────────────────
    const updatedData = getInstitutionData(institutionName);

    return NextResponse.json({
      status: "registered",
      hash: documentHash,
      cid: ipfsCID,
      txHash: orderId,
      remainingCredits: updatedData.credits,
    });
  } catch (error: unknown) {
    console.error("Register Error:", error);
    return NextResponse.json(
      {
        error: "Gagal mendaftarkan dokumen.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
