"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDocumentUseCase = void 0;
const crypto = __importStar(require("crypto"));
class RegisterDocumentUseCase {
    constructor(blockchainService, storageService, accountService) {
        this.blockchainService = blockchainService;
        this.storageService = storageService;
        this.accountService = accountService;
    }
    async execute(request) {
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
    async processRegistration(jobId, request, fee) {
        try {
            // Deduct balance first (Commitment)
            await this.accountService.deductBalance(request.institutionId, fee);
            // 3. Store document in IPFS/DePIN
            const cid = await this.storageService.saveDocument(request.payload);
            // 4. Anchor to Blockchain
            await this.blockchainService.anchorDocument(cid);
            // Log completion (In real world, update a job repository)
            console.log(`Job ${jobId} completed successfully for CID: ${cid}`);
        }
        catch (error) {
            console.error(`Job ${jobId} failed:`, error);
            // Handle rollback or error status update
        }
    }
}
exports.RegisterDocumentUseCase = RegisterDocumentUseCase;
