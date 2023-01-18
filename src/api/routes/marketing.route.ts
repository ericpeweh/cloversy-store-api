// Dependencies
import { Router } from "express";

// Controller
import { marketingController } from "../controllers";

const router = Router();

// Notification marketing
router.get("/notifications", marketingController.getNotificationMarketings);
router.get("/notifications/:notifMarketingId", marketingController.getNotificationMarketingDetail);
router.post("/notifications", marketingController.createNotificationMarketing);
router.post(
	"/notifications/:notifMarketingId/cancel",
	marketingController.cancelNotificationMarketing
);
router.put("/notifications/:notifMarketingId", marketingController.updateNotificationMarketing);

// Email marekting
router.get("/emails/template", marketingController.getEmailsTemplate);
router.get("/emails", marketingController.getEmailMarketings);
router.get("/emails/:emailMarketingId", marketingController.getEmailMarketingDetail);
router.post("/emails", marketingController.createEmailMarketing);
router.post("/emails/:emailMarketingId/cancel", marketingController.cancelEmailMarketing);
router.put("/emails/:emailMarketingId", marketingController.updateEmailMarketing);

export default router;
