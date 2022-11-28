// Dependencies
import { Router } from "express";

// Controller
import { addressController } from "../../controllers/client";

const router = Router();

// Routing
router.get("/address", addressController.getAllUserAddress);
router.post("/address", addressController.createAddress);
router.put("/address/:addressId", addressController.updateAddress);
router.delete("/address/:addressId", addressController.deleteCategory);

export default router;
