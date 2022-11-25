// Data
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const RAJA_ONGKIR_BASE_URL = "https://api.rajaongkir.com/starter";

export const getAllProvinces = async () => {
	try {
		const response = await axios.get<{ rajaongkir: { results: Object[] } }>(
			`${RAJA_ONGKIR_BASE_URL}/province`,
			{
				headers: {
					key: process.env.RAJA_ONGKIR_API_KEY
				}
			}
		);

		return response.data.rajaongkir.results;
	} catch (error: any) {
		throw error;
	}
};

export const getCitiesByProvinceId = async (provinceId: string) => {
	try {
		const response = await axios.get<{ rajaongkir: { results: Object[] } }>(
			`${RAJA_ONGKIR_BASE_URL}/city?province=${provinceId}`,
			{
				headers: {
					key: process.env.RAJA_ONGKIR_API_KEY
				}
			}
		);

		return response.data.rajaongkir.results;
	} catch (error: any) {
		throw error;
	}
};
