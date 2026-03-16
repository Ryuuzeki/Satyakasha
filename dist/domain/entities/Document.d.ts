import { DocumentStatus } from '../enums/DocumentStatus';
import { DocumentType } from '../enums/DocumentType';
import { AIValidationResult } from '../interfaces/IAIService';
export interface DocumentProps {
    id: string;
    ownerId: string;
    documentType: DocumentType;
    ipfsCID: string;
    blockchainHash?: string;
    status: DocumentStatus;
    metadata: Map<string, any>;
    validationResult?: AIValidationResult;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Document {
    private props;
    constructor(props: DocumentProps);
    static create(props: Omit<DocumentProps, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Document;
    get id(): string;
    get ownerId(): string;
    get documentType(): DocumentType;
    get ipfsCID(): string;
    get blockchainHash(): string | undefined;
    get status(): DocumentStatus;
    get validationResult(): AIValidationResult | undefined;
    get metadata(): Map<string, any>;
    get createdAt(): Date;
    get updatedAt(): Date;
    markAsVerified(blockchainHash: string): void;
    setValidationResult(result: AIValidationResult): void;
    revoke(): void;
    updateMetadata(key: string, value: any): void;
}
