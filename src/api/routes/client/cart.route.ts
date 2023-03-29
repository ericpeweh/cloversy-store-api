// Dependencies
import { Router } from "express";

// Controller
import { cartController } from "../../controllers/client";

const router = Router();

// Validations
import validate from "../../middlewares/validate";
import { cartSchema } from "../../validations/schemas";

// Address Routing
router.get("/", cartController.getCartItems);

router.post(
	"/add",
	validate(cartSchema.postAddProductToCartBodySchema, "body"),
	cartController.addProductToCart
);

router.patch(
	"/update",
	validate(cartSchema.patchUpdateCartItemBodySchema, "body"),
	cartController.updateCartItem
);

router.delete(
	"/remove",
	validate(cartSchema.deleteCartItemBodySchema, "body"),
	cartController.deleteCartItem
);

router.post("/sync", cartController.syncCartItems);

router.delete("/sync", cartController.clearSessionCart);

export default router;
