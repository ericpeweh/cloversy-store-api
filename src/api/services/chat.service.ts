// Data
import { chatRepo, userRepo } from "../data";

export const userJoinConversations = async (userId: number) => {
	// Check if "user" have already created a conversation
	const isUserCreatedConversation = await chatRepo.checkUserHaveCreatedConversation(userId);

	if (!isUserCreatedConversation) {
		// Create new conversation
		const newConversationId = await chatRepo.createNewConversation(
			"private-message-user-admin",
			userId
		);

		// Add all admin as conversation participants
		const adminUserIds = await userRepo.getAllAdminUserIds();

		await chatRepo.addConversationParticipants(newConversationId, [userId, ...adminUserIds]);
	}

	const userConversationIds = await chatRepo.getUserConversationIds(userId);

	return userConversationIds;
};

export const adminJoinConversations = async (adminId: number) => {
	// Check if "user" have already created a conversation
	const userIdsWithoutConversation = await chatRepo.getAllUserIdsWithoutConversation();

	// Get all admin ids participants
	const adminUserIds = await userRepo.getAllAdminUserIds();

	for (const userId of userIdsWithoutConversation) {
		// Create new conversation
		const newConversationId = await chatRepo.createNewConversation(
			"private-message-user-admin",
			userId
		);

		// Add all admin as conversation participants
		await chatRepo.addConversationParticipants(newConversationId, [userId, ...adminUserIds]);
	}

	const adminConversationIds = await chatRepo.getUserConversationIds(adminId);

	return adminConversationIds;
};

export const verifyConversationAccess = async (conversationId: number, userId: number) => {
	const hasAccess = await chatRepo.verifyConversationAccess(conversationId, userId);

	return hasAccess;
};

export const createMessage = async (conversationId: number, body: string, senderId: number) => {
	await chatRepo.createMessage(conversationId, body, senderId);
};

export const getConversation = async (
	conversationId: string,
	currentCursor: string,
	userId: string
) => {
	const conversation = await chatRepo.getConversationById(conversationId);

	const { messages, ...paginationData } = await chatRepo.getConversationMessages(
		conversation.id,
		currentCursor
	);

	await chatRepo.updateConversationLastRead(conversationId, userId);

	return {
		conversation,
		messages,
		paginationData
	};
};

export const getConversationList = async (page: string, userId: string) => {
	const conversations = await chatRepo.getConversationList(page, userId);

	return conversations;
};

export const getConversationParticipantIds = async (conversationId: number) => {
	const participantIds = await chatRepo.getConversationParticipantIds(conversationId);

	return participantIds;
};
