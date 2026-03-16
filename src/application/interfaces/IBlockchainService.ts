/**
 * IBlockchainService defines the contract for interacting with the Satyakasha Sidechain.
 * Following Clean Architecture, this interface resides in the Application Layer.
 */
export interface IBlockchainService {
    /**
     * Anchors an IPFS CID to the blockchain.
     * @param cid - The Content Identifier from IPFS.
     * @returns The transaction ID of the anchoring operation.
     */
    anchorDocument(cid: string): Promise<string>;

    /**
     * Returns the current status of a transaction.
     * @param transactionId - The ID of the transaction to check.
     */
    getTransactionStatus(transactionId: string): Promise<string>;

    /**
     * Gets the balance of the Treasury for gas fee monitoring.
     */
    getTreasuryBalance(): Promise<bigint>;

    /**
     * Records a storage proof and distributes rewards to the DePIN node.
     * @param cid - The CID of the stored document.
     */
    distributeStorageReward(cid: string): Promise<string>;
}
