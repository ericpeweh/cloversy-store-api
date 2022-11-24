// Data
import { categoryRepo } from "../../data/client";

export const getAllCategories = async () => {
	const result = await categoryRepo.getAllCategories();

	return result;
};
