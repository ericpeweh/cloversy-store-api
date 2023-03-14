// Dependencies
import { ClientError, ServerError } from "../errorClass";

describe("ClientError", () => {
	it("should be instance of js Error", () => {
		const error = new ClientError("Client error!", 401);
		expect(error instanceof Error).toBe(true);
	});

	it("should have correct name property", () => {
		const error = new ClientError("Client error!");
		expect(error.name).toBe("ClientError");
	});

	it("should have correct default code", () => {
		const error = new ClientError("Client error!");
		expect(error.code).toBe(400);
	});

	it("should have correct custom code", () => {
		const error = new ClientError("Client error!", 401);
		expect(error.code).toBe(401);
	});

	it("should have correct message", () => {
		const errorMessage = "Client error!";
		const error = new ClientError(errorMessage);
		expect(error.message).toBe(errorMessage);
	});
});

describe("ServerError", () => {
	it("should be instance of js Error", () => {
		const error = new ServerError("Server error!", 401);
		expect(error instanceof Error).toBe(true);
	});

	it("should have correct name property", () => {
		const error = new ServerError("Server error!");
		expect(error.name).toBe("ServerError");
	});

	it("should have correct default code", () => {
		const error = new ServerError("Server error!");
		expect(error.code).toBe(500);
	});

	it("should have correct custom code", () => {
		const error = new ServerError("Server error!", 502);
		expect(error.code).toBe(502);
	});

	it("should have correct message", () => {
		const error = new ServerError();
		expect(error.message).toBe(
			"An error occured on our server, please try again later. If error persists, please contact us for more information."
		);
	});
});
