// Dependencies
import { Response, Request } from "express";
import axios from "axios";

// Services
import { userService } from "../services";

export const authUser = async (req: Request, res: Response) => {
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
				auth0UserData.picture,
				auth0UserData.sub
			]);
		}
		res.status(200).json({
			status: "success"
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};
