// Dependencies
import { Server } from "socket.io";
import { Server as HTTPServer } from "http";

// Types
import { CustomSocket } from "../api/types/socket.io";
import { User } from "../api/interfaces";

// Configs
import corsObject from "./corsObject";

// Middlewares
import { getUserData, isAuth } from "../api/middlewares";

// Utils
import { generateUniqueId, getLocalTime } from "../api/utils";

// Services
import { chatService, notificationService } from "../api/services";

// Events
export const onNewMessageHandler = (
	io: Server,
	user: User | undefined,
	activeUsers: Partial<User>[]
) => {
	return async (data: { message: string; conversationId: number }) => {
		const { message, conversationId } = data;

		if (!user || !conversationId || !message) return;

		const hasAccess = await chatService.verifyConversationAccess(conversationId, +user.id);
		if (!hasAccess) return;

		const newMessage = {
			id: generateUniqueId(),
			conversation_id: conversationId,
			body: message,
			sender_id: +user.id,
			email: user.email,
			created_at: getLocalTime()
		};

		io.to(`room-${conversationId.toString()}`).emit("newMessageResponse", newMessage);

		// Save message to db
		chatService.createMessage(conversationId, message, +user.id);

		// Send notification to chat opponent (only non-active user)
		const participantIds = await chatService.getConversationParticipantIds(conversationId);
		const senderUserExcludedIds = participantIds.filter(
			userId => userId !== +user.id && !activeUsers.some(user => +user.id! === userId)
		);

		const notificationTokens = await notificationService.getNotificationTokens(
			senderUserExcludedIds
		);

		notificationService.sendNotifications(
			{
				title: "Pesan baru telah masuk",
				body: `${user.full_name}: ${message}`,
				deeplinkUrl: "account/livechat"
			},
			notificationTokens
		);
	};
};

export const onUserTypingHandler = (io: Server, user: User | undefined) => {
	return async (data: { conversationId: number; isTyping: boolean }) => {
		const { conversationId, isTyping } = data;
		if (!user || !conversationId) return;

		const hasAccess = await chatService.verifyConversationAccess(conversationId, +user.id);
		if (!hasAccess) return;

		const userTyping = {
			is_typing: isTyping,
			full_name: user.full_name || "Lawan bicara",
			conversation_id: conversationId,
			email: user.email
		};

		io.to(`room-${conversationId.toString()}`).emit("userTypingResponse", userTyping);
	};
};

export const onDisconnectHandler = (
	io: Server,
	user: User | undefined,
	activeUsers: Partial<User>[]
) => {
	return () => {
		// Remove user from active users list
		if (user) {
			activeUsers = activeUsers.filter(activeUser => activeUser.email !== user.email);
		}
		io.emit("activeUsers", activeUsers);
	};
};

/* eslint-disable @typescript-eslint/ban-types */
export const wrap = (middleware: Function) => (socket: { request: object }, next: Function) =>
	middleware(socket.request, {}, next);

export const onConnectionHandler = (io: Server, activeUsers: Partial<User>[]) => {
	return async (socket: CustomSocket) => {
		// Store & handle active users
		const user = socket.request.user;

		if (user && activeUsers.findIndex(activeUser => activeUser.email === user.email) === -1) {
			activeUsers.push({
				id: user.id,
				email: user.email,
				full_name: user.full_name,
				contact: user.contact,
				user_role: user.user_role
			});
		}
		io.emit("activeUsers", activeUsers);

		// Join conversations
		if (user && user?.user_role === "user") {
			const userConversationIds = await chatService.userJoinConversations(+user.id);

			socket.join(`room-${userConversationIds}`);
		}

		if (user && user?.user_role === "admin") {
			const adminConversationIds = await chatService.adminJoinConversations(+user.id);

			socket.join(adminConversationIds.map(roomId => `room-${roomId}`));
		}

		// Listen for incoming message
		socket.on("newMessage", onNewMessageHandler(io, user, activeUsers));

		// Typing indicator feature
		socket.on("userTyping", onUserTypingHandler(io, user));

		// User disconnect handler
		socket.on("disconnect", onDisconnectHandler(io, user, activeUsers));
	};
};

const initWebSocket = (server: HTTPServer) => {
	const io = new Server(server, {
		cors: corsObject
	});

	// Websocket middlewares (auth, getUserData)
	io.use(wrap(isAuth));
	io.use(wrap(getUserData));

	const activeUsers: Partial<User>[] = [];

	io.on("connection", onConnectionHandler(io, activeUsers));

	return io;
};

export default initWebSocket;
