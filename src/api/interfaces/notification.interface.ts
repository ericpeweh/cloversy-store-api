export interface NotificationMarketing {
	id: number;
	notification_code: string;
	title: string;
	sent: boolean;
	sent_at: string | null;
	scheduled: boolean;
	description: string | null;
	message_title: string;
	message_body: string;
	image_url: string | null;
	action_link: string | null;
	action_title: string | null;
	success_count: number;
	failure_count: number;
	created_at: string;
}

export interface NotificationMessage {
	title: string;
	body: string;
	actionTitle?: string;
	actionLink?: string;
	imageUrl?: string;
}

export interface UpdateNotifMarketingDataArgs {
	updatedNotifMarketingData: Partial<Omit<NotificationMarketing, "id" | "notification_code">>;
	notifMarketingId: number;
}
