// Dependencies
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import path from "path";

const googleAnalytics = new BetaAnalyticsDataClient({
	keyFilename: path.join(process.cwd(), process.env.GOOGLE_CLOUD_KEY_PATH!)
});

export default googleAnalytics;
