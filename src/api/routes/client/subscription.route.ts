// Dependencies
import { Router } from "express";

// Controller
import { subscriptionController } from "../../controllers/client";

// Middlewares
import { getUserData, isAuth } from "../../middlewares";

const router = Router();

// Validations
import validate from "../../middlewares/validate";
import { subscriptionSchema } from "../../validations/schemas";

// Routing
router.post(
	"/email",
	validate(subscriptionSchema.postSubscribeToEmailBodySchema, "body"),
	subscriptionController.subscribeToEmail
);

router.delete(
	"/email",
	validate(subscriptionSchema.deleteUnsubscribeFromEmailBodySchema, "body"),
	subscriptionController.unsubscribeFromEmail
);

router.post(
	"/push",
	isAuth,
	getUserData,
	validate(subscriptionSchema.postSubscribeToPushBodySchema, "body"),
	subscriptionController.subscribeToPush
);

router.delete(
	"/push",
	isAuth,
	getUserData,
	validate(subscriptionSchema.deleteUnsubscribeFromPushBodySchema, "body"),
	subscriptionController.unsubscribeFromPush
);

export default router;
