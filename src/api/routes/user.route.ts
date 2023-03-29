// Dependencies
import { Router } from "express";

// Controller
import { userController } from "../controllers";

const router = Router();

// Validations
import validate from "../middlewares/validate";
import { userSchema } from "../validations/schemas";

// Routing
router.get(
	"/",
	validate(userSchema.getAllCustomersQuerySchema, "query"),
	userController.getAllCustomers
);

router.get(
	"/:userId",
	validate(userSchema.getSingleCustomerParamsSchema, "params"),
	userController.getSingleCustomer
);

router.get(
	"/:userId/orders",
	validate(userSchema.getSingleCustomerOrdersParamsSchema, "params"),
	userController.getSingleCustomerOrders
);

router.put(
	"/:userId",
	validate(userSchema.putUpdateUserDataParamsSchema, "params"),
	validate(userSchema.putUpdateUserDataBodySchema, "body"),
	userController.updateUserData
);

export default router;
