"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateQRCodeUseCase = void 0;
class GenerateQRCodeUseCase {
    constructor(qrCodeService) {
        this.qrCodeService = qrCodeService;
    }
    async execute(request) {
        // 1. Create a dynamic reference ID for the CID
        const referenceId = await this.qrCodeService.createReference(request.cid);
        // 2. Generate the verification URL
        const verificationUrl = `https://satyakasha.id/v/${referenceId}`;
        // 3. Generate QR Code Base64
        const qrCodeBase64 = await this.qrCodeService.generate(verificationUrl);
        return {
            qrCodeUrl: verificationUrl,
            qrCodeBase64: qrCodeBase64,
            referenceId: referenceId
        };
    }
}
exports.GenerateQRCodeUseCase = GenerateQRCodeUseCase;
