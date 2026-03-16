import { IActivityService } from '../../application/interfaces/IActivityService';
export declare class DashboardController {
    private activityService;
    constructor(activityService: IActivityService);
    /**
     * GET /api/v1/dashboard/stats
     * Used by Institutions to see their own stats.
     */
    getStats(req: any, res: any): Promise<void>;
    /**
     * GET /api/v1/dashboard/activities
     * Multi-tenant:
     * - Institutions see activities for their documents.
     * - Verifiers see their own scan history.
     */
    getActivities(req: any, res: any): Promise<void>;
}
