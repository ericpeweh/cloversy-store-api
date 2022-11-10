// Dependencies
import { Response, NextFunction, Request } from "express";
import axios from "axios";

// Interfaces

// Services
import { userService } from "../services";

const checkUser = async (req: Request, _: Response, next: NextFunction) => {
	try {
		const accessToken = req.headers.authorization?.split(" ")[1];
		const response = await axios.get("https://dev-yinr7e34g2h7igf4.us.auth0.com/userinfo", {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		const auth0UserData = response.data;
		let userData = await userService.getUserDataByEmail(auth0UserData.email);

		if (userData === undefined) {
			userData = await userService.createNewUser([
				auth0UserData.name,
				auth0UserData.email,
				auth0UserData.picture
			]);
		}
		req.user = userData;
	} catch (error) {
		console.error(error);
	} finally {
		next();
	}
};

export default checkUser;
