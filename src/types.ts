export type UploadType = 'po' | 'grn';

export interface HistoryItem {
    id: string;
    fileName: string;
    platform: string;
    uploadedAt: string;
    status: 'processing' | 'success' | 'failed';
    uploadType: UploadType;
    rowCount?: number;
    errorMessage?: string;
}

export interface WebhookResponse {
    success: boolean;
    rowCount?: number;
    message?: string;
}
