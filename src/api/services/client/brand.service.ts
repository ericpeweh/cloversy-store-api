// Data
import { brandRepo } from "../../data/client";

export const getAllBrands = async () => {
	const brands = await brandRepo.getAllBrands();

	return brands;
};
