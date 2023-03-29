// Dependencies
import dotenv from "dotenv";
import * as admin from "firebase-admin";
import path from "path";

dotenv.config();

// Initialization
const serviceAccount = path.join(__dirname, process.env.FIREBASE_ADMIN_KEY_PATH!);

const app = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

const fcm = admin.messaging(app);

export default fcm;
