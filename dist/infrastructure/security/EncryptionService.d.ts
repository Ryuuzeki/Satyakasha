/**
 * EncryptionService provides AES-256-GCM encryption to ensure compliance with UU PDP.
 * It handles the encryption of document buffers before they are stored on IPFS.
 */
export declare class EncryptionService {
    private readonly algorithm;
    private readonly key;
    constructor(masterKey: string);
    /**
     * Encrypts the provided content.
     * @param content The data to encrypt.
     * @returns A Buffer containing IV + AuthTag + EncryptedData.
     */
    encrypt(content: Buffer | Uint8Array): Buffer;
    /**
     * Decrypts the provided encrypted content.
     * @param encryptedData The data to decrypt (IV + Tag + Data).
     * @returns The original content.
     */
    decrypt(encryptedData: Buffer | Uint8Array): Buffer;
}
