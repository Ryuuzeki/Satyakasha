export interface IBlockchainService {
    /**
     * Anchors a document hash to the blockchain.
     * @param documentId The unique identifier of the document.
     * @param hash The hash to be recorded.
     * @returns The transaction hash or proof of anchoring.
     */
    anchorHash(documentId: string, hash: string): Promise<string>;
    verifyHash(hash: string): Promise<boolean>;
}
