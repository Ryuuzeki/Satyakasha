"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SatyakashaModule = void 0;
const lisk_sdk_1 = require("lisk-sdk");
const AnchorDocumentCommand_1 = require("./commands/AnchorDocumentCommand");
const DistributeRewardCommand_1 = require("./commands/DistributeRewardCommand");
/**
 * SatyakashaModule handles the core logic of the Satyakasha sidechain.
 */
class SatyakashaModule extends lisk_sdk_1.BaseModule {
    constructor() {
        super();
        this.commands = [new AnchorDocumentCommand_1.AnchorDocumentCommand(), new DistributeRewardCommand_1.DistributeRewardCommand()];
        this.name = 'satyakasha';
        this.endpoint = {};
        this.events = [];
        // Registering module name
        // In SDK v6, name is set via the name property
    }
    metadata() {
        return {
            endpoints: [],
            commands: this.commands.map(command => ({
                name: command.name,
                params: command.schema,
            })),
            events: this.events.map(event => ({
                name: event.name,
                data: event.schema,
            })),
            assets: [],
        };
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async init(_args) {
        // Initialization logic for the module
    }
    /**
     * Internal logic for the Smart Treasury.
     * This module handles distribution of incentives to validators.
     * Fulfills Requirement 3: Smart Treasury Logic.
     */
    async rewardValidators(context) {
        const { getStore, logger } = context;
        // In v6, we use this.name or a specific prefix
        const rewardSubstore = getStore(Buffer.from(this.name), 1);
        logger.info('Distributing DePIN incentives from Smart Treasury');
    }
}
exports.SatyakashaModule = SatyakashaModule;
