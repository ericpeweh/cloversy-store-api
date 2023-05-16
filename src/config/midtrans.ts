// Dependencies
import dotenv from "dotenv";
import midtransClient from "midtrans-client";

dotenv.config();

const coreAPI = new midtransClient.CoreApi({
	/* 
    SHOULD BE CHANGED TO TRUE (IN PRODUCTION, CURERNTLY ON STAGING 16/05/2023)
  */
	isProduction: false,
	// isProduction: process.env.NODE_ENV === "production",
	serverKey: process.env.MIDTRANS_SERVER_KEY,
	clientKey: process.env.MIDTRANS_CLIENT_KEY
});

export default coreAPI;
