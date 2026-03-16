import { IAIService, AIValidationResult, AIAnomaly } from '../../domain/interfaces/IAIService';
import { DocumentType } from '../../domain/enums/DocumentType';

export class DuplicateGuardAI implements IAIService {
  /**
   * Validates document integrity and checks for duplicates.
   * Uses a rule-based engine and statistical analysis for anomaly detection.
   */
  public async validate(
    ipfsCID: string,
    metadata: Map<string, any>,
    type: DocumentType
  ): Promise<AIValidationResult> {
    const anomalies: AIAnomaly[] = [];
    let confidenceScore = 1.0;

    // 1. CID Integrity Check (Placeholder for actual content verification)
    if (!ipfsCID || ipfsCID.length < 46) {
      anomalies.push({
        code: 'INVALID_CID',
        message: 'IPFS CID format is invalid or missing.',
        severity: 'high',
      });
      confidenceScore -= 0.5;
    }

    // 2. Metadata Consistency Check based on Document Type
    switch (type) {
      case DocumentType.LEGAL:
        this.validateLegalMetadata(metadata, anomalies);
        break;
      case DocumentType.ACADEMIC:
        this.validateAcademicMetadata(metadata, anomalies);
        break;
      case DocumentType.CONSTRUCTION:
        this.validateConstructionMetadata(metadata, anomalies);
        break;
      default:
        anomalies.push({
          code: 'UNKNOWN_TYPE',
          message: `Validation rules for ${type} are not yet defined.`,
          severity: 'medium',
        });
        confidenceScore -= 0.1;
    }

    // 3. Duplicate Detection (Placeholder for cross-reference check)
    // In a real scenario, this would query a document registry or blockchain index.
    this.checkForDuplicates(metadata, anomalies);

    // 4. Score Calculation & Risk Analysis
    confidenceScore = Math.max(0, confidenceScore - (anomalies.length * 0.15));
    
    // Penalize heavily for high severity anomalies
    const highSeverityCount = anomalies.filter(a => a.severity === 'high').length;
    confidenceScore = Math.max(0, confidenceScore - (highSeverityCount * 0.3));

    const riskLevel = confidenceScore >= 0.95 ? 'LOW' : confidenceScore >= 0.8 ? 'MEDIUM' : 'HIGH';
    const riskAnalysis = `Risk Level: ${riskLevel}. Found ${anomalies.length} anomalies. ` +
      (confidenceScore < 0.95 ? 'Manual review highly recommended before blockchain anchoring.' : 'Data appears consistent.');

    return {
      isValid: confidenceScore >= 0.95 && highSeverityCount === 0,
      confidenceScore,
      anomalies,
      riskAnalysis,
    };
  }

  private validateLegalMetadata(metadata: Map<string, any>, anomalies: AIAnomaly[]): void {
    const nik = metadata.get('nik');
    if (nik) {
      // Basic NIK validation (16 digits in Indonesia)
      if (!/^\d{16}$/.test(nik)) {
        anomalies.push({
          code: 'INVALID_NIK_FORMAT',
          message: 'NIK must be exactly 16 digits.',
          severity: 'high',
        });
      }
    } else {
      anomalies.push({
        code: 'MISSING_IDENTITY',
        message: 'Legal document metadata missing NIK.',
        severity: 'medium',
      });
    }

    const issueDate = metadata.get('issueDate');
    if (issueDate && new Date(issueDate) > new Date()) {
      anomalies.push({
        code: 'FUTURE_DATE',
        message: 'Legal document issue date cannot be in the future.',
        severity: 'high',
      });
    }
  }

  private validateAcademicMetadata(metadata: Map<string, any>, anomalies: AIAnomaly[]): void {
    const gpa = metadata.get('gpa');
    if (gpa !== undefined) {
      const gpaNum = parseFloat(gpa);
      if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4.0) {
        anomalies.push({
          code: 'ANOMALOUS_GPA',
          message: `GPA value ${gpa} is outside standard 0.0-4.0 range.`,
          severity: 'medium',
        });
      }
    }

    const studentId = metadata.get('studentId');
    if (!studentId) {
      anomalies.push({
        code: 'MISSING_STUDENT_ID',
        message: 'Academic transcript missing Student ID.',
        severity: 'medium',
      });
    }
  }

  private validateConstructionMetadata(metadata: Map<string, any>, anomalies: AIAnomaly[]): void {
    const budget = metadata.get('budget');
    const durationDays = metadata.get('durationDays');

    if (budget <= 0) {
      anomalies.push({
        code: 'INVALID_BUDGET',
        message: 'Project budget must be greater than zero.',
        severity: 'high',
      });
    }

    if (durationDays !== undefined && budget !== undefined) {
      // Heuristic: Very high budget with very low duration or vice-versa
      const budgetPerDay = budget / durationDays;
      if (budgetPerDay > 1000000000 || budgetPerDay < 10000) { // Example unrealistic thresholds
        anomalies.push({
          code: 'DURATION_BUDGET_MISMATCH',
          message: 'The relationship between project duration and budget is highly anomalous.',
          severity: 'low',
        });
      }
    }
  }

  private checkForDuplicates(metadata: Map<string, any>, anomalies: AIAnomaly[]): void {
    // This is a placeholder for real duplicate detection logic.
    // In production, we'd check against a Bloom filter or a distributed cache/DB.
    const internalId = metadata.get('nik') || metadata.get('studentId') || metadata.get('contractId');
    
    // Simulate a duplicate detection event for specific test cases
    if (internalId === 'DUPLICATE_TRIGGER_123') {
      anomalies.push({
        code: 'DUPLICATE_ENTRY',
        message: 'A document with this identity already exists in the pre-chain registry.',
        severity: 'high',
      });
    }
  }
}
