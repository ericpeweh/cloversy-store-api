import express, { Request as ExpressRequest } from "express";

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

declare module "express" {
	export interface Request extends ExpressRequest {
		user?: User;
		auth?: any;
	}
}
