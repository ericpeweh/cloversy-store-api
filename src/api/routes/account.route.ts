// Dependencies
import { Router } from "express";

// Config
import upload from "../../config/uploadFile";

// Controller (client)
import { userController } from "../controllers/client";

// Validations
import validate from "../middlewares/validate";
import { accountSchema } from "../validations/schemas";

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

export default router;
