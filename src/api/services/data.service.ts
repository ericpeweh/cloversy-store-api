/* eslint-disable no-useless-catch */
// Data
import axios from "axios";
import dotenv from "dotenv";

// Types
import { RajaOngkirWaybillResponse } from "../interfaces";

dotenv.config();

const RAJA_ONGKIR_BASE_URL = "https://pro.rajaongkir.com/api";

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
