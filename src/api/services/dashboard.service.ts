// Data
import { productRepo, reviewRepo, transactionRepo, userRepo, voucherRepo } from "../data";

// Services
import { analyticsService } from ".";

export const getDashboardData = async (salesAnalyticYear: string, visitorYearFilter: string) => {
	const salesTotal = await transactionRepo.getSalesTotal();
	const transactionCount = await transactionRepo.getTransactionCount();
	const productCount = await productRepo.getProductCount();
	const customerCount = await userRepo.getCustomerCount();
	const reviewCount = await reviewRepo.getReviewCount();
	const activeVoucherCount = await voucherRepo.getActiveVoucherCount();
	const monthlySalesCountAnalytics = await transactionRepo.getMonthlySalesCountAnalytics(
		salesAnalyticYear
	);
	const monthlyVisitorCountAnalytics = await analyticsService.getAppMonthlyVisitorAnalytics(
		visitorYearFilter
	);

	// Combine with GA pageviews data
	const analytics = monthlySalesCountAnalytics.map(item => ({ ...item, app_views: "0" }));

	monthlyVisitorCountAnalytics.forEach(item => {
		if (item.dimensionValues && item.metricValues) {
			const month = parseInt(item.dimensionValues[0]?.value || "");
			const appViews = parseInt(item.metricValues[0]?.value || "");

			if (month && appViews) {
				analytics[month - 1].app_views = appViews.toString();
			}
		}
	});

	return {
		salesTotal,
		transactionCount,
		productCount,
		customerCount,
		reviewCount,
		activeVoucherCount,
		analytics
	};
};
