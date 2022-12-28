// Dependencies
import { Router } from "express";

// Controller
import { contactController } from "../../controllers/client";

const router = Router();

// Routing
router.post("/message", contactController.createMessageWebForm);

export default router;
