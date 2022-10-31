// Data
import data from "../data";

export const getAllCategories = async () => {
	const categories = await data.getAllCategories();

	return categories;
};

export const createCategory = async (categoryData: any[]) => {
	const newCategory = await data.createCategory(categoryData);

	return newCategory;
};

export const updateCategory = async (updatedCategoryData: Array<string>, categoryId: string) => {
	const updatedCategory = await data.updateCategory(updatedCategoryData, categoryId);

	return updatedCategory;
};

export const deleteCategory = async (categoryId: string) => {
	const result = await data.deleteCategory(categoryId);

	return result;
};

export default {
	getAllCategories,
	createCategory,
	updateCategory,
	deleteCategory
};
