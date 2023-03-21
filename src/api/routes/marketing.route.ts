// Dependencies
import { Router } from "express";

// Controller
import { marketingController } from "../controllers";

const router = Router();

// Validations
import validate from "../middlewares/validate";
import { marketingSchema } from "../validations/schemas";

// Notification marketing
router.get(
	"/notifications",
	validate(marketingSchema.getNotifMarketingsQuerySchema, "query"),
	marketingController.getNotificationMarketings
);

router.get(
	"/notifications/:notifMarketingId",
	validate(marketingSchema.getNotifMarketingDetailsParamsSchema, "params"),
	marketingController.getNotificationMarketingDetail
);

router.post(
	"/notifications",
	validate(marketingSchema.createNotifMarketingBodySchema, "body"),
	marketingController.createNotificationMarketing
);

router.post(
	"/notifications/:notifMarketingId/cancel",
	validate(marketingSchema.cancelNotifMarketingParamsSchema, "params"),
	marketingController.cancelNotificationMarketing
);

router.put(
	"/notifications/:notifMarketingId",
	validate(marketingSchema.updateNotifMarketingBodySchema, "body"),
	marketingController.updateNotificationMarketing
);

// Email marekting
router.get("/emails/template", marketingController.getEmailsTemplate);
router.get("/emails", marketingController.getEmailMarketings);
router.get("/emails/:emailMarketingId", marketingController.getEmailMarketingDetail);
router.post("/emails", marketingController.createEmailMarketing);
router.post("/emails/:emailMarketingId/cancel", marketingController.cancelEmailMarketing);
router.put("/emails/:emailMarketingId", marketingController.updateEmailMarketing);

export default router;
