// Dependencies
import { Router } from "express";

// Controller
import { brandController } from "../controllers";

const router = Router();

// Routing
router.get("/", brandController.getAllBrands);
router.post("/", brandController.createBrand);
router.put("/:brandId", brandController.updateBrand);
router.delete("/:brandId", brandController.deleteBrand);

export default router;
