import type { IncomingMessage } from "http";
import type { Socket } from "socket.io";

export interface User {
	id: string;
	full_name: string;
	email: string;
	contact: string | null;
	profile_picture: string | null;
	user_status: UserStatus;
	credits: string;
	user_role: string;
	banned_date: string | null;
	created_at: string;
}

interface CustomIncomingMessage extends IncomingMessage {
	user?: User;
	auth?: any;
}

export interface CustomSocket extends Socket {
	request: CustomIncomingMessage;
}
