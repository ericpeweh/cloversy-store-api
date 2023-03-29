export type UserStatus = "active" | "banned";

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

export type CreateUserData = string[];
