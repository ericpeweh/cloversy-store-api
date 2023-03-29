// Dependencies
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getUserInfoAuth0 = async (accessToken: string) => {
	const response = await axios.get("https://cloversyid.jp.auth0.com/userinfo", {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	return response.data;
};

export const resetPasswordAuth0 = async (userEmail: string) => {
	try {
		const response = await axios.post(
			"https://cloversyid.jp.auth0.com/dbconnections/change_password",
			{
				client_id: process.env.AUTH0_CLIENTID,
				email: userEmail,
				// email: "-",
				connection: "Username-Password-Authentication"
			},
			{
				headers: { "content-type": "application/json" }
			}
		);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};
