// Mocks
jest.mock("../generateUniqueId", () => jest.fn().mockReturnValue("VOUCHERCODE"));
jest.mock("../scheduler.ts");
jest.mock("../../services", () => ({
	marketingService: {
		getSelectedBirthdayUsers: jest.fn().mockResolvedValue([1, 2, 3]),
		sendEmails: jest.fn().mockReturnValue({ successCount: 3 }),
		createOffers: jest.fn()
	},
	userService: {
		getUserEmailAndNameByIds: jest.fn().mockReturnValue([
			{ email: "user1@example.com", full_name: "User 1" },
			{ email: "user2@example.com", full_name: "User 2" },
			{ email: "user3@example.com", full_name: "User 3" }
		]),
		getAllAdminUserIds: jest.fn().mockReturnValue([4, 5, 6])
	},
	voucherService: {
		createVoucher: jest.fn().mockReturnValue({
			rows: [
				{
					code: "VOUCHERCODE",
					title: "Happy Birthday Clovers",
					expiryDate: new Date().toISOString(),
					discount: 100000,
					discountType: "value",
					status: "active",
					usageLimit: 3,
					voucherScope: "user",
					description: "Birthday offer given by auto-offer system 2023-03-09"
				}
			]
		})
	},
	notificationService: {
		storeNotification: jest.fn()
	}
}));
jest.spyOn(global.console, "log").mockImplementation(() => {});

// Dependencies
import initBirthdayAutoOfferMarketing, {
	birthdayAutoOfferMarketingFn
} from "../initBirthdayAutoOfferMarketing";
import { marketingService, userService, voucherService, notificationService } from "../../services";
import schedule from "../scheduler";

describe("initBirthdayAutoOfferMarketing", () => {
	beforeEach(() => {
		// Reset mock function calls before each test
		jest.clearAllMocks();
	});

	it("should initialize schedule correctly", () => {
		// Call the init function
		initBirthdayAutoOfferMarketing();

		// Assert scheduleJob function called once with correct arguments
		expect(schedule.scheduleJob).toHaveBeenCalledTimes(1);
		expect(schedule.scheduleJob).toHaveBeenCalledWith(
			"notification_subscription_cleanup",
			"0 0 * * *",
			expect.any(Function)
		);

		// Assert console.log called once with correct message
		expect(console.log).toHaveBeenCalledTimes(1);
		expect(console.log).toHaveBeenCalledWith("Initialized birthday auto-offer system.");
	});

	it("should not send offers when there is no selected users", async () => {
		// Mock return value of the getSelectedBirthdayUsers
		(
			marketingService.getSelectedBirthdayUsers as jest.MockedFn<
				typeof marketingService.getSelectedBirthdayUsers
			>
		).mockResolvedValueOnce([]);

		// Call function
		await birthdayAutoOfferMarketingFn();

		// Assert getSelectedBirthdayUsers was called once
		expect(marketingService.getSelectedBirthdayUsers).toHaveBeenCalledTimes(1);

		// Assert other service functions have not been called
		expect(voucherService.createVoucher).not.toHaveBeenCalled();
		expect(userService.getUserEmailAndNameByIds).not.toHaveBeenCalled();
		expect(marketingService.sendEmails).not.toHaveBeenCalled();
		expect(userService.getAllAdminUserIds).not.toHaveBeenCalled();
		expect(notificationService.storeNotification).not.toHaveBeenCalled();
	});

	it("should send offers when there are selected users", async () => {
		// Call function
		await birthdayAutoOfferMarketingFn();

		// Assert getSelectedBirthdayUsers was called once
		expect(marketingService.getSelectedBirthdayUsers).toHaveBeenCalledTimes(1);

		// Assert createVoucher was called once with expected args
		expect(voucherService.createVoucher).toHaveBeenCalledWith(
			[
				"VOUCHERCODE",
				"Happy Birthday Clovers",
				// Assert for ISO date format
				expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z?$/),
				100000,
				"value",
				"active",
				3,
				"user",
				`Birthday offer given by auto-offer system ${new Date().toISOString().slice(0, 10)}`
			],
			[1, 2, 3]
		);

		// Assert getUserEmailAndNameByIds was called with with the expected expected args
		expect(userService.getUserEmailAndNameByIds).toHaveBeenCalledWith([1, 2, 3]);

		// Assert sendEmails was called with the expected args
		expect(marketingService.sendEmails).toHaveBeenCalledWith({
			to: [
				{ email: "user1@example.com", name: "User 1" },
				{ email: "user2@example.com", name: "User 2" },
				{ email: "user3@example.com", name: "User 3" }
			],
			templateId: 1,
			params: {
				voucher_code: "VOUCHERCODE",
				discount_value: "Rp. 100.000,-",
				email_subject: "Happy Birthday Clovers! Voucher diskon untuk kamu yang berulang tahun :)"
			}
		});

		// Assert createOffers was called with expected args
		expect(marketingService.createOffers).toHaveBeenCalledWith(
			{
				offerName: "birthday_offer"
			},
			[1, 2, 3]
		);

		expect(userService.getAllAdminUserIds).toHaveBeenCalledTimes(1);

		// Assert store notification was called with expected args
		expect(notificationService.storeNotification).toHaveBeenCalledWith([4, 5, 6], {
			title: "Penawaran otomatis ulang tahun telah dikirim",
			description: `Berhasil mengirim ke 3 dari 3 pengguna.`,
			category_id: 2, // = marketing category,
			action_link: null
		});

		expect(console.log).toHaveBeenCalledWith(`Birthday auto-offers sent to 3 users.`);
	});
});
