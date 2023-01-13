// Dependencies
import { Router } from "express";

// Controller
import { marketingController } from "../controllers";

const router = Router();

// Routing
router.get("/notifications", marketingController.getNotificationMarketings);
router.get("/notifications/:notifMarketingId", marketingController.getNotificationMarketingDetail);
router.post("/notifications", marketingController.createNotificationMarketing);

export default router;
