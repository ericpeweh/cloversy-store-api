declare module "express" {
	export interface Request {
		user?: {
			id: string;
			full_name: string;
			email: string;
			contact: string | null;
			profile_image: string | null;
			credits: string;
			user_role: string;
			banned_date: string | null;
			created_at: string;
		};
	}
}

export type CreateUserData = string[];
