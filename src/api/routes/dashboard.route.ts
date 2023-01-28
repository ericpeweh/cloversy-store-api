// Dependencies
import { Router } from "express";

// Controller
import { dashboardController } from "../controllers";

const router = Router();

// Address Routing
router.get("/", dashboardController.getDashboardData);

export default router;
