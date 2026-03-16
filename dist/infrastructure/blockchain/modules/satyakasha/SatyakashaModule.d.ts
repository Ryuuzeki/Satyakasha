import { BaseModule, ModuleInitArgs, ModuleMetadata } from 'lisk-sdk';
import { AnchorDocumentCommand } from './commands/AnchorDocumentCommand';
import { DistributeRewardCommand } from './commands/DistributeRewardCommand';
/**
 * SatyakashaModule handles the core logic of the Satyakasha sidechain.
 */
export declare class SatyakashaModule extends BaseModule {
    commands: (AnchorDocumentCommand | DistributeRewardCommand)[];
    constructor();
    name: string;
    endpoint: {};
    events: never[];
    metadata(): ModuleMetadata;
    init(_args: ModuleInitArgs): Promise<void>;
    /**
     * Internal logic for the Smart Treasury.
     * This module handles distribution of incentives to validators.
     * Fulfills Requirement 3: Smart Treasury Logic.
     */
    rewardValidators(context: any): Promise<void>;
}
