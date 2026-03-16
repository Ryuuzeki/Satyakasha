import { IBlockchainService } from '../../application/interfaces/IBlockchainService';
/**
 * LiskBlockchainService provides the concrete implementation for blockchain interactions.
 * It abstracts away gas fees using a Treasury Account and implements transaction batching.
 */
export declare class LiskBlockchainService implements IBlockchainService {
    private _client?;
    private _treasuryPrivateKey;
    private _transactionQueue;
    private _batchSize;
    private _batchInterval;
    private _rpcEndpoint;
    constructor(rpcEndpoint: string, treasurySecret: string);
    private getClient;
    /**
     * Anchors a CID. Instead of direct execution, we add it to a batch queue.
     * This fulfills the Requirement 3 (Batching Transaction).
     */
    anchorDocument(cid: string): Promise<string>;
    /**
     * Processes batches of CIDs and sends them to the sidechain.
     * Fulfills Gas Fee Abstraction: Treasury account signs and pays.
     */
    private _processBatch;
    getTransactionStatus(transactionId: string): Promise<string>;
    getTreasuryBalance(): Promise<bigint>;
    /**
     * Fulfills Smart Treasury Logic: Distributes rewards to DePIN nodes for storage.
     */
    distributeStorageReward(cid: string): Promise<string>;
}
