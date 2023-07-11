// Mocks
jest.mock("../../services", () => ({
	marketingService: {
		getEmailMarketings: jest.fn(() =>
			Promise.resolve({
				emailMarketings: [
					{
						id: "1",
						scheduled: "2023-03-10T00:00:00.000Z",
						notification_code: "NOTIF_CODE_1",
						email_subject: "Email Subject 1",
						params: {},
						template_id: "1"
					},
					{
						id: "2",
						scheduled: "2023-03-11T00:00:00.000Z",
						notification_code: "NOTIF_CODE_2",
						email_subject: "Email Subject 2",
						params: {},
						template_id: "2"
					}
				]
			})
		),
		sendEmails: jest.fn().mockReturnValue({ successCount: 3 }),
		getEmailMarketingTargetUserIds: jest.fn(() => Promise.resolve([1, 2, 3])),
		updateEmailMarketing: jest.fn(() => Promise.resolve())
	},
	userService: {
		getUserEmailAndNameByIds: jest.fn(() =>
			Promise.resolve([
				{ full_name: "John Doe", email: "johndoe@example.com" },
				{ full_name: "Jane Doe", email: "janedoe@example.com" }
			])
		),
		getAllAdminUserIds: jest.fn(() => Promise.resolve([4, 5, 6]))
	},
	notificationService: {
		storeNotification: jest.fn(() => Promise.resolve())
	}
}));
jest.mock("../scheduler.ts");
jest.spyOn(console, "log").mockImplementation(() => {});

// Dependencies
import scheduler from "../scheduler";
import initScheduledEmailMarketings from "../initScheduledEmailMarketings";
import { marketingService, notificationService, userService } from "../../services";

describe("initScheduledEmailMarketings", () => {
	beforeEach(() => {
		// Reset mock function calls before each test
		jest.clearAllMocks();
	});

	it("should initialize schedule correctly", async () => {
		// Call the init function
		await initScheduledEmailMarketings();

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
		expect(console.log).toHaveBeenCalledWith("Scheduled 2 email marketing jobs");
	});

	it("should not schedule any task if no scheduled email marketing found", async () => {
		// Mock getEmailMarketings to return empty array
		(marketingService.getEmailMarketings as jest.Mock).mockResolvedValueOnce({
			emailMarketings: []
		});

		// Call the init function
		await initScheduledEmailMarketings();

		// Assert no scheduling activity is made
		expect(marketingService.getEmailMarketingTargetUserIds).not.toHaveBeenCalled();
		expect(marketingService.sendEmails).not.toHaveBeenCalled();
		expect(userService.getUserEmailAndNameByIds).not.toHaveBeenCalled();
		expect(userService.getAllAdminUserIds).not.toHaveBeenCalled();
		expect(scheduler.scheduleJob).not.toHaveBeenCalled();
		expect(marketingService.updateEmailMarketing).not.toHaveBeenCalled();
		expect(notificationService.storeNotification).not.toHaveBeenCalled();

		expect(console.log).toHaveBeenCalledTimes(1);
		expect(console.log).toHaveBeenCalledWith("Scheduled 0 email marketing job");
	});

	it("should schedule email marketing jobs correctly", async () => {
		// Call the init function
		await initScheduledEmailMarketings();

		// Get scheduled job fn from mock of scheduler.scheduleJob
		const scheduledJob1 = (scheduler.scheduleJob as jest.Mock).mock.calls[0][2];
		const scheduledJob2 = (scheduler.scheduleJob as jest.Mock).mock.calls[1][2];

		await scheduledJob1();
		await scheduledJob2();

		// Assert getEmailMarketingTargetUserIds getUserEmailAndNameByIds were called twice each
		expect(marketingService.getEmailMarketingTargetUserIds).toHaveBeenCalledTimes(2);
		expect(marketingService.getEmailMarketingTargetUserIds).toHaveBeenCalledWith("1");
		expect(marketingService.getEmailMarketingTargetUserIds).toHaveBeenCalledWith("2");

		expect(userService.getUserEmailAndNameByIds).toHaveBeenCalledTimes(2);
		expect(userService.getUserEmailAndNameByIds).toHaveBeenCalledWith([1, 2, 3]);
		expect(userService.getUserEmailAndNameByIds).toHaveBeenCalledWith([1, 2, 3]);

		// Assert sendEmails and updateEmailMarketing were called for each email marketing
		expect(marketingService.sendEmails).toHaveBeenCalledTimes(2);
		expect(marketingService.updateEmailMarketing).toHaveBeenCalledTimes(2);

		// Assert storeNotification was called once with expected args
		expect(notificationService.storeNotification).toHaveBeenCalledTimes(2);
		expect(notificationService.storeNotification).toHaveBeenNthCalledWith(1, [4, 5, 6], {
			title: "Marketing email terjadwal telah dikirim",
			description: "Marketing email #NOTIF_CODE_1 berhasil dikirim.",
			category_id: 2, // = marketing category
			action_link: "https://admin.cloversy.id/marketing/email/1"
		});
		expect(notificationService.storeNotification).toHaveBeenNthCalledWith(2, [4, 5, 6], {
			title: "Marketing email terjadwal telah dikirim",
			description: "Marketing email #NOTIF_CODE_2 berhasil dikirim.",
			category_id: 2, // = marketing category
			action_link: "https://admin.cloversy.id/marketing/email/2"
		});
	});
});
