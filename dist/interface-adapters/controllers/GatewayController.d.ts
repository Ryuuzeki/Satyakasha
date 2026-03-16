import { RegisterDocumentUseCase } from '../../application/usecases/RegisterDocumentUseCase';
export declare class GatewayController {
    private registerDocumentUseCase;
    constructor(registerDocumentUseCase: RegisterDocumentUseCase);
    /**
     * POST /api/v1/gateway/register
     */
    registerDocument(req: any, res: any): Promise<void>;
    private isValidApiKey;
}
