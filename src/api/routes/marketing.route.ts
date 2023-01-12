// Dependencies
import { Router } from "express";

// Controller
import { marketingController } from "../controllers";

const router = Router();

// Routing
router.post("/notifications", marketingController.createNotificationMarketing);

export default router;
