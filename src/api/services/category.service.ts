// Data
import { categoryRepo } from "../data";

export const getAllCategories = async () => {
	const categories = await categoryRepo.getAllCategories();

	return categories;
};

export const createCategory = async (categoryData: any[]) => {
	const newCategory = await categoryRepo.createCategory(categoryData);

	return newCategory;
};

export const updateCategory = async (updatedCategoryData: Array<string>, categoryId: string) => {
	const updatedCategory = await categoryRepo.updateCategory(updatedCategoryData, categoryId);

	return updatedCategory;
};

export const deleteCategory = async (categoryId: string) => {
	const result = await categoryRepo.deleteCategory(categoryId);

	return result;
};
