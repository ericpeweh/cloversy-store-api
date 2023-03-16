import type { Config } from "jest";

const config: Config = {
	testTimeout: 4000, // 8 seconds
	testEnvironment: "node",
	coveragePathIgnorePatterns: [
		"/src/api/middlewares/isAuth.ts",
		"/src/config/corsObject.ts",
		"/src/config/firebase-admin.json",
		"/src/config/google-cloud.json"
	],
	moduleNameMapper: {
		"\\.(jpg|jpeg|png)$": "identity-obj-proxy"
	}
};

export default config;
