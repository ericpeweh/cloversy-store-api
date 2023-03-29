// Dependencies
import { Router } from "express";

// Controller
import { midtransController } from "../../controllers/client";

const router = Router();

// Routing
router.post("/notifications", midtransController.handleNotifications);

export default router;
