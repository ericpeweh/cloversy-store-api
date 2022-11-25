// Dependencies
import { Router } from "express";

// Controller
import { dataController } from "../../controllers/client";

const router = Router();

// Routing
router.get("/province", dataController.getAllProvinces);
router.get("/city", dataController.getCitiesByProvinceId);

export default router;
