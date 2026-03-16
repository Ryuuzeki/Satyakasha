import { RegisterDocumentRequest } from '../../application/dtos/RegisterDocumentDTO';
import { RegisterDocumentUseCase } from '../../application/usecases/RegisterDocumentUseCase';

export class GatewayController {
    constructor(private registerDocumentUseCase: RegisterDocumentUseCase) {}

    /**
     * POST /api/v1/gateway/register
     */
    async registerDocument(req: any, res: any): Promise<void> {
        try {
            const { institutionId, apiKey, documentType, payload } = req.body;

            // Simple API Key Validation (In production, use a dedicated Auth Service)
            if (!this.isValidApiKey(institutionId, apiKey)) {
                res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
                return;
            }

            const request: RegisterDocumentRequest = {
                institutionId,
                apiKey,
                documentType,
                payload
            };

            const response = await this.registerDocumentUseCase.execute(request);
            res.status(202).json(response);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    private isValidApiKey(institutionId: string, apiKey: string): boolean {
        // Placeholder check
        return apiKey.startsWith('sk_live_');
    }
}
