// Dependencies
import { Request, Response } from "express";

// Services
import { chatService } from "../../services/client";

// Utils
import { ErrorObj } from "../../utils";

export const getConversation = async (req: Request, res: Response) => {
	const { currentCursor = "" } = req.query;
	const userId = req.user?.id;

	try {
		if (!userId) throw new ErrorObj.ClientError("Failed to identify user!", 403);

		if (typeof currentCursor !== "string") {
			throw new ErrorObj.ClientError("Query params has to be type of string");
		}

		const { conversation, messages, paginationData } = await chatService.getConversation(
			userId,
			currentCursor
		);

		res.status(200).json({
			status: "success",
			...paginationData,
			data: { conversation: { ...conversation, messages } }
		});
	} catch (error: any) {
		console.log(error);

		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
