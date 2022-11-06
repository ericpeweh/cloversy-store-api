// Data
import { brandRepo } from "../data";

export const getAllBrands = async () => {
	const brands = await brandRepo.getAllBrands();

	return brands;
};

export const createBrand = async (brandData: any[]) => {
	const newBrand = await brandRepo.createBrand(brandData);

	return newBrand;
};

export const updateBrand = async (updatedBrandData: Array<string>, brandId: string) => {
	const updatedBrand = await brandRepo.updateBrand(updatedBrandData, brandId);

	return updatedBrand;
};

export const deleteBrand = async (brandId: string) => {
	const result = await brandRepo.deleteBrand(brandId);

	return result;
};
