"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
// Configs
const connectDB_1 = __importDefault(require("./config/connectDB"));
// Middlewares
const middlewares_1 = require("./api/middlewares");
// Routes
const routes_1 = __importDefault(require("./api/routes"));
const client_1 = __importDefault(require("./api/routes/client"));
// Setup
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS", "HEAD", "DELETE"],
    credentials: true
}));
// app.set("trust proxy", 1);
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "lax",
        secure: false
        // secure: process.env.NODE_ENV === "production"
    },
    store: new ((0, connect_pg_simple_1.default)(express_session_1.default))({
        pool: connectDB_1.default.pool,
        tableName: "cart_session"
    }),
    resave: true,
    saveUninitialized: true
}));
// Routing
app.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>");
});
app.use("/auth", middlewares_1.isAuth, middlewares_1.getUserData, routes_1.default.authRouter);
// Client routes
app.use("/products", client_1.default.productRouter);
app.use("/category", client_1.default.categoryRouter);
app.use("/brands", client_1.default.brandRouter);
app.use(middlewares_1.isAuth);
app.use("/vouchers", middlewares_1.getUserData, client_1.default.voucherRouter);
app.use("/account", middlewares_1.getUserData, client_1.default.accountRouter);
app.use("/data", middlewares_1.getUserData, client_1.default.dataRouter);
app.use("/cart", middlewares_1.passAuth, middlewares_1.getUserDataOptional, client_1.default.cartRouter);
app.use("/transactions", middlewares_1.getUserData, client_1.default.transactionRouter);
// Admin routes
app.use(middlewares_1.isAuth);
app.use("/admin/products", middlewares_1.isAdmin, routes_1.default.productRouter);
app.use("/admin/category", middlewares_1.isAdmin, routes_1.default.categoryRouter);
app.use("/admin/brands", middlewares_1.isAdmin, routes_1.default.brandRouter);
app.use("/admin/customers", middlewares_1.isAdmin, routes_1.default.userRouter);
app.use("/admin/vouchers", middlewares_1.isAdmin, routes_1.default.voucherRouter);
// Error handling middleware
app.use(middlewares_1.errorHandler);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
