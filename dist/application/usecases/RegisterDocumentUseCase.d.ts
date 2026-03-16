import { IBlockchainService } from '../interfaces/IBlockchainService';
import { IStorageService } from '../interfaces/IStorageService';
import { IAccountService } from '../interfaces/IAccountService';
import { RegisterDocumentRequest, RegisterDocumentResponse } from '../dtos/RegisterDocumentDTO';
export declare class RegisterDocumentUseCase {
    private blockchainService;
    private storageService;
    private accountService;
    constructor(blockchainService: IBlockchainService, storageService: IStorageService, accountService: IAccountService);
    execute(request: RegisterDocumentRequest): Promise<RegisterDocumentResponse>;
    private processRegistration;
}
