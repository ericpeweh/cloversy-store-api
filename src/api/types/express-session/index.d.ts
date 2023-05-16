/* eslint-disable @typescript-eslint/no-unused-vars */
import session from "express-session";

interface CartItem {
	id: string;
	user_id: string;
	product_id: string;
	size: string;
	quantity: number;
}

declare module "express-session" {
	export interface SessionData {
		cart: Partial<CartItem>[];
	}
}
