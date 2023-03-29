// Dependencies
import { Router } from "express";

// Controller
import { categoryController } from "../../controllers/client";

const router = Router();

// Routing
router.get("/", categoryController.getAllCategories);

export default router;
