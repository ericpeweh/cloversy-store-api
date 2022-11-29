// Dependencies
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getUserInfoAuth0 = async (accessToken: string) => {
	const response = await axios.get("https://dev-yinr7e34g2h7igf4.us.auth0.com/userinfo", {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	return response.data;
};

export const resetPasswordAuth0 = async (userEmail: string) => {
	const response = await axios.post(
		"https://dev-yinr7e34g2h7igf4.us.auth0.com/dbconnections/change_password",
		{
			client_id: process.env.AUTH0_CLIENTID,
			email: userEmail,
			connection: "Username-Password-Authentication"
		},
		{
			headers: { "content-type": "application/json" }
		}
	);

	return response.data;
};
