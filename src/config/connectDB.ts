// Dependencies
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

pool.on("connect", () => {
	console.log("Database pool connected");
});

pool.on("error", err => {
	console.error("Database pool error: ", err);
});

export default {
	query: (text: string, params: Array<any> = []) => pool.query(text, params)
};
