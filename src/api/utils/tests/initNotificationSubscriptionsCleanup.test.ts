// Mocks
jest.mock("../../services/subscription.service.ts", () => ({
	deleteExpiredTokens: jest.fn().mockResolvedValue(3)
}));
jest.mock("../scheduler.ts");
jest.spyOn(console, "log").mockImplementation(() => {});

// Dependencies
import initNotificationSubscriptionsCleanup from "../initNotificationSubscriptionsCleanup";
import { deleteExpiredTokens } from "../../services/subscription.service";
import schedule from "../scheduler";

describe("initNotificationSubscriptionsCleanup", () => {
	beforeEach(() => {
		// Reset mock function calls before each test
		jest.clearAllMocks();
	});

	it("should initialize schedule correctly", async () => {
		// Call the init function
		await initNotificationSubscriptionsCleanup();

		// Assert scheduleJob function was called once with expected arg
		expect(schedule.scheduleJob).toHaveBeenCalledTimes(1);
		expect(schedule.scheduleJob).toHaveBeenCalledWith(
			"notification_subscription_cleanup",
			"0 0 */7 * *",
			expect.any(Function)
		);
	});

	it("should call deleteExpiredTokens and log correctly", async () => {
		// Call the init function
		await initNotificationSubscriptionsCleanup();

		// Get scheduled job fn from mock of scheduler.scheduleJob
		const scheduledJob = (schedule.scheduleJob as jest.Mock).mock.calls[0][2];

		await scheduledJob();

		// Assert deleteExpiredTokens was called once
		expect(deleteExpiredTokens).toHaveBeenCalledTimes(1);

		// Assert console.log called once with correct message
		expect(console.log).toHaveBeenCalledTimes(2);
		expect(console.log).toHaveBeenNthCalledWith(
			1,
			"Initialized notification subscription cleanup."
		);
		expect(console.log).toHaveBeenNthCalledWith(2, "Deleted 3 expired notification subscriptions.");
	});
});
