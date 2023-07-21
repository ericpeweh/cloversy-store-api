// Dependencies
import googleAnalytics from "../../config/googleAnalytics";

export const getPageMonthlyVisitorAnalytics = async (pagePath: string, yearFilter: string) => {
	let analyticYear = yearFilter;
	if (!yearFilter) {
		analyticYear = new Date().getFullYear().toString();
	}

	const [res] = await googleAnalytics.runReport({
		property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID!}`,
		dateRanges: [
			{
				startDate: `${analyticYear}-01-01`,
				endDate: `${analyticYear}-12-31`
			}
		],
		dimensions: [
			{
				name: "month"
			}
		],
		dimensionFilter: {
			filter: {
				fieldName: "pagePath",
				stringFilter: {
					matchType: "EXACT",
					value: pagePath
				}
			}
		},
		metrics: [
			{
				name: "screenPageViews"
			}
		]
	});

	return res?.rows || [];
};

export const getAppMonthlyVisitorAnalytics = async (yearFilter: string) => {
	let analyticYear = yearFilter;
	if (!yearFilter) {
		analyticYear = new Date().getFullYear().toString();
	}

	const [res] = await googleAnalytics.runReport({
		property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID!}`,
		dateRanges: [
			{
				startDate: `${analyticYear}-01-01`,
				endDate: `${analyticYear}-12-31`
			}
		],
		dimensions: [
			{
				name: "month"
			}
		],
		metrics: [
			{
				name: "screenPageViews"
			}
		]
	});

	return res?.rows || [];
};
