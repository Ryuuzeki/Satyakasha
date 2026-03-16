import { DocumentType } from '../enums/DocumentType';
export interface AIAnomaly {
    code: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
}
export interface AIValidationResult {
    isValid: boolean;
    confidenceScore: number;
    anomalies: AIAnomaly[];
    riskAnalysis: string;
}
export interface IAIService {
    /**
     * Validates document integrity and checks for duplicates.
     * @param ipfsCID The content identifier of the file.
     * @param metadata Specific data for the document type.
     * @param type The type of document being validated.
     * @returns A detailed validation result including confidence score and anomalies.
     */
    validate(ipfsCID: string, metadata: Map<string, any>, type: DocumentType): Promise<AIValidationResult>;
}
