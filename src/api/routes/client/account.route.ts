// Dependencies
import { Router } from "express";

// Config
import upload from "../../../config/uploadFile";

// Controller
import { addressController, userController } from "../../controllers/client";

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

export default router;
