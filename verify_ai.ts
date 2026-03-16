import { DuplicateGuardAI } from './src/infrastructure/ai/DuplicateGuardAI.ts';
import { DocumentType } from './src/domain/enums/DocumentType.ts';

async function testDuplicateGuard() {
  const ai = new DuplicateGuardAI();

  const testCases = [
    {
      name: 'Clean Academic Document',
      type: DocumentType.ACADEMIC,
      metadata: new Map<string, any>([
        ['studentId', 'STU123'],
        ['gpa', 3.8],
        ['graduationDate', '2023-06-15']
      ]),
      cid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco'
    },
    {
      name: 'Anomalous Academic Document (Invalid GPA)',
      type: DocumentType.ACADEMIC,
      metadata: new Map<string, any>([
        ['studentId', 'STU456'],
        ['gpa', 5.5], // Anomalous
        ['graduationDate', '2023-06-15']
      ]),
      cid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco'
    },
    {
      name: 'Clean Legal Document',
      type: DocumentType.LEGAL,
      metadata: new Map<string, any>([
        ['nik', '1234567890123456'],
        ['issueDate', '2022-01-01']
      ]),
      cid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco'
    },
    {
      name: 'Fraudulent Legal Document (Missing NIK & Invalid CID)',
      type: DocumentType.LEGAL,
      metadata: new Map<string, any>([
        ['issueDate', '2022-01-01']
      ]),
      cid: 'short-cid'
    },
    {
      name: 'Duplicate Legal Document',
      type: DocumentType.LEGAL,
      metadata: new Map<string, any>([
        ['nik', 'DUPLICATE_TRIGGER_123'],
        ['issueDate', '2022-01-01']
      ]),
      cid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco'
    }
  ];

  console.log('--- DuplicateGuard AI Verification ---');
  for (const tc of testCases) {
    console.log(`\nTest Case: ${tc.name}`);
    const result = await ai.validate(tc.cid, tc.metadata, tc.type);
    console.log(`Status: ${result.isValid ? 'VALID' : 'INVALID'}`);
    console.log(`Confidence Score: ${(result.confidenceScore * 100).toFixed(2)}%`);
    console.log(`Risk Analysis: ${result.riskAnalysis}`);
    if (result.anomalies.length > 0) {
      console.log('Anomalies:');
      result.anomalies.forEach(a => console.log(` - [${a.severity.toUpperCase()}] ${a.code}: ${a.message}`));
    }
  }
}

testDuplicateGuard().catch(console.error);
