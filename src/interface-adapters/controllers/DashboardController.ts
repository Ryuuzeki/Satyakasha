import { IActivityService } from '../../application/interfaces/IActivityService';

export class DashboardController {
    constructor(private activityService: IActivityService) {}

    /**
     * GET /api/v1/dashboard/stats
     * Used by Institutions to see their own stats.
     */
    async getStats(req: any, res: any): Promise<void> {
        try {
            const institutionId = req.user?.institutionId;

            if (!institutionId) {
                res.status(401).json({ error: 'Unauthorized: Institution ID mission' });
                return;
            }

            const stats = await this.activityService.getInstitutionStats(institutionId);
            res.status(200).json(stats);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * GET /api/v1/dashboard/activities
     * Multi-tenant: 
     * - Institutions see activities for their documents.
     * - Verifiers see their own scan history.
     */
    async getActivities(req: any, res: any): Promise<void> {
        try {
            const userId = req.user?.id;
            const role = req.user?.role; // 'institution' | 'verifier'

            let filters = {};
            if (role === 'institution') {
                filters = { institutionId: req.user.institutionId };
            } else if (role === 'verifier') {
                filters = { verifierId: userId };
            }

            const activities = await this.activityService.getActivities(filters);
            res.status(200).json(activities);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
