import { IQRCodeService } from '../interfaces/IQRCodeService';
import { GenerateQRCodeRequest, GenerateQRCodeResponse } from '../dtos/QRCodeDTO';
export declare class GenerateQRCodeUseCase {
    private qrCodeService;
    constructor(qrCodeService: IQRCodeService);
    execute(request: GenerateQRCodeRequest): Promise<GenerateQRCodeResponse>;
}
