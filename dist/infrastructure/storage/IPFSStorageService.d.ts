import { IStorageService } from '../../domain/interfaces/IStorageService';
import { IBlockchainService } from '../../application/interfaces/IBlockchainService';
/**
 * IPFSStorageService implements IStorageService using IPFS Cluster.
 * It ensures documents are encrypted before storage and pinned across the community network.
 */
export declare class IPFSStorageService implements IStorageService {
    private client;
    private encryptionService;
    private blockchainService;
    constructor(ipfsUrl: string, encryptionKey: string, blockchainService: IBlockchainService);
    /**
     * Stores content in IPFS after AES-256 encryption.
     * @param content Original file content.
     * @returns Generated CID.
     */
    store(content: Buffer | Uint8Array): Promise<string>;
    /**
     * Retrieves and decrypts content from IPFS.
     * @param cid Document CID.
     * @returns Decrypted original content.
     */
    retrieve(cid: string): Promise<Uint8Array>;
    /**
     * Mock logic for DePIN Pinning and reward distribution.
     * In a real implementation, this would communicate with a P2P orchestration layer
     * or a smart contract to notify stakers to pin the new CID.
     */
    private triggerDePINPinning;
    private distributeSatyaRewards;
}
