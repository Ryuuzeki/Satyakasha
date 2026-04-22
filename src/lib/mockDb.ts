export interface InstitutionData {
  plan: 'Starter' | 'Pro' | 'Enterprise';
  credits: number;
}

export interface DocumentRecord {
  documentHash: string;
  ipfsCID: string;
  institutionName: string;
  recipientName: string;
  registeredBy: string;
  timestamp: number;
}

// Gunakan globalThis agar state tidak hilang setiap kali Next.js HMR (Hot Module Replacement) di mode development
const db: Map<string, InstitutionData> = (globalThis as any).__mockDb || new Map();
const docDb: Map<string, DocumentRecord> = (globalThis as any).__mockDocDb || new Map();

if (process.env.NODE_ENV !== 'production') {
  (globalThis as any).__mockDb = db;
  (globalThis as any).__mockDocDb = docDb;
}

export function registerMockDocument(record: DocumentRecord) {
  docDb.set(record.documentHash, record);
}

export function getMockDocument(hash: string): DocumentRecord | undefined {
  return docDb.get(hash);
}

export function getInstitutionData(name: string): InstitutionData {
  if (!db.has(name)) {
    // Berikan Starter Plan gratis saat Institusi pertama kali diuntungkan (dideklarasikan)
    db.set(name, { plan: 'Starter', credits: 5 });
  }
  return db.get(name)!;
}

export function updateCredits(name: string, delta: number): boolean {
  const data = getInstitutionData(name);
  if (data.credits + delta < 0) {
    return false; // Saldo tidak cukup
  }
  data.credits += delta;
  db.set(name, data);
  return true;
}

export function upgradePlan(name: string, plan: 'Pro' | 'Enterprise', additionalCredits: number) {
  const data = getInstitutionData(name);
  data.plan = plan;
  data.credits += additionalCredits;
  db.set(name, data);
}
