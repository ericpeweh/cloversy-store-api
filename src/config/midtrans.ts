// Dependencies
import dotenv from "dotenv";
import midtransClient from "midtrans-client";

dotenv.config();

const coreAPI = new midtransClient.CoreApi({
	/* 
    SHOULD BE CHANGED TO TRUE (IN PRODUCTION, CURERNTLY ON PRODUCTION 06/07/2023)
  */
	isProduction: process.env.NODE_ENV === "production",
	serverKey:
		process.env.NODE_ENV === "production"
			? process.env.MIDTRANS_SERVER_PRODUCTION_KEY
			: process.env.MIDTRANS_SERVER_SANDBOX_KEY,
	clientKey:
		process.env.NODE_ENV === "production"
			? process.env.MIDTRANS_CLIENT_PRODUCTION_KEY
			: process.env.MIDTRANS_CLIENT_SANDBOX_KEY
});

export default coreAPI;
