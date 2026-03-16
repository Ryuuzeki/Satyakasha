import * as crypto from 'crypto';

/**
 * EncryptionService provides AES-256-GCM encryption to ensure compliance with UU PDP.
 * It handles the encryption of document buffers before they are stored on IPFS.
 */
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;

  constructor(masterKey: string) {
    // In production, the key should be derived from a secure secret using HKDF or similar
    this.key = crypto.scryptSync(masterKey, 'satyakasha-salt', 32);
  }

  /**
   * Encrypts the provided content.
   * @param content The data to encrypt.
   * @returns A Buffer containing IV + AuthTag + EncryptedData.
   */
  public encrypt(content: Buffer | Uint8Array): Buffer {
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
  public decrypt(encryptedData: Buffer | Uint8Array): Buffer {
    const data = Buffer.isBuffer(encryptedData) ? encryptedData : Buffer.from(encryptedData);
    
    const iv = data.subarray(0, 12);
    const authTag = data.subarray(12, 28);
    const encrypted = data.subarray(28);

    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);

    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  }
}
