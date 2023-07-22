// Controllers
import * as productController from "./product.controller";
import * as categoryController from "./category.controller";
import * as brandController from "./brand.controller";
import * as userController from "./user.controller";
import * as voucherController from "./voucher.controller";
import * as authController from "./auth.controller";
import * as transactionController from "./transaction.controller";
import * as reviewController from "./review.controller";
import * as subscriptionController from "./subscription.controller";
import * as emailMarketingController from "./email.marketing.controller";
import * as notifMarketingController from "./notif.marketing.controller";
import * as notificationController from "./notification.controller";
import * as dashboardController from "./dashboard.controller";
import * as chatController from "./chat.controller";
import * as reportController from "./report.controller";

// Combine splited marketing controllers
const marketingController = { ...emailMarketingController, ...notifMarketingController };

export {
	productController,
	categoryController,
	brandController,
	userController,
	voucherController,
	authController,
	transactionController,
	reviewController,
	subscriptionController,
	marketingController,
	notificationController,
	dashboardController,
	chatController,
	reportController
};
