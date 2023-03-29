// Dependencies
import express, { Express, Response, Request } from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import sessionStore from "connect-pg-simple";

// Configs
import db from "./config/connectDB";
import corsObject from "./config/corsObject";
import initWebSocket from "./config/webSocket";

// Middlewares
import {
	isAuth,
	isAdmin,
	errorHandler,
	getUserData,
	passAuth,
	getUserDataOptional
} from "./api/middlewares";

// Utils
import {
	initBirthdayAutoOfferMarketing,
	initNotificationSubscriptionsCleanup,
	initScheduledNotifMarketings,
	initScheduledEmailMarketings
} from "./api/utils";

// Routes
import router from "./api/routes";
import clientRouter from "./api/routes/client";

// Setup
dotenv.config();
const app: Express = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsObject));
// app.set("trust proxy", 1);

app.use(
	session({
		secret: process.env.SESSION_SECRET!,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
			sameSite: "lax",
			secure: false
			// secure: process.env.NODE_ENV === "production"
		},
		store: new (sessionStore(session))({
			pool: db.pool,
			tableName: "cart_session"
		}),
		resave: true,
		saveUninitialized: true
	})
);

// Routing
app.get("/", (_: Request, res: Response) => {
	res.status(200).send("<h1>Cloversy Store API</h1>");
});

app.use("/auth", isAuth, router.authRouter);

// Backend-to-backend (Midtrans notifications)
app.use("/midtrans", clientRouter.midtransRouter);

// Client routes
app.use("/products", clientRouter.productRouter);
app.use("/category", clientRouter.categoryRouter);
app.use("/brands", clientRouter.brandRouter);
app.use("/subscription", clientRouter.subscriptionRouter);
app.use("/contacts", clientRouter.contactRouter);

app.use(isAuth);
app.use("/vouchers", getUserData, clientRouter.voucherRouter);
app.use("/account", getUserData, clientRouter.accountRouter);
app.use("/data", getUserData, clientRouter.dataRouter);
app.use("/cart", passAuth, getUserDataOptional, clientRouter.cartRouter);
app.use("/transactions", getUserData, clientRouter.transactionRouter);
app.use("/activity", getUserData, clientRouter.activityRouter);
app.use("/chat", getUserData, clientRouter.chatRouter);

// Admin routes
app.use(isAuth);
app.use("/admin", isAdmin, router.dashboardRouter);
app.use("/admin/products", isAdmin, router.productRouter);
app.use("/admin/category", isAdmin, router.categoryRouter);
app.use("/admin/brands", isAdmin, router.brandRouter);
app.use("/admin/customers", isAdmin, router.userRouter);
app.use("/admin/vouchers", isAdmin, router.voucherRouter);
app.use("/admin/transactions", isAdmin, router.transactionRouter);
app.use("/admin/reviews", isAdmin, router.reviewRouter);
app.use("/admin/subscription", isAdmin, router.subscriptionRouter);
app.use("/admin/marketing", isAdmin, router.marketingRouter);
app.use("/admin/notifications", isAdmin, getUserData, router.notificationRouter);
app.use("/admin/chat", isAdmin, getUserData, router.chatRouter);
app.use("/admin/account", isAdmin, getUserData, router.accountRouter);
app.use("/admin/auth", isAuth, isAdmin, getUserData, router.authRouter);

// Error handling middleware
app.use(errorHandler);

// Webscoket (Socket.io) setup
const server = createServer(app);
initWebSocket(server);

// Start server
server.listen(5000, () => {
	console.log(`Server is running at http://localhost:${port}`);

	// Init schedule
	initBirthdayAutoOfferMarketing();
	initNotificationSubscriptionsCleanup();
	initScheduledNotifMarketings();
	initScheduledEmailMarketings();
});

export default app;
