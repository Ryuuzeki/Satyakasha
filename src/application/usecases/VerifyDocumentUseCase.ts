import { IBlockchainService } from '../interfaces/IBlockchainService';
import { IQRCodeService } from '../interfaces/IQRCodeService';
import { IStorageService } from '../interfaces/IStorageService';
import { VerifyDocumentRequest, VerifyDocumentResponse } from '../dtos/VerifyDocumentDTO';

export class VerifyDocumentUseCase {
    constructor(
        private blockchainService: IBlockchainService,
        private storageService: IStorageService,
        private qrCodeService: IQRCodeService
    ) {}

    async execute(request: VerifyDocumentRequest): Promise<VerifyDocumentResponse> {
        // 1. Resolve reference to CID
        const cid = await this.qrCodeService.resolveReference(request.qrCodeRef);

        // 2. Verify on Blockchain
        const status = await this.blockchainService.getTransactionStatus(cid); // Using CID as anchor reference here
        
        // 3. Fetch Metadata from Storage
        const metadata = await this.storageService.getDocument(cid);

        const isValid = status === 'verified' || status === 'confirmed';

        return {
            isValid,
            cid,
            metadata: {
                documentId: metadata.id || 'N/A',
                institutionName: metadata.institution || 'Unknown',
                issuedAt: metadata.timestamp || new Date().toISOString(),
                documentType: metadata.type || 'Generic'
            },
            blockchainProof: {
                transactionId: `tx_${cid.substring(0, 8)}`,
                timestamp: Date.now(),
                blockHeight: 1234567 // Mock or fetch from status
            }
        };
    }
}
