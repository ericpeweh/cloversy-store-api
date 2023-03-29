// Dependencies
import { Router } from "express";

// Config
import upload from "../../../config/uploadFile";

// Controller
import { addressController, userController, wishlistController } from "../../controllers/client";

// Validations
import validate from "../../middlewares/validate";
import { accountSchema } from "../../validations/schemas";

const router = Router();

// Account Routing
router.patch(
	"/details",
	validate(accountSchema.updateUserAccountDetailsSchema, "body"),
	userController.updateUserAccountDetails
);
router.put(
	"/details/picture",
	upload.single("image"),
	validate(accountSchema.putUserProfilePictureSchema, ""),
	userController.changeUserProfilePicture
);
router.delete("/details/picture", userController.deleteUserProfilePicture);

// Address Routing
router.get("/address", addressController.getAllUserAddress);

router.post(
	"/address",
	validate(accountSchema.createAddressBodySchema, "body"),
	addressController.createAddress
);

router.put(
	"/address/:addressId",
	validate(accountSchema.updateAddressParamsSchema, "params"),
	validate(accountSchema.updateAddressBodySchema, "body"),
	addressController.updateAddress
);

router.delete(
	"/address/:addressId",
	validate(accountSchema.deleteAddressParamsSchema, "params"),
	addressController.deleteAddress
);

// Wishlist Routing
router.get("/wishlist", wishlistController.getUserWishlist);

router.post(
	"/wishlist/:productId",
	validate(accountSchema.postAddProductToWishlistParamsSchema, "params"),
	wishlistController.addProductToWishlist
);

router.delete(
	"/wishlist/:productId",
	validate(accountSchema.deleteProductFromWishlistParamsSchema, "params"),
	wishlistController.deleteProductFromWishlist
);

router.delete("/wishlist", wishlistController.emptyWishlist);

export default router;
