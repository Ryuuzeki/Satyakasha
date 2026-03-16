export interface GenerateQRCodeRequest {
    cid: string;
    institutionId: string;
}

export interface GenerateQRCodeResponse {
    qrCodeUrl: string;
    qrCodeBase64: string;
    referenceId: string;
}
