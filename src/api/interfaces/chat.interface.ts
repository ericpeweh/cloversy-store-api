export interface Conversation {
	id: number;
	title: string;
	created_by: number;
	created_at: string;
}

export interface ConversationUser {
	id: number;
	conversation_id: number;
	user_id: number;
	read_at: string;
	created_at: string;
}

export interface Message {
	id: number;
	conversation_id: number;
	body: string;
	sender_id: number;
	created_at: string;
}
