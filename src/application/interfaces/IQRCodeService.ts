export interface IQRCodeService {
    /**
     * Generates a QR code and returns its base64 representation.
     */
    generate(data: string): Promise<string>;

    /**
     * Maps a reference ID to a CID for dynamic redirection.
     */
    createReference(cid: string): Promise<string>;

    /**
     * Resolves a reference ID back to a CID.
     */
    resolveReference(referenceId: string): Promise<string>;
}
