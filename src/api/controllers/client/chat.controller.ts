// Dependencies
import { Request, Response, NextFunction } from "express";

// Services
import { chatService } from "../../services/client";

// Utils
import { ErrorObj } from "../../utils";

export const getConversation = async (req: Request, res: Response, next: NextFunction) => {
	const { currentCursor = "" } = req.query;
	const userId = req.user?.id;

	try {
		if (!userId) throw new ErrorObj.ClientError("Failed to identify user!", 403);

		const { conversation, messages, paginationData } = await chatService.getConversation(
			userId,
			currentCursor as string
		);

		res.status(200).json({
			status: "success",
			...paginationData,
			data: { conversation: { ...conversation, messages } }
		});
	} catch (error: unknown) {
		return next(error);
	}
};
