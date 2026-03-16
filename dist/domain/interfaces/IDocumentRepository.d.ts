import { Document } from '../entities/Document';
import { DocumentStatus } from '../enums/DocumentStatus';
export interface IDocumentRepository {
    save(document: Document): Promise<void>;
    findById(id: string): Promise<Document | null>;
    updateStatus(id: string, status: DocumentStatus): Promise<void>;
}
