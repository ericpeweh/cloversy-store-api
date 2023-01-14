// Dependencies
import { Router } from "express";

// Controller
import { marketingController } from "../controllers";

const router = Router();

// Routing
router.get("/notifications", marketingController.getNotificationMarketings);
router.get("/notifications/:notifMarketingId", marketingController.getNotificationMarketingDetail);
router.post("/notifications", marketingController.createNotificationMarketing);
router.post(
	"/notifications/:notifMarketingId/cancel",
	marketingController.cancelNotificationMarketing
);
router.put("/notifications/:notifMarketingId", marketingController.updateNotificationMarketing);

export default router;
