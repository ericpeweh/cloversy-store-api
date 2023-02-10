// Dependencies
import { Router } from "express";

// Controllers
import { chatController } from "../../controllers/client";

const router = Router();

// Routing
router.get("/", chatController.getConversation);

export default router;
