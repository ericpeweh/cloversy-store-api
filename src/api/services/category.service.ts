// Data
import { categoryRepo } from "../data";

export const getAllCategories = async (page: string, q: string, sortBy: string) => {
	const result = await categoryRepo.getAllCategories(page, q, sortBy);

	return result;
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
