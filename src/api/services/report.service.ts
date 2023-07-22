// Data
import { reportRepo } from "../data";

export const getSalesReport = async (startDate: string, endDate: string) => {
	const result = await reportRepo.getSalesReport(startDate, endDate);

	return result;
};
