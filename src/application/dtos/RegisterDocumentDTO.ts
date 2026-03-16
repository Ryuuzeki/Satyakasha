export interface RegisterDocumentRequest {
    institutionId: string;
    apiKey: string;
    documentType: string;
    payload: any;
    async?: boolean;
}

export interface RegisterDocumentResponse {
    jobId: string;
    status: 'pending' | 'completed' | 'failed';
    message: string;
}
