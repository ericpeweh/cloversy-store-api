// Data
import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";

// Types
import {
	RajaOngkirCostResponse,
	CostItem,
	ShippingService,
	RajaOngkirWaybillResponse
} from "../../interfaces";

dotenv.config();

const RAJA_ONGKIR_BASE_URL = "https://pro.rajaongkir.com/api";

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

export const getSubdistrictByCityId = async (subdistrictId: string) => {
	try {
		const response = await axios.get<{ rajaongkir: { results: Object[] } }>(
			`${RAJA_ONGKIR_BASE_URL}/subdistrict?city=${subdistrictId}`,
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

export const getShippingCostBySubdistrict = async (subdistrictId: number) => {
	try {
		const costPromises: Promise<AxiosResponse<RajaOngkirCostResponse>>[] = [];

		["jne", "jnt", "sicepat"].forEach(courierService => {
			const request = axios.post<RajaOngkirCostResponse>(
				`${RAJA_ONGKIR_BASE_URL}/cost`,
				{
					origin: 5106, // Pontianak Utara
					originType: "subdistrict",
					destination: subdistrictId,
					destinationType: "subdistrict",
					// Calculated for all shipping
					weight: 2000,
					courier: courierService,
					length: 40,
					width: 30,
					height: 30
				},
				{
					headers: {
						key: process.env.RAJA_ONGKIR_API_KEY
					}
				}
			);

			costPromises.push(request);
		});

		const costResponses = await Promise.all(costPromises);

		// Structure result item
		const result: CostItem[] = costResponses.reduce((arr: CostItem[], response): CostItem[] => {
			const costItem = response.data.rajaongkir.results[0];
			const structuredCosts = costItem.costs.map(
				(costArrItem: ShippingService): CostItem => ({
					...costArrItem.cost[0],
					courier: costItem.code,
					service: costArrItem.service,
					description: costArrItem.description,
					// Add estimated to J&T empty etd prop
					...(costItem.code === "J&T" && { etd: "2-3" })
				})
			);

			return [...arr, ...structuredCosts];
		}, []);

		// Remove Cargo shipping from SiCepat
		return result.filter(cost => cost.service !== "GOKIL");
	} catch (error: any) {
		throw error;
	}
};

export const getShippingWaybill = async (trackingCode: string, courierName: string) => {
	try {
		const response = await axios.post<RajaOngkirWaybillResponse>(
			`${RAJA_ONGKIR_BASE_URL}/waybill`,
			{
				waybill: trackingCode,
				courier: courierName === "J&T" ? "jnt" : courierName
			},
			{
				headers: {
					key: process.env.RAJA_ONGKIR_API_KEY
				}
			}
		);

		return response.data.rajaongkir.result.manifest;
	} catch (error: any) {
		throw error;
	}
};
