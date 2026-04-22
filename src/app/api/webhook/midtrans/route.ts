import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { liskSepolia } from "viem/chains";
import { registryABI } from "@/lib/abi";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      custom_field1,
      custom_field2,
    } = body;

    // 1. Verify Signature Key for Security
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const hashSignature = crypto
      .createHash("sha512")
      .update(order_id + status_code + gross_amount + serverKey)
      .digest("hex");

    if (hashSignature !== signature_key) {
      console.error("Invalid Midtrans Signature");
      return NextResponse.json({ error: "Invalid Signature" }, { status: 403 });
    }

    // Unpack gabungan field dari Checkout API
    const [documentHash, ipfsCID] = (custom_field1 || "|").split("|");
    const [institutionName, recipientName] = (custom_field2 || "|").split("|");

    // 2. Check Transaction Status
    if (transaction_status === "settlement" || transaction_status === "capture") {
      console.log(`Payment settled for ${order_id}. Initiating Gasless Minting...`);

      const privateKey = process.env.RELAYER_PRIVATE_KEY;
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

      if (!privateKey || !contractAddress) {
        throw new Error("Relayer credentials not configured");
      }

      // 3. Setup Viem Clients for Lisk Sepolia
      const account = privateKeyToAccount(`0x${privateKey.replace('0x', '')}`);
      
      const publicClient = createPublicClient({
        chain: liskSepolia,
        transport: http(),
      });

      const walletClient = createWalletClient({
        account,
        chain: liskSepolia,
        transport: http(),
      });

      // 4. Send Transaction as the Relayer
      const { request } = await publicClient.simulateContract({
        address: contractAddress as `0x${string}`,
        abi: registryABI,
        functionName: "registerDocument",
        args: [
          documentHash, 
          ipfsCID, 
          institutionName || "Unknown Institution", 
          recipientName || "Unknown Recipient"
        ],
        account,
      });

      const txHash = await walletClient.writeContract(request);
      console.log(`Successfully minted document ${documentHash}. TxHash: ${txHash}`);

      // Optional: Store txHash in Database alongside the order_id for user retrieval.
      // (For MVP, the frontend can query the smart contract or block explorer using docHash).
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Server Error", details: error.message }, { status: 500 });
  }
}
