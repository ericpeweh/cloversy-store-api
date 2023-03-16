// Dependencies
import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import httpMocks from "node-mocks-http";

// Module to test
import validate from "../validate";

describe("validate middleware", () => {
	it("should return a middleware function", () => {
		const schema = Joi.object();
		const middleware = validate(schema, "body");

		expect(middleware).toBeInstanceOf(Function);
	});

	it("should return 400 status and validation error message if failed to validate", () => {
		const schema = Joi.object({
			username: Joi.string().required() // username is required field
		});
		jest.spyOn(schema, "validate");

		const middleware = validate(schema, "body");

		// Create required args
		const req: unknown = {
			body: {
				username: "" // provide empty username
			}
		};
		const res = httpMocks.createResponse();
		const next: NextFunction = jest.fn();

		jest.spyOn(res, "status");
		jest.spyOn(res, "json");

		// Call validate middleware
		middleware(req as Request, res as Response, next);

		// Assert validate was called correctly
		expect(schema.validate).toHaveBeenCalledTimes(1);
		expect(schema.validate).toHaveBeenCalledWith({ username: "" });

		// Assert response is sent with expected args
		expect(res.status).toHaveBeenCalledWith(400);
		expect((res.json as jest.Mock).mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "message": "Validation error: "username" is not allowed to be empty",
        "status": "error",
      }
    `);
	});

	it("should pass through if validation succeeded", () => {
		const schema = Joi.object({
			username: Joi.string().required() // username is required field
		});
		jest.spyOn(schema, "validate");

		const middleware = validate(schema, "body");

		// Create required args
		const req: unknown = {
			body: {
				username: "VALID_USERNAME"
			}
		};
		const res = httpMocks.createResponse();
		const next: NextFunction = jest.fn();

		jest.spyOn(res, "status");
		jest.spyOn(res, "json");

		// Call validate middleware
		middleware(req as Request, res as Response, next);

		// Assert validate was called correctly
		expect(schema.validate).toHaveBeenCalledTimes(1);
		expect(schema.validate).toHaveBeenCalledWith({ username: "VALID_USERNAME" });

		// Assert there is no response sent
		expect(res.status).not.toHaveBeenCalled();
		expect(res.json).not.toHaveBeenCalled();

		// Assert middleware passed through
		expect(next).toHaveBeenCalled();
	});

	it("should able to validate 'params' property", () => {
		const schema = Joi.object({
			productId: Joi.string().length(5).required()
		});
		jest.spyOn(schema, "validate");

		const middleware = validate(schema, "params");

		// Create required args
		const req: unknown = {
			params: {
				productId: "12345"
			}
		};
		const res = {};
		const next: NextFunction = jest.fn();

		// Call validate middleware
		middleware(req as Request, res as Response, next);

		// Assert validate was called correctly
		expect(schema.validate).toHaveBeenCalledTimes(1);
		expect(schema.validate).toHaveBeenCalledWith({ productId: "12345" });

		// Assert middleware passed through
		expect(next).toHaveBeenCalled();
	});

	it("should able to validate 'query' property", () => {
		const schema = Joi.object({
			sortBy: Joi.string().valid("id", "popularity", "default").required()
		});
		jest.spyOn(schema, "validate");

		const middleware = validate(schema, "query");

		// Create required args
		const req: unknown = {
			query: {
				sortBy: "id"
			}
		};
		const res = {};
		const next: NextFunction = jest.fn();

		// Call validate middleware
		middleware(req as Request, res as Response, next);

		// Assert validate was called correctly
		expect(schema.validate).toHaveBeenCalledTimes(1);
		expect(schema.validate).toHaveBeenCalledWith({ sortBy: "id" });

		// Assert middleware passed through
		expect(next).toHaveBeenCalled();
	});

	it("should able to validate request object", () => {
		const schema = Joi.object({
			file: Joi.object().required()
		});
		jest.spyOn(schema, "validate");

		const middleware = validate(schema, "");

		// Create required args
		const req: unknown = {
			file: {
				// Any file object
			}
		};
		const res = {};
		const next: NextFunction = jest.fn();

		// Call validate middleware
		middleware(req as Request, res as Response, next);

		// Assert validate was called correctly
		expect(schema.validate).toHaveBeenCalledTimes(1);
		expect(schema.validate).toHaveBeenCalledWith({ file: {} });

		// Assert middleware passed through
		expect(next).toHaveBeenCalled();
	});
});
