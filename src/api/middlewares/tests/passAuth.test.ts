// Dependencies
import { Request, Response, NextFunction } from "express";
import passAuth from "../passAuth";

describe("passAuth", () => {
	it("should pass through if there is an error named with 'UnauthorizedError'", () => {
		// Create custome rror with name 'UnauthorizedError'
		class UnauthorizedError extends Error {
			constructor(message: string) {
				super(message);
				this.name = "UnauthorizedError";
			}
		}

		const req: unknown = {};
		const res: unknown = {};
		const error = new UnauthorizedError("Unauthorized error occured!");
		const next: NextFunction = jest.fn();

		passAuth(error, req as Request, res as Response, next);

		// Assert middleware is passed through
		expect(next).toHaveBeenCalledTimes(1);
		expect(next).toHaveBeenCalledWith();
	});

	it("should call error handler if error is not UnauthorizedError", () => {
		const req: unknown = {};
		const res: unknown = {};
		const error = new Error("Unknown error!");
		const next: NextFunction = jest.fn();

		passAuth(error, req as Request, res as Response, next);

		// Assert middleware to call error handler middleware
		expect(next).toHaveBeenCalledTimes(1);
		expect(next).toHaveBeenCalledWith(error);
	});
});
