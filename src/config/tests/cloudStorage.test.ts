// Mocks
jest.spyOn(dotenv, "config");
jest.mock("@google-cloud/storage", () => {
	return {
		Storage: jest.fn().mockImplementation(() => {
			return {
				bucket: jest.fn().mockReturnValue({
					file: jest.fn()
				})
			};
		})
	};
});

// Dependencies
import dotenv from "dotenv";
import path from "path";
import { Bucket, Storage } from "@google-cloud/storage";

describe("cloudStorage", () => {
	let storage: undefined | Storage = undefined;
	let cloudBucket: undefined | Bucket = undefined;

	beforeAll(() => {
		dotenv.config();
		(Storage as unknown as jest.Mock).mockClear();

		storage = new Storage({
			keyFilename: path.join(__dirname, process.env.GOOGLE_CLOUD_KEY_PATH!),
			projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
		});
		cloudBucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME!);
	});

	it("should loads enviroment variables with dotenv", () => {
		expect(dotenv.config).toHaveBeenCalled();
	});

	it("should create google cloud storage with correct configuration", () => {
		// Assert env of config
		expect(process.env.GOOGLE_CLOUD_KEY_PATH).toBeDefined();
		expect(process.env.GOOGLE_CLOUD_PROJECT_ID).toBeDefined();

		// Assert storage instance config args
		expect(dotenv.config).toHaveBeenCalled();
		expect(Storage).toHaveBeenCalledTimes(1);
		expect(Storage).toHaveBeenCalledWith({
			keyFilename: path.join(__dirname, process.env.GOOGLE_CLOUD_KEY_PATH!),
			projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
		});
	});

	it("should create a new bucket with the correct name", () => {
		// Assert storage.bucket was called with the right bucket name
		expect(cloudBucket).toBeDefined();
		expect(storage?.bucket).toHaveBeenCalledWith(process.env.GOOGLE_CLOUD_BUCKET_NAME);
	});
});
