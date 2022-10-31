// Dependencies
import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";

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

app.use("/products", router.productsRouter);
app.use("/category", router.categoryRouter);

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
