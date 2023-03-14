// Dependencies
import googleAnalytics from "../googleAnalytics";
import path from "path";
import fs from "fs";

describe("googleAnalytics", () => {
	beforeAll(() => {});

	it("should provided with keyFilename in env with correct value", () => {
		expect(process.env.GOOGLE_CLOUD_KEY_PATH!).toBeDefined();
		expect(process.env.GOOGLE_CLOUD_KEY_PATH!).toBe("/src/config/google-cloud.json");

		const filePath = path.join(process.cwd(), process.env.GOOGLE_CLOUD_KEY_PATH!);
		expect(fs.existsSync(filePath)).toBe(true);
	});

	test("should be defined", () => {
		expect(googleAnalytics).toBeDefined();
	});

	test("should be an object", () => {
		expect(typeof googleAnalytics).toBe("object");
	});

	test("should have a runReport method", () => {
		expect(googleAnalytics.runReport).toBeDefined();
		expect(typeof googleAnalytics.runReport).toBe("function");
	});
});
