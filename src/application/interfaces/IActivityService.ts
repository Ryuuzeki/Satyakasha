export interface IActivityService {
    /**
     * Gets statistics for a specific institution.
     */
    getInstitutionStats(institutionId: string): Promise<{
        totalDocuments: number;
        verifiedCount: number;
        failedCount: number;
        remainingBalanceRupiah: number;
    }>;

    /**
     * Gets recent verification activities.
     */
    getActivities(filters: { institutionId?: string, verifierId?: string }): Promise<Array<{
        id: string;
        documentId: string;
        event: 'registration' | 'verification';
        status: string;
        timestamp: string;
    }>>;
}
