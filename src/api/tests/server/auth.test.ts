// Mocks
import { mockUser, mockAuth0User, mockErrorBody } from "./helpers/mockVariables";

// Mock authService
jest.mock("../../services/auth.service.ts", () => ({
	getUserInfoAuth0: jest.fn(),
	resetPasswordAuth0: jest.fn()
}));

// Mock userRepo
jest.mock("../../data/user.data.ts", () => ({
	getUserDataByEmail: jest.fn(),
	createNewUser: jest.fn()
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
import { userRepo } from "../../data";
import { isAuth, isAdmin, errorHandler, getUserData } from "../../middlewares";

// Modules to test
import authRouter from "../../routes/auth.route";
import { authService, userService } from "../../services";

describe("admin auth", () => {
	const app = express();
	let server: Server;

	beforeAll(() => {
		app.use("/admin/auth", isAuth, isAdmin, authRouter, errorHandler);
		server = app.listen();

		// Mock user services
		(userRepo.getUserDataByEmail as jest.Mock).mockResolvedValue(mockUser);
		(userRepo.createNewUser as jest.Mock).mockResolvedValue(mockUser);

		// Mock auth services
		(authService.resetPasswordAuth0 as jest.Mock).mockResolvedValue(mockAuth0User);
	});

	afterAll(() => {
		server.close();
	});

	describe("GET /admin/auth", () => {
		afterEach(() => {
			jest.clearAllMocks();
		});

		describe("given correct access token on authorization headers", () => {
			it("should return a 200 status code and user data", async () => {
				// Mock getUserInfoAuth0 service to return auth0 user info
				(authService.getUserInfoAuth0 as jest.Mock).mockReturnValueOnce(mockAuth0User);

				const res = await supertest(app)
					.get("/admin/auth")
					.set("Authorization", "Bearer ACCESS_TOKEN");

				expect(res.body).toEqual({
					status: "success",
					data: { user: mockUser }
				});
			});
		});

		describe("given undefined or incorrect access token on authorization headers", () => {
			it("should return a 401 status and error message", async () => {
				// Mock auth0 API
				(authService.getUserInfoAuth0 as jest.Mock).mockResolvedValue(undefined);

				const res = await supertest(app)
					.get("/admin/auth")
					.set("Authorization", "INVALID_OR_UNDEFINED_ACCESS_TOKEN");

				expect(res.body).toEqual({
					status: "error",
					message: "Failed to authenticate user!"
				});
			});
		});
	});

	describe("POST /admin/auth/resetpassword", () => {
		describe("given valid access token with user email", () => {
			it("should return 200 status code and result data", async () => {
				// Mock getUserDataBySub middleware
				jest.spyOn(userService, "getUserDataBySub").mockResolvedValueOnce(mockUser);

				jest
					.spyOn(authService, "resetPasswordAuth0")
					.mockResolvedValueOnce("We've just sent you an email to reset your password.");

				const res = await supertest(app)
					.post("/admin/auth/resetpassword")
					.set("Authorization", "Bearer ACCESS_TOKEN");

				expect(res.body).toEqual({
					status: "success",
					data: { result: "We've just sent you an email to reset your password." }
				});
			});
		});

		describe("given undefined user email", () => {
			it("should return 500 status code and error message", async () => {
				// Mock getUserData middleware to set req.user as undefined
				(getUserData as jest.Mock).mockImplementationOnce(
					jest.fn((req: Request, _2: Response, next: NextFunction) => {
						req.user = undefined;
						return next();
					})
				);

				const res = await supertest(app)
					.post("/admin/auth/resetpassword")
					.set("Authorization", "Bearer ACCESS_TOKEN");

				expect(res.body).toEqual(mockErrorBody);
			});
		});

		describe("resetPasswordAuth0 throws error", () => {
			it("should return 500 status code and error message", async () => {
				// Mock resetPasswordAuth0 to throw error
				(authService.resetPasswordAuth0 as jest.Mock).mockRejectedValueOnce(
					new Error("Auth0 API Error!")
				);

				// Make rquest to send reset password email
				const res = await supertest(app)
					.post("/admin/auth/resetpassword")
					.set("Authorization", "Bearer ACCESS_TOKEN");

				expect(res.body).toEqual(mockErrorBody);
			});
		});
	});
});
