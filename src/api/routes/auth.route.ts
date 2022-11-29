// Dependencies
import { Router } from "express";

// Controller
import { authController } from "../controllers";

// Middlewares
import { getUserData } from "../middlewares";

const router = Router();

// Routing
router.get("/", authController.authUser);
router.post("/resetpassword", getUserData, authController.resetPassword);

export default router;
