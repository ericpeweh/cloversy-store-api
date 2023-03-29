// Dependencies
import sendinblue from "../sendinblue";

describe("sendinblue", () => {
	it("should initialize sendinblue correctly", () => {
		expect(sendinblue).toBeDefined();
	});

	it("should have required methods", () => {
		// Assert getSmtpTemplate API
		expect(sendinblue.getSmtpTemplate).toBeDefined();
		expect(typeof sendinblue.getSmtpTemplate).toBe("function");

		// Assert send transaction email API
		expect(sendinblue.sendTransacEmail).toBeDefined();
		expect(typeof sendinblue.sendTransacEmail).toBe("function");
	});

	it("should provided with required environment variables", () => {
		expect(process.env.SENDINBLUE_API_KEY).toBeDefined();
	});
});
