// Dependencies
import { Router } from "express";

// Config
import upload from "../../config/uploadFile";

// Controller (client)
import { userController } from "../controllers/client";

const router = Router();

// Account Routing
router.patch("/details", userController.updateUserAccountDetails);
router.put("/details/picture", upload.single("image"), userController.changeUserProfilePicture);
router.delete("/details/picture", userController.deleteUserProfilePicture);

export default router;
