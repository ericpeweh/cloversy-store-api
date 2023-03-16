// Dependencies
import { Request, Response, NextFunction } from "express";

// Services
import { chatService } from "../services";

// Utils
import { ErrorObj } from "../utils";

export const getConversation = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.user?.id;
	const { currentCursor = "" } = req.query;
	const { conversationId } = req.params;

	try {
		if (!userId) throw new ErrorObj.ClientError("Failed to identify user!", 403);

		const { conversation, messages, paginationData } = await chatService.getConversation(
			conversationId,
			currentCursor as string,
			userId
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

export const getConversationList = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.user?.id;
	const { page = "" } = req.query;

	try {
		if (!userId) throw new ErrorObj.ClientError("Failed to identify user!", 403);

		const { conversations, ...paginationData } = await chatService.getConversationList(
			page as string,
			userId
		);

		res.status(200).json({
			status: "success",
			...paginationData,
			data: { conversations }
		});
	} catch (error: unknown) {
		return next(error);
	}
};
