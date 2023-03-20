export const mockUser = {
	id: "1",
	full_name: "user1",
	email: "user1@example.com",
	contact: "01234567890",
	profile_picture: "IMAGE_URL",
	user_status: "active",
	credits: "0",
	banned_date: null,
	created_at: "2023-03-15T12:00:00.000Z",
	user_role: "user",
	sub: "123",
	birth_date: "2023-03-15T12:00:00.000Z"
};

export const mockAuth0User = {
	sub: "123",
	nickname: "user1",
	name: "user1",
	picture: "IMAGE_URL",
	updated_at: "2023-03-15T12:00:00.000Z",
	email: "user1@example.com",
	email_verified: true
};

export const mockErrorBody = {
	status: "error",
	message:
		"An error occured on our server, please try again later. If error persists, please contact us for more information."
};

export const mockPaginationData = {
	page: 1,
	pageSize: 10,
	totalCount: 100,
	totalPages: 10
};

export const mockIdentifyUserErrorBody = {
	message: "Failed to identify user!",
	status: "error"
};

export const mockCursorData = {
	nextCursor: 15,
	currentCursor: 10,
	maxCursor: 100,
	minCursor: 1
};

export const mockDashboardData = {
	salesTotal: 10000,
	transactionCount: 1000,
	productCount: 200,
	customerCount: 4000,
	reviewCount: 500,
	activeVoucherCount: 10,
	monthlySalesCount: [
		{ month: "Jan", product_sales: 10 },
		{ month: "Feb", product_sales: 15 },
		{ month: "Mar", product_sales: 5 },
		{ month: "Apr", product_sales: 8 },
		{ month: "May", product_sales: 7 },
		{ month: "Jun", product_sales: 9 },
		{ month: "Jul", product_sales: 20 },
		{ month: "Aug", product_sales: 18 },
		{ month: "Sep", product_sales: 23 },
		{ month: "Oct", product_sales: 6 },
		{ month: "Nov", product_sales: 13 }
	],
	monthlyVisitorCount: [
		{
			dimensionValues: [
				{
					value: "02",
					oneValue: "value"
				}
			],
			metricValues: [
				{
					value: "1525",
					oneValue: "value"
				}
			]
		},
		{
			dimensionValues: [
				{
					value: "03",
					oneValue: "value"
				}
			],
			metricValues: [
				{
					value: "641",
					oneValue: "value"
				}
			]
		},
		{
			dimensionValues: [
				{
					value: "01",
					oneValue: "value"
				}
			],
			metricValues: [
				{
					value: "35",
					oneValue: "value"
				}
			]
		}
	]
};
