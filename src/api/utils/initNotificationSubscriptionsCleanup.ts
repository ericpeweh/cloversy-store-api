// Config
import scheduler from "./scheduler";

// Services
import { deleteExpiredTokens } from "../services/subscription.service";

const initNotificationSubscriptionsCleanup = async () => {
	// Delete all expired token (older 60 days)
	// Run every 7 days at 12:00 AM
	scheduler.scheduleJob("notification_subscription_cleanup", "0 0 */7 * *", async () => {
		const deletedTokensCount = await deleteExpiredTokens();

		console.log(
			`Deleted ${deletedTokensCount} expired notification ${
				deletedTokensCount > 1 ? "subscriptions" : "subscription"
			}.`
		);
	});

	console.log("Initialized notification subscription cleanup.");
};

export default initNotificationSubscriptionsCleanup;
