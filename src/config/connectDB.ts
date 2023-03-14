// Dependencies
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

const onConnect = () => {
	console.log("Database pool connected");
};

const onError = (err: Error) => {
	console.error("Database pool error: ", err);
};

pool.on("connect", onConnect);
pool.on("error", onError);

export default {
	query: (text: string, params: Array<any> = []) => pool.query(text, params),
	pool,
	onConnect,
	onError
};
