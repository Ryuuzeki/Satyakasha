import * as crypto from 'crypto';
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

export class Document {
  private props: DocumentProps;

  constructor(props: DocumentProps) {
    this.props = props;
  }

  public static create(props: Omit<DocumentProps, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Document {
    return new Document({
      ...props,
      id: crypto.randomUUID(), // Assuming a standard UUID generator is available or will be provided by infra
      status: DocumentStatus.PENDING_VALIDATION,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get documentType(): DocumentType {
    return this.props.documentType;
  }

  get ipfsCID(): string {
    return this.props.ipfsCID;
  }

  get blockchainHash(): string | undefined {
    return this.props.blockchainHash;
  }

  get status(): DocumentStatus {
    return this.props.status;
  }

  get validationResult(): AIValidationResult | undefined {
    return this.props.validationResult;
  }

  get metadata(): Map<string, any> {
    return new Map(this.props.metadata);
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public markAsVerified(blockchainHash: string): void {
    if (this.props.status !== DocumentStatus.PENDING_VALIDATION) {
      throw new Error('Only pending documents can be verified');
    }
    
    if (this.props.validationResult && !this.props.validationResult.isValid) {
      throw new Error('Cannot verify a document with invalid AI validation results');
    }

    this.props.blockchainHash = blockchainHash;
    this.props.status = DocumentStatus.VERIFIED;
    this.props.updatedAt = new Date();
  }

  public setValidationResult(result: AIValidationResult): void {
    this.props.validationResult = result;
    this.props.updatedAt = new Date();
  }

  public revoke(): void {
    this.props.status = DocumentStatus.REVOKED;
    this.props.updatedAt = new Date();
  }

  public updateMetadata(key: string, value: any): void {
    if (this.props.status !== DocumentStatus.PENDING_VALIDATION) {
       throw new Error('Metadata can only be updated while pending validation');
    }
    this.props.metadata.set(key, value);
    this.props.updatedAt = new Date();
  }
}
