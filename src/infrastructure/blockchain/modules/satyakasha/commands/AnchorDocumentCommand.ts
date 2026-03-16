import {
    BaseCommand,
    CommandExecuteContext,
    CommandVerifyContext,
    VerificationResult,
    VerifyStatus,
} from 'lisk-sdk';

export interface AnchorParams {
    cid: string;
}

export const anchorParamsSchema = {
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
export class AnchorDocumentCommand extends BaseCommand {
    public schema = anchorParamsSchema;

    public async verify(_context: CommandVerifyContext<AnchorParams>): Promise<VerificationResult> {
        const { cid } = _context.params;
        
        // Basic CID validation logic (e.g., length check or regex)
        if (!cid || cid.length < 20) {
            return {
                status: VerifyStatus.FAIL,
                error: new Error('Invalid CID format.'),
            };
        }

        return { status: VerifyStatus.OK };
    }

    public async execute(context: CommandExecuteContext<AnchorParams>): Promise<void> {
        const { cid } = context.params;
        const { senderAddress } = context.transaction;

        // In Lisk SDK v6, we use the state store to persist data
        const satyakashaSubstore = context.getStore(this.moduleID, 0); // 0 is the prefix for our anchor store
        
        // Use the transaction ID or CID as key? CID is unique, so we use it as key
        await satyakashaSubstore.set(Buffer.from(cid), senderAddress);

        context.logger.info(`Document anchored: CID ${cid} by ${senderAddress.toString('hex')}`);
    }

    // Module ID will be provided by the module
    private get moduleID(): Buffer {
        return (this as any)._moduleID; 
    }
}
