// Dependencies
import { Router } from "express";

// Controller
import { contactController } from "../../controllers/client";

const router = Router();

// Validations
import validate from "../../middlewares/validate";
import { contactSchema } from "../../validations/schemas";

// Routing
router.post(
	"/message",
	validate(contactSchema.postCreateMessageWebFormBodySchema, "body"),
	contactController.createMessageWebForm
);

export default router;
