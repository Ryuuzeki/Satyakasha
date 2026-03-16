"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayController = void 0;
class GatewayController {
    constructor(registerDocumentUseCase) {
        this.registerDocumentUseCase = registerDocumentUseCase;
    }
    /**
     * POST /api/v1/gateway/register
     */
    async registerDocument(req, res) {
        try {
            const { institutionId, apiKey, documentType, payload } = req.body;
            // Simple API Key Validation (In production, use a dedicated Auth Service)
            if (!this.isValidApiKey(institutionId, apiKey)) {
                res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
                return;
            }
            const request = {
                institutionId,
                apiKey,
                documentType,
                payload
            };
            const response = await this.registerDocumentUseCase.execute(request);
            res.status(202).json(response);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    isValidApiKey(institutionId, apiKey) {
        // Placeholder check
        return apiKey.startsWith('sk_live_');
    }
}
exports.GatewayController = GatewayController;
