import type { Config } from "jest";

const config: Config = {
	testTimeout: 4000, // 8 seconds
	testEnvironment: "node",
	coveragePathIgnorePatterns: [
		"/src/config/corsObject.ts",
		"/src/config/firebase-admin.json",
		"/src/config/google-cloud.json"
	]
};

export default config;
