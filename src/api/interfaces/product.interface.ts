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
	updatedProductData: Array<any>;
	productId: string;
	tags: string[];
	sizes: string[];
	deleteTagsId: string[];
	deleteSizesId: string[];
}
