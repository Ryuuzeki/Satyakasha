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
exports.EncryptionService = void 0;
const crypto = __importStar(require("crypto"));
/**
 * EncryptionService provides AES-256-GCM encryption to ensure compliance with UU PDP.
 * It handles the encryption of document buffers before they are stored on IPFS.
 */
class EncryptionService {
    constructor(masterKey) {
        this.algorithm = 'aes-256-gcm';
        // In production, the key should be derived from a secure secret using HKDF or similar
        this.key = crypto.scryptSync(masterKey, 'satyakasha-salt', 32);
    }
    /**
     * Encrypts the provided content.
     * @param content The data to encrypt.
     * @returns A Buffer containing IV + AuthTag + EncryptedData.
     */
    encrypt(content) {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
        const input = Buffer.isBuffer(content) ? content : Buffer.from(content);
        const encrypted = Buffer.concat([cipher.update(input), cipher.final()]);
        const authTag = cipher.getAuthTag();
        // Package as [IV(12)][Tag(16)][Data]
        return Buffer.concat([iv, authTag, encrypted]);
    }
    /**
     * Decrypts the provided encrypted content.
     * @param encryptedData The data to decrypt (IV + Tag + Data).
     * @returns The original content.
     */
    decrypt(encryptedData) {
        const data = Buffer.isBuffer(encryptedData) ? encryptedData : Buffer.from(encryptedData);
        const iv = data.subarray(0, 12);
        const authTag = data.subarray(12, 28);
        const encrypted = data.subarray(28);
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
        decipher.setAuthTag(authTag);
        return Buffer.concat([decipher.update(encrypted), decipher.final()]);
    }
}
exports.EncryptionService = EncryptionService;
