"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = void 0;
const crypto = __importStar(require("crypto"));
const DocumentStatus_1 = require("../enums/DocumentStatus");
class Document {
    constructor(props) {
        this.props = props;
    }
    static create(props) {
        return new Document({
            ...props,
            id: crypto.randomUUID(), // Assuming a standard UUID generator is available or will be provided by infra
            status: DocumentStatus_1.DocumentStatus.PENDING_VALIDATION,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
    get id() {
        return this.props.id;
    }
    get ownerId() {
        return this.props.ownerId;
    }
    get documentType() {
        return this.props.documentType;
    }
    get ipfsCID() {
        return this.props.ipfsCID;
    }
    get blockchainHash() {
        return this.props.blockchainHash;
    }
    get status() {
        return this.props.status;
    }
    get validationResult() {
        return this.props.validationResult;
    }
    get metadata() {
        return new Map(this.props.metadata);
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    markAsVerified(blockchainHash) {
        if (this.props.status !== DocumentStatus_1.DocumentStatus.PENDING_VALIDATION) {
            throw new Error('Only pending documents can be verified');
        }
        if (this.props.validationResult && !this.props.validationResult.isValid) {
            throw new Error('Cannot verify a document with invalid AI validation results');
        }
        this.props.blockchainHash = blockchainHash;
        this.props.status = DocumentStatus_1.DocumentStatus.VERIFIED;
        this.props.updatedAt = new Date();
    }
    setValidationResult(result) {
        this.props.validationResult = result;
        this.props.updatedAt = new Date();
    }
    revoke() {
        this.props.status = DocumentStatus_1.DocumentStatus.REVOKED;
        this.props.updatedAt = new Date();
    }
    updateMetadata(key, value) {
        if (this.props.status !== DocumentStatus_1.DocumentStatus.PENDING_VALIDATION) {
            throw new Error('Metadata can only be updated while pending validation');
        }
        this.props.metadata.set(key, value);
        this.props.updatedAt = new Date();
    }
}
exports.Document = Document;
