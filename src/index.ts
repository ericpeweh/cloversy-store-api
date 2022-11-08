// Dependencies
import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

// Configs

// Middlewares
import { isAuth } from "./api/middlewares";

// Routes
import router from "./api/routes";

// Setup
dotenv.config();
const app: Express = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Authentication
app.use(isAuth);

// Routing
app.get("/", (req, res) => {
	res.send("<h1>Hello world</h1>");
});

app.get("/profile", async (req, res) => {
	const accessToken = req.headers.authorization?.split(" ")[1];
	const response = await axios.get("https://dev-yinr7e34g2h7igf4.us.auth0.com/userinfo", {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	const userData = response.data;
	res.json(userData);
});

app.use("/products", router.productsRouter);
app.use("/category", router.categoryRouter);
app.use("/brands", router.brandRouter);

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
