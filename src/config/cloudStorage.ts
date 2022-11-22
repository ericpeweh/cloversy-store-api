// Dependencies
import dotenv from "dotenv";
import { Storage } from "@google-cloud/storage";
import path from "path";

dotenv.config();

// Initialization
const storage = new Storage({
	keyFilename: path.join(process.cwd(), process.env.GOOGLE_CLOUD_KEY_PATH!),
	projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
});
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME!);

export default bucket;
