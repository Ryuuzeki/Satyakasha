export interface IStorageService {
    /**
     * Stores content and returns the CID.
     */
    saveDocument(content: any): Promise<string>;
    
    /**
     * Retrieves content by CID.
     */
    getDocument(cid: string): Promise<any>;
}
