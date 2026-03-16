import * as crypto from 'crypto';
import { IBlockchainService } from '../interfaces/IBlockchainService';
import { IStorageService } from '../interfaces/IStorageService';
import { IAccountService } from '../interfaces/IAccountService';
import { RegisterDocumentRequest, RegisterDocumentResponse } from '../dtos/RegisterDocumentDTO';

export class RegisterDocumentUseCase {
    constructor(
        private blockchainService: IBlockchainService,
        private storageService: IStorageService,
        private accountService: IAccountService
    ) {}

    async execute(request: RegisterDocumentRequest): Promise<RegisterDocumentResponse> {
        // 1. Gas Fee Abstraction - Check Balance
        const fee = await this.accountService.getCurrentRegistrationFee();
        const hasBalance = await this.accountService.hasSufficientBalance(request.institutionId, fee);

        if (!hasBalance) {
            throw new Error('Insufficient balance in Rupiah.');
        }

        // 2. Immediate Response for Asynchronous Processing
        const jobId = crypto.randomUUID();
        
        // Start background process
        this.processRegistration(jobId, request, fee).catch(console.error);

        return {
            jobId,
            status: 'pending',
            message: 'Document registration started successfully.'
        };
    }

    private async processRegistration(jobId: string, request: RegisterDocumentRequest, fee: number): Promise<void> {
        try {
            // Deduct balance first (Commitment)
            await this.accountService.deductBalance(request.institutionId, fee);

            // 3. Store document in IPFS/DePIN
            const cid = await this.storageService.saveDocument(request.payload);

            // 4. Anchor to Blockchain
            await this.blockchainService.anchorDocument(cid);

            // Log completion (In real world, update a job repository)
            console.log(`Job ${jobId} completed successfully for CID: ${cid}`);
        } catch (error) {
            console.error(`Job ${jobId} failed:`, error);
            // Handle rollback or error status update
        }
    }
}
