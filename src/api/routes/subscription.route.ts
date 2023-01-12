// Dependencies
import { Router } from "express";

// Controller
import { subscriptionController } from "../controllers";

const router = Router();

// Routing
router.get("/push", subscriptionController.getPushSubscriptions);

export default router;
