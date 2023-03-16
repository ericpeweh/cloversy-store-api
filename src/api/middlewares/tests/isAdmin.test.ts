// Mocks
const mockErrorBody = {
	status: "error",
	message:
		"An error occured on our server, please try again later. If error persists, please contact us for more information."
};

const mockUserData = {
	id: 1,
	full_name: "user1",
	email: "user1@example.com",
	user_role: "admin"
};

jest.mock("../../services", () => ({
	userService: {
		getUserDataBySub: jest.fn(() => Promise.resolve(mockUserData))
	}
}));

// Dependencies
import express, { Request, Response, NextFunction } from "express";
import request from "supertest";
import isAdmin from "../isAdmin";
import { userService } from "../../services";
import errorHandler from "../errorHandler";

const _responseSender = (req: Request, res: Response) => {
	res.status(200).json({ user: req.auth });
};

const app = express();

describe("isAdmin", () => {
	afterEach(() => {
		jest.clearAllMocks();

		// Clear route "/" after each test run
		app._router.stack = app._router.stack.filter(
			(middleware: { route: { path: string } }) => middleware.route?.path !== "/"
		);
	});

	it("should return 401 status and error message if there is no authenticated user", async () => {
		app.get(
			"/",
			// Middleware to mimic no authenticated user
			(req: Request, _: Response, next: NextFunction) => {
				req.auth = undefined;
				next();
			},
			isAdmin,
			_responseSender,
			errorHandler
		);

		// Send request
		const response = await request(app).get("/");

		// Assert status code and expect an error message
		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			status: "error",
			message: "Failed to check user authority, please try again."
		});
	});

	it("should return 403 status and error message if user is not 'admin'", async () => {
		// Mock getUserDataBySub to return 'user' role user
		(userService.getUserDataBySub as jest.Mock).mockResolvedValueOnce({
			id: 1,
			user_role: "user"
		});

		app.get(
			"/",
			(req: Request, _: Response, next: NextFunction) => {
				req.auth = { sub: "123" };
				next();
			},
			isAdmin,
			_responseSender,
			errorHandler
		);

		// Send request
		const response = await request(app).get("/");

		// Assert status code and expect an error message
		expect(response.status).toBe(403);
		expect(response.body).toEqual({
			status: "error",
			message: "Access denied"
		});
	});

	it("should continue and return 200 status if user is 'admin'", async () => {
		// Mock getUserDataBySub to return 'user' role user
		(userService.getUserDataBySub as jest.Mock).mockResolvedValueOnce({
			id: 1,
			user_role: "admin"
		});

		app.get(
			"/",
			(req: Request, _: Response, next: NextFunction) => {
				req.auth = { sub: "123" };
				next();
			},
			isAdmin,
			_responseSender,
			errorHandler
		);

		// Send request
		const response = await request(app).get("/");

		// Assert status code and expect an error message
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ user: { sub: "123" } });
	});

	it("should return 500 status code getUserDataBySub throws error", async () => {
		// Assign route to app
		app.get(
			"/",
			(req: Request, _: Response, next: NextFunction) => {
				req.auth = { sub: "123" };
				next();
			},
			isAdmin,
			_responseSender,
			errorHandler
		);

		// Mock getUserDataBySub to throw an Error
		(userService.getUserDataBySub as jest.Mock).mockImplementation(() => {
			throw new Error("Database Error!");
		});

		// Make get request
		const response = await request(app).get("/");

		// Assert status & body to match server error
		expect(response.status).toBe(500);
		expect(response.body).toEqual(mockErrorBody);
	});
});
