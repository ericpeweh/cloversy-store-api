// Dependencies
import { Router } from "express";

// Controller
import { subscriptionController } from "../../controllers/client";

// Middlewares
import { getUserData, isAuth } from "../../middlewares";

const router = Router();

// Routing
router.post("/email", subscriptionController.subscribeToEmail);
router.delete("/email", subscriptionController.unsubscribeFromEmail);
router.post("/push", isAuth, getUserData, subscriptionController.subscribeToPush);
router.delete("/push", isAuth, getUserData, subscriptionController.unsubscribeFromPush);

export default router;
