// Data
import { chatRepo } from "../../data/client";

export const getConversation = async (userId: string, currentCursor: string) => {
	const conversation = await chatRepo.getUserConversation(userId);

	const { messages, ...paginationData } = await chatRepo.getConversationMessages(
		conversation.id,
		currentCursor
	);

	return {
		conversation,
		messages,
		paginationData
	};
};
