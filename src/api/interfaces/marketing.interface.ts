export interface CreateNotifMarketingData {
	title: string;
	description: string | undefined;
	scheduled: string | null;
	message_title: string;
	message_body: string;
	image_url: string | undefined;
	action_link: string | undefined;
	action_title: string | undefined;
	send_to: "all" | "selected";
}

export interface UpdateNotifMarketingData extends CreateNotifMarketingData {
	notifMarketingId: number;
	selectedUserIds: number[];
}

export interface NotifMarketingItem {
	id: number;
	notification_code: string;
	title: string;
	sent_at: string | null;
	scheduled: string | null;
	description: string | null;
	message_title: string;
	message_body: string;
	image_url: string | null;
	action_link: string | null;
	action_title: string | null;
	success_count: number;
	failure_count: number;
	created_at: string;
	send_to: "all" | "selected";
	canceled: boolean;
}

export interface ScheduledNotifMarketingItem
	extends Omit<NotifMarketingItem, "scheduled" | "sent_at"> {
	scheduled: string;
	sent_at: null;
	target_count: string;
}

export interface UpdateNotifMarketingDataArgs {
	updatedNotifMarketingData: Partial<Omit<NotifMarketingItem, "id" | "notification_code">>;
	notifMarketingId: number | string;
}
