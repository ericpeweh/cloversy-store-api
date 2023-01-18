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

export interface UpdateEmailMarketingData extends CreateEmailMarketingData {
	emailMarketingId: number;
	selectedUserIds: number[];
}

export interface CreateEmailMarketingData {
	title: string;
	description: string | undefined;
	scheduled: string | null;
	email_subject: string;
	params: { [key: string]: string };
	send_to: "selected";
	template_id: string | number;
	send_at: string | null;
}

export interface UpdateEmailMarketingDataArgs {
	updatedEmailMarketingData: Partial<Omit<EmailMarketingItem, "id" | "notification_code">>;
	emailMarketingId: number | string;
}

export interface EmailTemplate {
	id: number;
	name: string;
	subject: string;
	isActive: boolean;
	testSent: boolean;
	sender: {
		name: string;
		email: string;
		id: string;
	};
	replyTo: string;
	toField: string;
	tag: string;
	htmlContent: string;
	createdAt: string;
	modifiedAt: string;
}

export interface EmailMarketingItem {
	id: number;
	notification_code: string;
	title: string;
	sent_at: string | null;
	scheduled: string | null;
	description: string | null;
	email_subject: string;
	send_to: "all" | "selected";
	canceled: boolean;
	params: { [key: string]: string };
	created_at: string;
	success_count: number;
	failure_count: number;
	failed_emails: string[];
	template_id: number | string;
}

export interface EmailObject {
	to: { email: string; name: string }[];
	templateId: number;
	params: { [key: string]: string };
}

export interface ScheduledEmailMarketingItem
	extends Omit<EmailMarketingItem, "scheduled" | "sent_at"> {
	scheduled: string;
	sent_at: null;
	target_count: string;
}

export interface SendEmailResult {
	failedEmails: string[];
	successCount: number;
	failureCount: number;
	sendAt: string;
}
