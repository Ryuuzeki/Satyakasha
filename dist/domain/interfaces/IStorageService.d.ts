export interface IStorageService {
    /**
     * Stores content in a decentralized storage network (IPFS/DePIN).
     * @param content The file content as a Uint8Array.
     * @returns The Content Identifier (CID).
     */
    store(content: Uint8Array): Promise<string>;
    /**
     * Retrieves content from decentralized storage.
     * @param cid The Content Identifier.
     * @returns The content as a Uint8Array.
     */
    retrieve(cid: string): Promise<Uint8Array>;
}
