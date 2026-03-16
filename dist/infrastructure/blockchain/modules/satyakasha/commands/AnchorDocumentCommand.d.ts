import { BaseCommand, CommandExecuteContext, CommandVerifyContext, VerificationResult } from 'lisk-sdk';
export interface AnchorParams {
    cid: string;
}
export declare const anchorParamsSchema: {
    $id: string;
    type: string;
    properties: {
        cid: {
            dataType: string;
            fieldNumber: number;
        };
    };
    required: string[];
};
/**
 * AnchorDocumentCommand is responsible for recording the IPFS CID on the Satyakasha sidechain.
 */
export declare class AnchorDocumentCommand extends BaseCommand {
    schema: {
        $id: string;
        type: string;
        properties: {
            cid: {
                dataType: string;
                fieldNumber: number;
            };
        };
        required: string[];
    };
    verify(_context: CommandVerifyContext<AnchorParams>): Promise<VerificationResult>;
    execute(context: CommandExecuteContext<AnchorParams>): Promise<void>;
    private get moduleID();
}
