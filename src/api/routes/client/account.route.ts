// Dependencies
import { Router } from "express";

// Config
import upload from "../../../config/uploadFile";

// Controller
import { addressController, userController, wishlistController } from "../../controllers/client";

const router = Router();

// Account Routing
router.patch("/details", userController.updateUserAccountDetails);
router.put("/details/picture", upload.single("image"), userController.changeUserProfilePicture);
router.delete("/details/picture", userController.deleteUserProfilePicture);

// Address Routing
router.get("/address", addressController.getAllUserAddress);
router.post("/address", addressController.createAddress);
router.put("/address/:addressId", addressController.updateAddress);
router.delete("/address/:addressId", addressController.deleteAddress);

// Wishlist Routing
router.get("/wishlist", wishlistController.getUserWishlist);
router.post("/wishlist/:productId", wishlistController.addProductToWishlist);
router.delete("/wishlist/:productId", wishlistController.deleteProductFromWishlist);
router.delete("/wishlist", wishlistController.emptyWishlist);

export default router;
