import { ProductType } from "./product.interface";

export interface CartItem {
	id: string;
	user_id: string;
	product_id: string;
	size: string;
	quantity: string;
}

export type CartItemDetails = CartItem & ProductType;
