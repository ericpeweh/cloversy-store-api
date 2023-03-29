// Mocks
const notifMarketings: Partial<NotifMarketingItem>[] = [
	{
		id: 1,
		scheduled: "2023-03-10T00:00:00.000Z",
		notification_code: "NOTIF_CODE_1",
		send_to: "all",
		title: "NOTIF_TITLE_1",
		message_body: "MESSAGE_BODY_1",
		message_title: "MESSAGE_TITLE_1",
		image_url: "IMAGE_URL_1",
		deeplink_url: "DEEPLINK_URL_1",
		action_link: "ACTION_LINK_1",
		action_title: "ACTION_TITLE_1"
	},
	{
		id: 2,
		scheduled: "2023-03-11T00:00:00.000Z",
		notification_code: "NOTIF_CODE_2",
		send_to: "selected",
		title: "NOTIF_TITLE_2",
		message_body: "MESSAGE_BODY_2",
		message_title: "MESSAGE_TITLE_2",
		action_link: "ACTION_LINK_2",
		action_title: "ACTION_TITLE_2"
	}
];

const notifMessages: NotificationMessage[] = [
	{
		title: "MESSAGE_TITLE_1",
		body: "MESSAGE_BODY_1",
		imageUrl: "IMAGE_URL_1",
		deeplinkUrl: "DEEPLINK_URL_1",
		actionLink: "ACTION_LINK_1",
		actionTitle: "ACTION_TITLE_1"
	},
	{
		title: "MESSAGE_TITLE_2",
		body: "MESSAGE_BODY_2",
		actionLink: "ACTION_LINK_2",
		actionTitle: "ACTION_TITLE_2"
	}
];

jest.mock("../../services", () => ({
	marketingService: {
		getNotificationMarketings: jest.fn(() =>
			Promise.resolve({
				notifMarketings
			})
		),

		getNotifMarketingTargetUserIds: jest.fn(() => Promise.resolve([1, 2, 3])),
		updateNotificationMarketing: jest.fn(() => Promise.resolve())
	},
	userService: {
		getAllAdminUserIds: jest.fn(() => Promise.resolve([4, 5, 6]))
	},
	notificationService: {
		sendNotifications: jest
			.fn()
			.mockReturnValue({ successCount: 3, failureCount: 0, sendAt: new Date().toISOString() }),
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
import { NotificationMessage, NotifMarketingItem } from "../../interfaces";

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

		// Assert console.log was called twice with expected message
		expect(console.log).toHaveBeenCalledTimes(1);
		expect(console.log).toHaveBeenCalledWith("Scheduled 0 notification marketing job");
	});

	it("should schedule email marketing jobs correctly", async () => {
		// Call the init function
		await initScheduledNotifMarketings();

		// Assert getAllUserNotificationTokens, getNotifMarketingTargetUserIds  were called once each with correct args
		expect(notificationService.getAllUserNotificationTokens).toHaveBeenCalledTimes(1);
		expect(marketingService.getNotifMarketingTargetUserIds).toHaveBeenCalledTimes(1);
		expect(marketingService.getNotifMarketingTargetUserIds).toHaveBeenCalledWith("2");

		// Get scheduled job fn from mock of scheduler.scheduleJob
		const scheduledJob1 = (scheduler.scheduleJob as jest.Mock).mock.calls[0][2];
		const scheduledJob2 = (scheduler.scheduleJob as jest.Mock).mock.calls[1][2];

		await scheduledJob1();
		await scheduledJob2();

		// Assert sendNotifications was called for twice with expected args
		// expect(notificationService.sendNotifications).toHaveBeenCalledTimes(2);
		expect(notificationService.sendNotifications).toHaveBeenNthCalledWith(
			1,
			notifMessages[0],
			["tokenA", "tokenB", "tokenC"],
			{ removeFailedTokens: true }
		);
		expect(notificationService.sendNotifications).toHaveBeenNthCalledWith(
			2,
			notifMessages[1],
			["tokenA"],
			{ removeFailedTokens: true }
		);

		// Assert updateNotificationMarketing was called for each notif marketing
		expect(marketingService.updateNotificationMarketing).toHaveBeenCalledTimes(2);
		expect(marketingService.updateNotificationMarketing).toHaveBeenNthCalledWith(1, {
			updatedNotifMarketingData: {
				failure_count: 0,
				success_count: 3,
				sent_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
			},
			notifMarketingId: 1
		});
		expect(marketingService.updateNotificationMarketing).toHaveBeenNthCalledWith(2, {
			updatedNotifMarketingData: {
				failure_count: 0,
				success_count: 3,
				sent_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
			},
			notifMarketingId: 2
		});

		// Assert getAllAdminUserIds was called once
		expect(userService.getAllAdminUserIds).toHaveBeenCalledTimes(2);

		// Assert storeNotification was called once with expected args
		expect(notificationService.storeNotification).toHaveBeenCalledTimes(2);
		expect(notificationService.storeNotification).toHaveBeenNthCalledWith(1, [4, 5, 6], {
			title: "Marketing notifikasi terjadwal telah dikirim",
			description: `Marketing notifikasi #NOTIF_CODE_1 berhasil dikirim.`,
			category_id: 2, // = marketing category
			action_link: `http://localhost:3001/marketing/notification/1`
		});
		expect(notificationService.storeNotification).toHaveBeenNthCalledWith(2, [4, 5, 6], {
			title: "Marketing notifikasi terjadwal telah dikirim",
			description: `Marketing notifikasi #NOTIF_CODE_2 berhasil dikirim.`,
			category_id: 2, // = marketing category
			action_link: `http://localhost:3001/marketing/notification/2`
		});
	});
});
