// Config
import scheduler from "./scheduler";

// Utils
import generateUniqueId from "./generateUniqueId";

// Services
import { marketingService, notificationService, userService, voucherService } from "../services";

// Types
import { EmailObject } from "../interfaces";

const initBirthdayAutoOfferMarketing = () => {
	// Send voucher offer birthday to users
	// Run everyday at 12:00 AM
	scheduler.scheduleJob("notification_subscription_cleanup", "0 0 * * *", () => {
		birthdayAutoOfferMarketingFn();
	});

	console.log("Initialized birthday auto-offer system.");
};

export const birthdayAutoOfferMarketingFn = async () => {
	// Get birthday users
	const selectedUserIds = await marketingService.getSelectedBirthdayUsers();

	// If no user selected, stop offer flow
	if (selectedUserIds.length === 0) return;

	// Create voucher for birthday users
	const {
		code,
		title,
		expiryDate,
		discount,
		discountType,
		status,
		usageLimit,
		voucherScope,
		description
	} = {
		code: generateUniqueId(),
		title: "Happy Birthday Clovers",
		expiryDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days after today
		discount: 100000,
		discountType: "value",
		status: "active",
		usageLimit: selectedUserIds.length,
		voucherScope: "user",
		description: `Birthday offer given by auto-offer system ${new Date()
			.toISOString()
			.slice(0, 10)}`
	};

	const voucherQueryData = [
		code,
		title,
		expiryDate,
		discount,
		discountType,
		status,
		usageLimit,
		voucherScope,
		description
	];

	const newVoucher = (await voucherService.createVoucher(voucherQueryData, selectedUserIds))
		.rows[0];

	// Send offer email to users
	const targets = await userService.getUserEmailAndNameByIds(selectedUserIds);

	const emailSubject = "Happy Birthday Clovers! Voucher diskon untuk kamu yang berulang tahun :)";
	const emailParams = {
		voucher_code: newVoucher.code,
		discount_value: "Rp. 100.000,-",
		email_subject: emailSubject
	};

	const emailObject: EmailObject = {
		to: targets.map(({ full_name, email }) => ({
			email,
			name: full_name
		})),
		templateId: 1, // = birthday offer template
		params: emailParams
	};

	const emailResult = await marketingService.sendEmails(emailObject);

	// Store offer data to offers table (prevent duplicate offer)
	await marketingService.createOffers({ offerName: "birthday_offer" }, selectedUserIds);

	// Store notification to admins
	const adminUserIds = await userService.getAllAdminUserIds();
	const notificationItem = {
		title: "Penawaran otomatis ulang tahun telah dikirim",
		description: `Berhasil mengirim ke ${emailResult.successCount} dari ${selectedUserIds.length} pengguna.`,
		category_id: 2, // = marketing category,
		action_link: null
	};
	await notificationService.storeNotification(adminUserIds, notificationItem);

	console.log(
		`Birthday auto-offers sent to ${selectedUserIds.length} ${
			selectedUserIds.length > 1 ? "users" : "user"
		}.`
	);
};

export default initBirthdayAutoOfferMarketing;
