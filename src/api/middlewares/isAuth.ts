// Dependencies
import { expressjwt as jwt, GetVerificationKey } from "express-jwt";
import dotenv from "dotenv";
import jwks from "jwks-rsa";

dotenv.config();

const isAuth = jwt({
	secret: jwks.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: process.env.JWKS_URI!
	}) as GetVerificationKey,
	audience: process.env.JWT_AUDIENCE,
	issuer: process.env.JWT_ISSUER,
	algorithms: ["RS256"]
});

export default isAuth;
