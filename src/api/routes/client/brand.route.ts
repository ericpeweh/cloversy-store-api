// Dependencies
import { Router } from "express";

// Controller
import { brandController } from "../../controllers/client";

const router = Router();

// Routing
router.get("/", brandController.getAllBrands);

export default router;
