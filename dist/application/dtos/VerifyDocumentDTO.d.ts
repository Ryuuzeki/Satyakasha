export interface VerifyDocumentRequest {
    qrCodeRef: string;
}
export interface VerifyDocumentResponse {
    isValid: boolean;
    cid: string;
    metadata: {
        documentId: string;
        institutionName: string;
        issuedAt: string;
        documentType: string;
    };
    blockchainProof: {
        transactionId: string;
        timestamp: number;
        blockHeight: number;
    };
}
