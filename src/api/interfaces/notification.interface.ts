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

export interface NotificationItem {
	id: number;
	title: string;
	description: string;
	user_id: number | null;
	category_id: number;
	created_at: string;
	action_link: string | null;
}

export type NotificationTypeFilter = "transaction" | "marketing" | "message" | "system" | "";
