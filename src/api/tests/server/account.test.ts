// Mocks
const mockUser = {
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

const mockAuth0User = {
	sub: "123",
	nickname: "user1",
	name: "user1",
	picture: "IMAGE_URL",
	updated_at: "2023-03-15T12:00:00.000Z",
	email: "user1@example.com",
	email_verified: true
};

const mockErrorBody = {
	status: "error",
	message:
		"An error occured on our server, please try again later. If error persists, please contact us for more information."
};

// Mock authService
jest.mock("../../services/auth.service.ts", () => ({
	getUserInfoAuth0: jest.fn(),
	resetPasswordAuth0: jest.fn()
}));

// Mock userService
jest.mock("../../services/client/user.service.ts", () => ({
	...jest.requireActual("../../services/client/user.service.ts"),
	changeUserProfilePicture: jest.fn()
}));

// Mock userRepo
jest.mock("../../data/user.data.ts", () => ({
	getUserDataByEmail: jest.fn(),
	createNewUser: jest.fn()
}));

// Mock client userRepo
jest.mock("../../data/client/user.data.ts", () => ({
	updateUserAccountDetails: jest.fn()
}));

// Mock middlewares
jest.mock("../../middlewares", () => ({
	...jest.requireActual("../../middlewares"),
	isAuth: jest.fn((req: Request, _: Response, next: NextFunction) => {
		req.auth = mockAuth0User;
		return next();
	}),
	isAdmin: jest.fn((_1: Request, _2: Response, next: NextFunction) => {
		return next();
	}),
	getUserData: jest.fn((req: Request, _2: Response, next: NextFunction) => {
		req.user = mockUser;
		return next();
	})
}));

// Dependencies
import express, { Request, Response, NextFunction } from "express";
import { Server } from "http";
import supertest from "supertest";
import { isAuth, isAdmin, errorHandler, getUserData } from "../../middlewares";
import { userService } from "../../services/client";
import { updateUserAccountDetails } from "../../data/client/user.data";
import { ErrorObj } from "../../utils";

// Modules to test
import accountRouter from "../../routes/account.route";
import path from "path";

describe("admin account", () => {
	const app = express();
	let server: Server;

	beforeAll(() => {
		app.use(express.urlencoded({ extended: true }));
		app.use(express.json());
		app.use("/admin/account", isAuth, isAdmin, getUserData, accountRouter, errorHandler);

		server = app.listen(6000);
	});

	afterAll(() => {
		server.close();
	});

	describe("PATCH /admin/account/details", () => {
		afterEach(() => {
			jest.clearAllMocks();
		});

		describe("given undefined or incorrect access token on authorization headers", () => {
			it("should return a 401 status and error message", async () => {
				// Mock getUserData to throw error
				(getUserData as jest.Mock).mockImplementationOnce(
					jest.fn((_: Request, _2: Response, next: NextFunction) => {
						return next(new ErrorObj.ServerError("Failed to get user data!"));
					})
				);

				const res = await supertest(app).patch("/admin/account/details");

				expect(res.body).toEqual(mockErrorBody);
			});
		});

		describe("given valid request body", () => {
			it("should return 200 status code and updated account details", async () => {
				const mockReqBody = {
					full_name: "NEW_FULL_NAME",
					contact: "08234567890",
					birth_date: new Date().toISOString()
				};

				const mockUpdatedUserDetails = {
					...mockUser,
					...mockReqBody
				};

				// Mock updateUserAccountDetails to return user details
				(updateUserAccountDetails as jest.Mock).mockResolvedValueOnce(mockUpdatedUserDetails);

				const res = await supertest(app).patch("/admin/account/details").send(mockReqBody);

				// Assert status code and response body
				expect(res.status).toBe(200);
				expect(res.body).toEqual({
					status: "success",
					data: { updatedAccountDetails: mockUpdatedUserDetails }
				});
			});
		});

		describe("given invalid request body", () => {
			it("should return 400 status code and error message", async () => {
				const res1 = await supertest(app).patch("/admin/account/details").send({
					full_name: "", // invalid full_name
					contact: "08234567890",
					birth_date: new Date().toISOString()
				});

				// Assert status code and response body
				expect(res1.status).toBe(400);
				expect(res1.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: "full_name" is not allowed to be empty",
            "status": "error",
          }
        `);

				const res2 = await supertest(app).patch("/admin/account/details").send({
					full_name: "FULL_NAME",
					contact: "abc123", // invalid phone_number
					birth_date: new Date().toISOString()
				});

				// Assert status code and response body
				expect(res2.status).toBe(400);
				expect(res2.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: ""contact"" did not seem to be a phone number",
            "status": "error",
          }
        `);

				const res3 = await supertest(app).patch("/admin/account/details").send({
					full_name: "FULL_NAME",
					contact: "081234567890",
					birth_date: "INVALID_DATE" // invalid birth_date
				});

				// Assert status code and response body
				expect(res3.status).toBe(400);
				expect(res3.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: "birth_date" must be a valid date",
            "status": "error",
          }
        `);

				const res4 = await supertest(app).patch("/admin/account/details").send({
					// empty request body
				});

				// Assert status code and response body
				expect(res4.status).toBe(400);
				expect(res4.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: "full_name" is required",
            "status": "error",
          }
        `);
			});
		});
	});

	describe("PUT /admin/account/details/picture", () => {
		afterEach(() => {
			jest.clearAllMocks();
		});

		describe("given no image data", () => {
			it("should return a 400 status and error message", async () => {
				const res = await supertest(app).put("/admin/account/details/picture");

				expect(res.body).toEqual({
					status: "error",
					message: "Validation error: File is required!"
				});
			});
		});

		describe("given valid image data", () => {
			it("should return a 200 status and updated user account details", async () => {
				// Mock changeUserProfilePicture to return updated user
				(userService.changeUserProfilePicture as jest.Mock).mockResolvedValueOnce(mockUser);

				const res = await supertest(app)
					.put("/admin/account/details/picture")
					.attach("image", path.resolve(__dirname, "./assets/test-image.png"), {
						contentType: "image/png"
					});

				expect(res.body).toEqual({
					status: "success",
					data: { updatedAccountDetails: mockUser }
				});
			});
		});

		describe("given invalid file type data", () => {
			it("should return a 400 status and updated user account details", async () => {
				// Mock changeUserProfilePicture to return updated user
				(userService.changeUserProfilePicture as jest.Mock).mockResolvedValueOnce(mockUser);

				const res = await supertest(app)
					.put("/admin/account/details/picture")
					.attach("image", path.resolve(__dirname, "./assets/invalid-image.txt")); // sent non image file

				expect(res.body).toEqual({
					status: "error",
					message: "Only .png, .jpg and .jpeg format allowed!"
				});
			});
		});
	});

	// describe("PUT /admin/account/details/picture", () => {
	// 	afterEach(() => {
	// 		jest.clearAllMocks();
	// 	});

	// 	describe("given undefined or incorrect access token on authorization headers", () => {
	// 		it("should return a 401 status and error message", async () => {

	// 		});
	// 	});
	// });
});
