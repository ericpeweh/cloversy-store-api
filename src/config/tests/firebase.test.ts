// Dependencies
import fcm from "../firebase";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

describe("fcm", () => {
	beforeAll(() => {
		dotenv.config();
	});

	it("should provided with firebase admin keypath in env", () => {
		expect(process.env.FIREBASE_ADMIN_KEY_PATH!).toBeDefined();
		expect(process.env.FIREBASE_ADMIN_KEY_PATH!).toBe("/src/config/firebase-admin.json");

		const filePath = path.join(process.cwd(), process.env.FIREBASE_ADMIN_KEY_PATH!);
		expect(fs.existsSync(filePath)).toBe(true);
	});

	it("should be defined", () => {
		expect(fcm).toBeDefined();
	});

	it("should be an object", () => {
		expect(typeof fcm).toBe("object");
	});

	it("should have a send method", () => {
		expect(fcm.sendMulticast).toBeDefined();
		expect(typeof fcm.sendMulticast).toBe("function");
	});
});
