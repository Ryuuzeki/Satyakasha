/**
 * Global Type Declarations for Satyakasha Project.
 * This file provides minimal declarations to satisfy the IDE when @types/node or other modules are missing.
 */

declare module 'lisk-sdk' {
    export const cryptography: any;
    export namespace apiClient {
        export type APIClient = any;
        export function createWSClient(url: string): Promise<APIClient>;
        export function createIPCClient(path: string): Promise<APIClient>;
    }
    export class BaseCommand {
        public name: string;
        public schema: any;
        public constructor();
        public verify(context: any): Promise<any>;
        public execute(context: any): Promise<any>;
    }
    export class BaseModule {
        public name: string;
        public endpoint: any;
        public events: any;
        public commands: any[];
        public constructor();
        public metadata(): any;
        public init(args: any): Promise<void>;
    }
    export enum VerifyStatus {
        OK = 1,
        FAIL = 0
    }
    export interface VerificationResult {
        status: VerifyStatus;
        error?: Error;
    }
    export interface CommandVerifyContext<T> {
        params: T;
        transaction: any;
        logger: any;
        getStore: (moduleID: Buffer, prefix: number) => any;
    }
    export interface CommandExecuteContext<T> {
        params: T;
        transaction: any;
        logger: any;
        header: any;
        assets: any;
        getStore: (moduleID: Buffer, prefix: number) => any;
    }
    export interface ModuleInitArgs {
        moduleConfig: any;
        genesisConfig: any;
    }
    export interface ModuleMetadata {
        endpoints: any[];
        commands: any[];
        events: any[];
        assets: any[];
    }
}

declare module 'ipfs-http-client' {
    export function create(options?: any): any;
    export interface IPFSHTTPClient {
        add(data: any, options?: any): Promise<any>;
        cat(cid: string): AsyncIterable<Uint8Array>;
    }
}
