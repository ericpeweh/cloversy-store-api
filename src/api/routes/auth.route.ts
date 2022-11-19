// Dependencies
import { Router } from "express";

// Controller
import { authController } from "../controllers";

const router = Router();

// Routing
router.get("/", authController.authUser);

export default router;
