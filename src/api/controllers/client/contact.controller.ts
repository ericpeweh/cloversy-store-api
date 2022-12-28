// Dependencies
import { Request, Response } from "express";

// Services
import { contactService } from "../../services/client";

// Utils
import { ErrorObj } from "../../utils";

export const createMessageWebForm = async (req: Request, res: Response) => {
	const { senderName, email, objective, title, message } = req.body;

	try {
		if (!senderName || !email || !objective || !title || !message)
			throw new ErrorObj.ClientError("Invalid message format");

		if (!["Produk", "Website / Store", "Partnership", "Lainnya"].includes(objective))
			throw new ErrorObj.ClientError("Invalid objective!");

		if (message.length > 1000)
			throw new ErrorObj.ClientError("Message too long, max 1000 characters");

		const newMessage = {
			senderName,
			email,
			objective,
			title,
			message
		};

		await contactService.createMessageWebForm(newMessage);

		res.status(200).json({
			status: "success",
			data: { message: "Message sent successfully!" }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
