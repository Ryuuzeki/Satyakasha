import { VerifyDocumentUseCase } from '../../application/usecases/VerifyDocumentUseCase';

export class VerificationController {
    constructor(private verifyDocumentUseCase: VerifyDocumentUseCase) {}

    /**
     * GET /api/v1/verify/:referenceId
     */
    async verify(req: any, res: any): Promise<void> {
        try {
            const { referenceId } = req.params;

            if (!referenceId) {
                res.status(400).json({ error: 'Reference ID is required' });
                return;
            }

            const startTime = Date.now();
            const response = await this.verifyDocumentUseCase.execute({ qrCodeRef: referenceId });
            const endTime = Date.now();

            // Performance check: ensure < 5s as per requirements
            const duration = (endTime - startTime) / 1000;
            console.log(`Verification completed in ${duration}s`);

            res.status(200).json(response);
        } catch (error: any) {
            res.status(404).json({ error: 'Document not found or invalid reference' });
        }
    }
}
