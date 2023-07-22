// Dependencies
import dotenv from "dotenv";
dotenv.config();

const corsObject = {
	origin:
		process.env.NODE_ENV === "production"
			? [
					"https://admin.cloversy.id",
					"https://www.admin.cloversy.id",
					"https://cloversy.id",
					"https://www.cloversy.id"
			  ]
			: ["http://localhost:3000", "http://localhost:3001"],
	methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS", "HEAD", "DELETE"],
	credentials: true
};

export default corsObject;
