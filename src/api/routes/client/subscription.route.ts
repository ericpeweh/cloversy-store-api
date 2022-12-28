// Dependencies
import { Router } from "express";

// Controller
import { subscriptionController } from "../../controllers/client";

const router = Router();

// Routing
router.post("/email", subscriptionController.subscribeToEmail);
router.delete("/email", subscriptionController.unsubscribeFromEmail);

export default router;
