// Dependencies
import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";

// Configs

// Middlewares
import { isAuth, isAdmin, errorHandler, getUserData } from "./api/middlewares";

// Routes
import router from "./api/routes";
import clientRouter from "./api/routes/client";

// Setup
dotenv.config();
const app: Express = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routing
app.get("/", (req, res) => {
	res.send("<h1>Hello world</h1>");
});

app.use("/auth", router.authRouter);

// Client routes
app.use("/products", clientRouter.productRouter);
app.use("/category", clientRouter.categoryRouter);
app.use("/brands", clientRouter.brandRouter);

app.use(isAuth);
app.use("/vouchers", getUserData, clientRouter.voucherRouter);
app.use("/data", clientRouter.dataRouter);

// Admin routes
app.use(isAuth);
app.use("/admin/products", isAdmin, router.productRouter);
app.use("/admin/category", isAdmin, router.categoryRouter);
app.use("/admin/brands", isAdmin, router.brandRouter);
app.use("/admin/customers", isAdmin, router.userRouter);
app.use("/admin/vouchers", isAdmin, router.voucherRouter);

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
