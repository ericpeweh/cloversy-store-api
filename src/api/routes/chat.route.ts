// Dependencies
import { Router } from "express";

// Controllers
import { chatController } from "../controllers";

const router = Router();

// Routing
router.get("/", chatController.getConversationList);
router.get("/:conversationId", chatController.getConversation);

export default router;
