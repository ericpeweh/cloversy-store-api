// Dependencies
import { Router } from "express";

// Controller
import { userController } from "../controllers";

const router = Router();

// Routing
router.get("/", userController.getAllCustomers);
router.get("/:userId", userController.getSingleCustomer);

export default router;
