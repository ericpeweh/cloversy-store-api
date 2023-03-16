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
