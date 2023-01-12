export interface NotificationMessage {
	title: string;
	body: string;
	actionTitle?: string;
	actionLink?: string;
	imageUrl?: string;
}

export interface SendNotificationResult {
	failedTokens: string[];
	successCount: number;
	failureCount: number;
	sendAt: string;
}
