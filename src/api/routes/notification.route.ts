// Dependencies
import { Router } from "express";

// Controller
import { notificationController } from "../controllers";

const router = Router();

// Validations
import validate from "../middlewares/validate";
import { notificationSchema } from "../validations/schemas";

// Routing
router.get(
	"/",
	validate(notificationSchema.getAllNotificationsQuerySchema, "query"),
	notificationController.getAllNotifications
);
router.post(
	"/:notificationId/read",
	validate(notificationSchema.postReadNotificationParamsSchema, "params"),
	notificationController.readNotification
);

export default router;
