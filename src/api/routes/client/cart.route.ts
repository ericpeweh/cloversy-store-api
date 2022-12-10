// Dependencies
import { Router } from "express";

// Controller
import { cartController } from "../../controllers/client";

const router = Router();

// Address Routing
router.get("/", cartController.getCartItems);
router.post("/add", cartController.addProductToCart);
router.patch("/update", cartController.updateCartItem);
router.delete("/remove", cartController.deleteCartItem);
router.post("/sync", cartController.syncCartItems);
router.delete("/sync", cartController.clearSessionCart);

export default router;
