// Mocks
jest.mock("../../services", () => ({
	marketingService: {
		getNotificationMarketings: jest.fn(() =>
			Promise.resolve({
				notifMarketings: [
					{
						id: "1",
						scheduled: "2023-03-10T00:00:00.000Z",
						notification_code: "NOTIF_CODE_1",
						send_to: "all"
					},
					{
						id: "2",
						scheduled: "2023-03-11T00:00:00.000Z",
						notification_code: "NOTIF_CODE_2",
						send_to: "selected"
					}
				]
			})
		),

		getNotifMarketingTargetUserIds: jest.fn(() => Promise.resolve([1, 2, 3])),
		updateNotificationMarketing: jest.fn(() => Promise.resolve())
	},
	userService: {
		getAllAdminUserIds: jest.fn(() => Promise.resolve([4, 5, 6]))
	},
	notificationService: {
		sendNotifications: jest.fn().mockReturnValue({ successCount: 3 }),
		getAllUserNotificationTokens: jest.fn(() => Promise.resolve(["tokenA", "tokenB", "tokenC"])),
		getUserNotificationTokens: jest.fn(() => Promise.resolve(["tokenA"])),
		storeNotification: jest.fn(() => Promise.resolve())
	}
}));
jest.mock("../scheduler.ts");
jest.spyOn(console, "log").mockImplementation(() => {});

// Dependencies
import scheduler from "../scheduler";
import initScheduledNotifMarketings from "../initScheduledNotifMarketings";
import { marketingService, notificationService, userService } from "../../services";

describe("initScheduledNotifMarketings", () => {
	beforeEach(() => {
		// Reset mock function calls before each test
		jest.clearAllMocks();
	});

	it("should initialize schedule correctly", async () => {
		// Call the init function
		await initScheduledNotifMarketings();

		// Assert scheduleJob function was called twice with expected args
		expect(scheduler.scheduleJob).toHaveBeenCalledTimes(2);
		expect(scheduler.scheduleJob).toHaveBeenNthCalledWith(
			1,
			"NOTIF_CODE_1",
			new Date("2023-03-10T00:00:00.000Z"),
			expect.any(Function)
		);
		expect(scheduler.scheduleJob).toHaveBeenNthCalledWith(
			2,
			"NOTIF_CODE_2",
			new Date("2023-03-11T00:00:00.000Z"),
			expect.any(Function)
		);

		expect(console.log).toHaveBeenCalledTimes(1);
		expect(console.log).toHaveBeenCalledWith("Scheduled 2 notification marketing jobs");
	});

	it("should not schedule any task if no scheduled notification marketing found", async () => {
		// Mock getEmailMarketings to return empty array
		(marketingService.getNotificationMarketings as jest.Mock).mockResolvedValueOnce({
			notifMarketings: []
		});

		// Call the init function
		await initScheduledNotifMarketings();

		// Assert no scheduling activity is made
		expect(scheduler.scheduleJob).not.toHaveBeenCalled();

		expect(notificationService.getAllUserNotificationTokens).not.toHaveBeenCalled();
		expect(notificationService.sendNotifications).not.toHaveBeenCalled();
		expect(notificationService.getUserNotificationTokens).not.toHaveBeenCalled();
		expect(notificationService.storeNotification).not.toHaveBeenCalled();

		expect(marketingService.getNotifMarketingTargetUserIds).not.toHaveBeenCalled();
		expect(marketingService.updateNotificationMarketing).not.toHaveBeenCalled();

		expect(userService.getAllAdminUserIds).not.toHaveBeenCalled();

		expect(console.log).toHaveBeenCalledTimes(1);
		expect(console.log).toHaveBeenCalledWith("Scheduled 0 notification marketing job");
	});

	// it("should schedule email marketing jobs correctly", async () => {
	// 	// Call the init function
	// 	await initScheduledNotifMarketings();

	// 	// Get scheduled job fn from mock of scheduler.scheduleJob
	// 	const scheduledJob1 = (scheduler.scheduleJob as jest.Mock).mock.calls[0][2];
	// 	const scheduledJob2 = (scheduler.scheduleJob as jest.Mock).mock.calls[1][2];

	// 	await scheduledJob1();
	// 	await scheduledJob2();

	// 	// Assert getNotifMarketingTargetUserIds getUserEmailAndNameByIds were called twice each
	// 	expect(marketingService.getNotifMarketingTargetUserIds).toHaveBeenCalledTimes(2);
	// 	expect(marketingService.getNotifMarketingTargetUserIds).toHaveBeenCalledWith("1");
	// 	expect(marketingService.getNotifMarketingTargetUserIds).toHaveBeenCalledWith("2");

	// 	expect(userService.getUserEmailAndNameByIds).toHaveBeenCalledTimes(2);
	// 	expect(userService.getUserEmailAndNameByIds).toHaveBeenCalledWith([1, 2, 3]);
	// 	expect(userService.getUserEmailAndNameByIds).toHaveBeenCalledWith([1, 2, 3]);

	// 	// Assert sendEmails and updateEmailMarketing were called for each email marketing
	// 	expect(marketingService.sendEmails).toHaveBeenCalledTimes(2);
	// 	expect(marketingService.updateEmailMarketing).toHaveBeenCalledTimes(2);

	// 	// Assert storeNotification was called once with expected args
	// 	expect(notificationService.storeNotification).toHaveBeenCalledTimes(2);
	// 	expect(notificationService.storeNotification).toHaveBeenNthCalledWith(1, [4, 5, 6], {
	// 		title: "Marketing email terjadwal telah dikirim",
	// 		description: `Marketing email #NOTIF_CODE_1 berhasil dikirim.`,
	// 		category_id: 2, // = marketing category
	// 		action_link: `http://localhost:3001/marketing/email/1`
	// 	});
	// 	expect(notificationService.storeNotification).toHaveBeenNthCalledWith(2, [4, 5, 6], {
	// 		title: "Marketing email terjadwal telah dikirim",
	// 		description: `Marketing email #NOTIF_CODE_2 berhasil dikirim.`,
	// 		category_id: 2, // = marketing category
	// 		action_link: `http://localhost:3001/marketing/email/2`
	// 	});
	// });
});
