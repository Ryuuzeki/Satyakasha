import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
// Pastikan ENCRYPTION_KEY memiliki panjang tepat 32 karakter
let keyString = process.env.ENCRYPTION_KEY || 'SatyakashaDefaultBankKey32Bytes!';
if (keyString.length !== 32) {
  console.warn("ENCRYPTION_KEY length is not 32. Falling back to default key.");
  keyString = 'SatyakashaDefaultBankKey32Bytes!';
}
const ENCRYPTION_KEY = Buffer.from(keyString, 'utf-8');
const IV_LENGTH = 16;

/**
 * Enkripsi file buffer mentah menggunakan AES-256-CBC.
 * Hasilnya: [ 16 bytes IV ] + [ Encrypted Data ]
 */
export function encryptBuffer(buffer: Buffer): Buffer {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return Buffer.concat([iv, encrypted]);
}

/**
 * Dekripsi file buffer terenkripsi mengembalikan buffer asli.
 */
export function decryptBuffer(buffer: Buffer): Buffer {
  const iv = buffer.subarray(0, IV_LENGTH);
  const encryptedData = buffer.subarray(IV_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
}
