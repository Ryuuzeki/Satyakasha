import { BaseCommand, CommandExecuteContext, CommandVerifyContext, VerificationResult } from 'lisk-sdk';
export interface RewardParams {
    cid: string;
    rewardType: string;
}
export declare const rewardParamsSchema: {
    $id: string;
    type: string;
    properties: {
        cid: {
            dataType: string;
            fieldNumber: number;
        };
        rewardType: {
            dataType: string;
            fieldNumber: number;
        };
    };
    required: string[];
};
/**
 * DistributeRewardCommand handles the distribution of SATYA tokens to DePIN nodes.
 */
export declare class DistributeRewardCommand extends BaseCommand {
    schema: {
        $id: string;
        type: string;
        properties: {
            cid: {
                dataType: string;
                fieldNumber: number;
            };
            rewardType: {
                dataType: string;
                fieldNumber: number;
            };
        };
        required: string[];
    };
    verify(_context: CommandVerifyContext<RewardParams>): Promise<VerificationResult>;
    execute(context: CommandExecuteContext<RewardParams>): Promise<void>;
}
