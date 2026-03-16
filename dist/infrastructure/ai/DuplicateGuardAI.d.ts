import { IAIService, AIValidationResult } from '../../domain/interfaces/IAIService';
import { DocumentType } from '../../domain/enums/DocumentType';
export declare class DuplicateGuardAI implements IAIService {
    /**
     * Validates document integrity and checks for duplicates.
     * Uses a rule-based engine and statistical analysis for anomaly detection.
     */
    validate(ipfsCID: string, metadata: Map<string, any>, type: DocumentType): Promise<AIValidationResult>;
    private validateLegalMetadata;
    private validateAcademicMetadata;
    private validateConstructionMetadata;
    private checkForDuplicates;
}
