"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnchorDocumentCommand = exports.anchorParamsSchema = void 0;
const lisk_sdk_1 = require("lisk-sdk");
exports.anchorParamsSchema = {
    $id: '/satyakasha/anchor',
    type: 'object',
    properties: {
        cid: {
            dataType: 'string',
            fieldNumber: 1,
        },
    },
    required: ['cid'],
};
/**
 * AnchorDocumentCommand is responsible for recording the IPFS CID on the Satyakasha sidechain.
 */
class AnchorDocumentCommand extends lisk_sdk_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.schema = exports.anchorParamsSchema;
    }
    async verify(_context) {
        const { cid } = _context.params;
        // Basic CID validation logic (e.g., length check or regex)
        if (!cid || cid.length < 20) {
            return {
                status: lisk_sdk_1.VerifyStatus.FAIL,
                error: new Error('Invalid CID format.'),
            };
        }
        return { status: lisk_sdk_1.VerifyStatus.OK };
    }
    async execute(context) {
        const { cid } = context.params;
        const { senderAddress } = context.transaction;
        // In Lisk SDK v6, we use the state store to persist data
        const satyakashaSubstore = context.getStore(this.moduleID, 0); // 0 is the prefix for our anchor store
        // Use the transaction ID or CID as key? CID is unique, so we use it as key
        await satyakashaSubstore.set(Buffer.from(cid), senderAddress);
        context.logger.info(`Document anchored: CID ${cid} by ${senderAddress.toString('hex')}`);
    }
    // Module ID will be provided by the module
    get moduleID() {
        return this._moduleID;
    }
}
exports.AnchorDocumentCommand = AnchorDocumentCommand;
