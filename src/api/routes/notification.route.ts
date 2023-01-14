// Dependencies
import { Router } from "express";

// Controller
import { notificationController } from "../controllers";

const router = Router();

// Routing
router.get("/", notificationController.getAllNotifications);
router.post("/:notificationId/read", notificationController.readNotification);

export default router;
