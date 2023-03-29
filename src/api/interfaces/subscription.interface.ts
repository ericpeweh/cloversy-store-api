export interface NotificationSubscription {
	id: number;
	token: string;
	user_id: number;
	last_online: string;
}

export interface PushSubscriptionItem extends NotificationSubscription {
	profile_picture: string;
	full_name: string;
	email: string;
}
