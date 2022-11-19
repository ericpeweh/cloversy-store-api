// Dependencies
import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";

// Configs

// Middlewares
import { isAuth, isAdmin, errorHandler } from "./api/middlewares";

// Routes
import router from "./api/routes";

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

app.use(isAuth);

app.use("/auth", router.authRouter);
app.use("/products", router.productsRouter);
app.use("/category", isAdmin, router.categoryRouter);
app.use("/brands", isAdmin, router.brandRouter);
app.use("/customers", isAdmin, router.userRouter);
app.use("/vouchers", isAdmin, router.voucherRouter);

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
