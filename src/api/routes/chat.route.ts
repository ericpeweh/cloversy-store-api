// Dependencies
import { Router } from "express";

// Controllers
import { chatController } from "../controllers";

// Validations
import validate from "../middlewares/validate";
import { chatSchema } from "../validations/schemas";

const router = Router();

// Routing
router.get(
	"/",
	validate(chatSchema.getConversationListQuerySchema, "query"),
	chatController.getConversationList
);
router.get(
	"/:conversationId",
	validate(chatSchema.getConversationParamsSchema, "params"),
	validate(chatSchema.getConversationQuerySchema, "query"),
	chatController.getConversation
);

export default router;
