// Dependencies
import { Router } from "express";

// Controller
import { marketingController } from "../controllers";

const router = Router();

// Validations
import validate from "../middlewares/validate";
import { marketingSchema } from "../validations/schemas";

/* ===================================
  NOTIFICATION MARKETINGS
=================================== */
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

/* ===================================
  EMAIL MARKETINGS
=================================== */
router.get("/emails/template", marketingController.getEmailsTemplate);

router.get(
	"/emails",
	validate(marketingSchema.getEmailMarketingsQuerySchema, "query"),
	marketingController.getEmailMarketings
);

router.get(
	"/emails/:emailMarketingId",
	validate(marketingSchema.getEmailMarketingDetailsParamsSchema, "params"),
	marketingController.getEmailMarketingDetail
);

router.post(
	"/emails",
	validate(marketingSchema.createEmailMarketingBodySchema, "body"),
	marketingController.createEmailMarketing
);

router.post(
	"/emails/:emailMarketingId/cancel",
	validate(marketingSchema.cancelEmailMarketingParamsSchema, "params"),
	marketingController.cancelEmailMarketing
);

router.put(
	"/emails/:emailMarketingId",
	validate(marketingSchema.updateEmailMarketingBodySchema, "body"),
	marketingController.updateEmailMarketing
);

export default router;
