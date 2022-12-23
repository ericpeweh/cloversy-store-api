// Dependencies
import { Router } from "express";

// Controller
import { activityController } from "../../controllers/client";

const router = Router();

// Routing
router.get("/product-last-seen", activityController.getUserLastSeenProducts);
router.post("/product-last-seen", activityController.trackUserLastSeenProduct);

export default router;
