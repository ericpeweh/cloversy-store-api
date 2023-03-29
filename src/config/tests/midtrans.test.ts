// Dependencies
import coreAPI from "../midtrans";

describe("midtrans", () => {
	it("should initialize midtrans correctly", () => {
		expect(coreAPI).toBeDefined();
	});

	it("should have required methods", () => {
		// Assert charge API
		expect(coreAPI.charge).toBeDefined();
		expect(typeof coreAPI.charge).toBe("function");

		// Assert cancel transaction API
		expect(coreAPI.transaction).toBeDefined();
		expect(typeof coreAPI.transaction.cancel).toBe("function");
	});

	it("should provided with required environment variables", () => {
		expect(process.env.MIDTRANS_SERVER_KEY).toBeDefined();
		expect(process.env.MIDTRANS_CLIENT_KEY).toBeDefined();
	});
});
