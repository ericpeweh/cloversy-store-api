"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const express_1 = require("express");
// Config
const uploadFile_1 = __importDefault(require("../../../config/uploadFile"));
// Controller
const client_1 = require("../../controllers/client");
const router = (0, express_1.Router)();
// Account Routing
router.patch("/details", client_1.userController.updateUserAccountDetails);
router.put("/details/picture", uploadFile_1.default.single("image"), client_1.userController.changeUserProfilePicture);
router.delete("/details/picture", client_1.userController.deleteUserProfilePicture);
// Address Routing
router.get("/address", client_1.addressController.getAllUserAddress);
router.post("/address", client_1.addressController.createAddress);
router.put("/address/:addressId", client_1.addressController.updateAddress);
router.delete("/address/:addressId", client_1.addressController.deleteAddress);
// Wishlist Routing
router.get("/wishlist", client_1.wishlistController.getUserWishlist);
router.post("/wishlist/:productId", client_1.wishlistController.addProductToWishlist);
router.delete("/wishlist/:productId", client_1.wishlistController.deleteProductFromWishlist);
router.delete("/wishlist", client_1.wishlistController.emptyWishlist);
exports.default = router;
