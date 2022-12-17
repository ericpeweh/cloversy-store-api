"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL
});
pool.on("connect", () => {
    console.log("Database pool connected");
});
pool.on("error", err => {
    console.error("Database pool error: ", err);
});
exports.default = {
    query: (text, params = []) => pool.query(text, params),
    pool
};
