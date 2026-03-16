import { IBlockchainService } from '../interfaces/IBlockchainService';
import { IQRCodeService } from '../interfaces/IQRCodeService';
import { IStorageService } from '../interfaces/IStorageService';
import { VerifyDocumentRequest, VerifyDocumentResponse } from '../dtos/VerifyDocumentDTO';
export declare class VerifyDocumentUseCase {
    private blockchainService;
    private storageService;
    private qrCodeService;
    constructor(blockchainService: IBlockchainService, storageService: IStorageService, qrCodeService: IQRCodeService);
    execute(request: VerifyDocumentRequest): Promise<VerifyDocumentResponse>;
}
