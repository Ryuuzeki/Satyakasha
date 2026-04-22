import { NextRequest, NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { registerMockDocument } from "@/lib/mockDb";

// Initialize Snap API client
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { documentHash, ipfsCID, institutionName, recipientName } = body;

    if (!documentHash || !ipfsCID || !institutionName || !recipientName) {
      return NextResponse.json(
        { error: "Semua parameter wajib disertakan." },
        { status: 400 }
      );
    }

    // Buat order ID unik (menggunakan hash sebagian & timestamp)
    const orderId = `DOC-${documentHash.substring(0, 8)}-${Date.now()}`;

    const parameters = {
      transaction_details: {
        order_id: orderId,
        gross_amount: 15000, 
      },
      item_details: [
        {
          id: "DOC_VERIFICATION",
          price: 15000,
          quantity: 1,
          name: "Satyakasha Financial Document Audit",
          category: "Audit & Ledger",
        },
      ],
      // Karena batas Midtrans hanya 3 custom_field, kita gabungkan menjadi 2 field.
      custom_field1: `${documentHash}|${ipfsCID}`,
      custom_field2: `${institutionName}|${recipientName}`,
    };

    // Mock Mode if keys are placeholders (for MVP testing)
    if (!process.env.MIDTRANS_SERVER_KEY || process.env.MIDTRANS_SERVER_KEY.includes("YOUR_SERVER_KEY")) {
      // Register in mock DB so public verification works
      registerMockDocument({
        documentHash,
        ipfsCID,
        institutionName,
        recipientName,
        registeredBy: "MockRelayer-" + institutionName,
        timestamp: Date.now()
      });

      return NextResponse.json({
        token: "MOCK_SNAP_TOKEN_" + Date.now(),
        redirect_url: "#",
        order_id: orderId,
        isMock: true
      });
    }

    const transaction = await snap.createTransaction(parameters);
    
    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      order_id: orderId,
    });
  } catch (error: any) {
    console.error("Midtrans Checkout Error:", error);
    return NextResponse.json(
      { error: "Gagal membuat transaksi", details: error.message },
      { status: 500 }
    );
  }
}
