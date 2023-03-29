// Mocks
const userData = {
	id: 1,
	full_name: "user1",
	email: "user1@example.com"
};

jest.mock("../../services", () => ({
	userService: {
		getUserDataBySub: jest.fn(() => Promise.resolve(userData))
	}
}));

// Dependencies
import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import getUserData from "../getUserData";
import { userService } from "../../services";

const _responseSender = (req: Request, res: Response) => {
	res.status(200).json({ user: req.user });
};

const _errorHandler = (_1: any, _2: Request, res: Response, _3: NextFunction) => {
	return res.status(500).json({
		status: "error",
		message:
			"An error occured on our server, please try again later. If error persists, please contact us for more information."
	});
};

const app = express();

describe("getUserData", () => {
	// Clear route "/" after each test run
	afterEach(() => {
		jest.clearAllMocks();

		app._router.stack = app._router.stack.filter(
			(middleware: { route: { path: string } }) => middleware.route?.path !== "/"
		);
	});

	it("should throw ServerError if req.auth is not defined", async () => {
		// Assign route to app
		app.get(
			"/",
			(req: Request, _: Response, next: NextFunction) => {
				req.auth = undefined;
				next();
			},
			getUserData,
			_responseSender,
			_errorHandler
		);

		// Make get request
		const response = await request(app).get("/");

		// Assert status code & body
		expect(response.status).toEqual(500);
		expect(response.body).toEqual({
			status: "error",
			message:
				"An error occured on our server, please try again later. If error persists, please contact us for more information."
		});
	});

	it("should assign user object to req.user", async () => {
		// Assign route to app
		app.get(
			"/",
			(req: Request, _: Response, next: NextFunction) => {
				req.auth = { sub: "123" };
				next();
			},
			getUserData,
			_responseSender
		);

		const response = await request(app).get("/");

		expect(userService.getUserDataBySub).toHaveBeenCalledTimes(1);
		expect(userService.getUserDataBySub).toHaveBeenCalledWith("123");

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({ user: userData });
	});

	it("should return server error if getUserDataBySub throws error", async () => {
		// Assign route to app
		app.get(
			"/",
			(req: Request, _: Response, next: NextFunction) => {
				req.auth = { sub: "123" };
				next();
			},
			getUserData,
			_responseSender,
			_errorHandler
		);

		// Mock getUserDataBySub to throw an Error
		(userService.getUserDataBySub as jest.Mock).mockImplementation(() => {
			throw new Error("Database Error!");
		});

		// Make get request
		const response = await request(app).get("/");

		// Assert status & body to match server error
		expect(response.status).toBe(500);
		expect(response.body).toEqual({
			status: "error",
			message:
				"An error occured on our server, please try again later. If error persists, please contact us for more information."
		});
	});
});
