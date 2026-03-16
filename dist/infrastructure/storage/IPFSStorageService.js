"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPFSStorageService = void 0;
const ipfs_http_client_1 = require("ipfs-http-client");
const EncryptionService_1 = require("../security/EncryptionService");
/**
 * IPFSStorageService implements IStorageService using IPFS Cluster.
 * It ensures documents are encrypted before storage and pinned across the community network.
 */
class IPFSStorageService {
    constructor(ipfsUrl, encryptionKey, blockchainService) {
        this.client = (0, ipfs_http_client_1.create)({ url: ipfsUrl });
        this.encryptionService = new EncryptionService_1.EncryptionService(encryptionKey);
        this.blockchainService = blockchainService;
    }
    /**
     * Stores content in IPFS after AES-256 encryption.
     * @param content Original file content.
     * @returns Generated CID.
     */
    async store(content) {
        // 1. Encryption Layer (UU PDP Compliance)
        const encryptedData = this.encryptionService.encrypt(content);
        // 2. IPFS Cluster Upload
        const { cid } = await this.client.add(encryptedData, {
            pin: true, // Ensuring initial pinning
            cidVersion: 1,
        });
        const cidString = cid.toString();
        // 3. DePIN Pinning & Reward Logic (Async)
        this.triggerDePINPinning(cidString).catch(err => console.error(`DePIN Pinning failed for ${cidString}:`, err));
        return cidString;
    }
    /**
     * Retrieves and decrypts content from IPFS.
     * @param cid Document CID.
     * @returns Decrypted original content.
     */
    async retrieve(cid) {
        const chunks = [];
        for await (const chunk of this.client.cat(cid)) {
            chunks.push(chunk);
        }
        const encryptedData = Buffer.concat(chunks);
        // Integrity Check & Decryption
        return this.encryptionService.decrypt(encryptedData);
    }
    /**
     * Mock logic for DePIN Pinning and reward distribution.
     * In a real implementation, this would communicate with a P2P orchestration layer
     * or a smart contract to notify stakers to pin the new CID.
     */
    async triggerDePINPinning(cid) {
        console.log(`[DePIN] Broadcasting pinning request for CID: ${cid}`);
        // Simulate reward distribution to stakers (SATYA token)
        // In Lisk SDK, this would involve calling a command or internal method
        // to credit stakers based on their storage contribution.
        await this.distributeSatyaRewards(cid);
    }
    async distributeSatyaRewards(cid) {
        console.log(`[SATYA] Distributing rewards to stakers pinning ${cid}`);
        await this.blockchainService.distributeStorageReward(cid);
    }
}
exports.IPFSStorageService = IPFSStorageService;
