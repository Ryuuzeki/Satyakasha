import { IQRCodeService } from '../interfaces/IQRCodeService';
import { GenerateQRCodeRequest, GenerateQRCodeResponse } from '../dtos/QRCodeDTO';

export class GenerateQRCodeUseCase {
    constructor(private qrCodeService: IQRCodeService) {}

    async execute(request: GenerateQRCodeRequest): Promise<GenerateQRCodeResponse> {
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
