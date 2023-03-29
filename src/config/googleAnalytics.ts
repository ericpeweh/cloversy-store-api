// Dependencies
import dotenv from "dotenv";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import path from "path";

dotenv.config();

const googleAnalytics = new BetaAnalyticsDataClient({
	keyFilename: path.join(__dirname, process.env.GOOGLE_CLOUD_KEY_PATH!)
});

export default googleAnalytics;
