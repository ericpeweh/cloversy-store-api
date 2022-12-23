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
