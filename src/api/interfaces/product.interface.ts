export interface ProductType {
	id?: number;
	title: string;
	sku?: string;
	price: number;
	status: string;
	category_id?: number;
	brand_id?: number;
	description?: string;
	slug: string;
}

export interface UpdateProductDataArgs {
	updatedProductData: Object;
	productId: string;
	tags: string[];
	sizes: string[];
	removedTags: string[];
	removedSizes: string[];
	removedImages: string[];
}

export interface ProductLastSeen {
	id: number;
	user_id: number;
	product_id: number;
	seen_date: string;
	title: string;
	price: string;
	slug: string;
	images: string[] | null;
}

export interface ProductReview {
	id: number;
	product_id: number;
	user_id: number;
	transaction_id: number;
	rating: number;
	description: string;
	status: "active" | "disabled";
	created_at: string;
}

export interface ProductReviewItem {
	id: number;
	rating: string;
	description: string;
	created_at: string;
	profile_picture: string;
	full_name: string;
}

export interface AdminProductReviewItem extends ProductReview {
	profile_picture: string;
	full_name: string;
	product_title: string;
}

export interface ReviewRequestItem {
	product_id: number;
	rating: number;
	review: string;
}

export interface ProductLastSeen {
	id: number;
	user_id: number;
	product_id: number;
	seen_date: string;
	title: string;
	price: string;
	slug: string;
	images: string[] | null;
}
