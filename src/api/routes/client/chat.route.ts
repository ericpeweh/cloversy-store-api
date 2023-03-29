// Dependencies
import { Router } from "express";

// Controllers
import { chatController } from "../../controllers/client";

const router = Router();

// Validations
import validate from "../../middlewares/validate";
import { chatSchema } from "../../validations/schemas";

// Routing
router.get(
	"/",
	validate(chatSchema.getConversationQuerySchema, "query"),
	chatController.getConversation
);

export default router;
