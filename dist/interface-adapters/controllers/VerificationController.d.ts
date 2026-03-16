import { VerifyDocumentUseCase } from '../../application/usecases/VerifyDocumentUseCase';
export declare class VerificationController {
    private verifyDocumentUseCase;
    constructor(verifyDocumentUseCase: VerifyDocumentUseCase);
    /**
     * GET /api/v1/verify/:referenceId
     */
    verify(req: any, res: any): Promise<void>;
}
