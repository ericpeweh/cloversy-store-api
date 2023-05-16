// Mocks
const mockActiveUsers: Partial<User>[] = [
	{
		id: "1",
		email: "user1@example.com",
		full_name: "Test User 1",
		contact: "1234567890",
		user_role: "user"
	},
	{
		id: "2",
		email: "user2@example.com",
		full_name: "Test User 2",
		contact: "2345678901",
		user_role: "admin"
	}
];

const mockSocket = {
	request: {
		user: mockActiveUsers[0]
	},
	join: jest.fn(),
	on: jest.fn(),
	emit: jest.fn()
};

const mockIO: unknown = {
	on: jest.fn((event: string, handler: (socket: unknown) => void) => {
		if (event === "connection") {
			handler(mockSocket);
		}
	}),
	to: jest.fn(() => mockIO),
	emit: jest.fn()
};

jest.mock("../../api/services", () => ({
	chatService: {
		verifyConversationAccess: jest.fn().mockResolvedValue(true),
		createMessage: jest.fn(),
		getConversationParticipantIds: jest.fn().mockResolvedValue([1, 2])
	},
	notificationService: {
		getNotificationTokens: jest.fn().mockResolvedValue(["token1", "token2"]),
		sendNotifications: jest.fn()
	}
}));

jest.mock("../../api/utils", () => ({
	generateUniqueId: jest.fn().mockReturnValue("UNIQUE_ID"),
	getLocalTime: jest.fn().mockReturnValue("2022-03-14T16:00:00.000Z")
}));

// Dependencies
import { Server } from "socket.io";
import { onDisconnectHandler, onNewMessageHandler, onUserTypingHandler } from "../webSocket";
import { User } from "../../api/interfaces";
import { chatService, notificationService } from "../../api/services";
import { generateUniqueId, getLocalTime } from "../../api/utils";

describe("webSocket onMessage", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should do nothing if user is not defined", async () => {
		const mockIOServer = mockIO as Server;

		const activeUsers: User[] = [];
		const handler = onNewMessageHandler(mockIOServer, undefined, activeUsers);

		await handler({ message: "Hello", conversationId: 1 });

		expect(chatService.verifyConversationAccess).not.toHaveBeenCalled();
		expect(chatService.getConversationParticipantIds).not.toHaveBeenCalled();
		expect(chatService.createMessage).not.toHaveBeenCalled();
		expect(notificationService.getNotificationTokens).not.toHaveBeenCalled();
		expect(notificationService.sendNotifications).not.toHaveBeenCalled();
		expect(mockIOServer.to).not.toHaveBeenCalled();
		expect(mockIOServer.emit).not.toHaveBeenCalled();
	});

	it("should do nothing if conversationId is not defined", async () => {
		const mockIOServer = mockIO as Server;
		const mockUser = mockActiveUsers[0];
		const handler = onNewMessageHandler(mockIOServer, mockUser as User, []);

		await handler({ message: "Hello", conversationId: undefined! });

		expect(chatService.verifyConversationAccess).not.toHaveBeenCalled();
		expect(chatService.getConversationParticipantIds).not.toHaveBeenCalled();
		expect(chatService.createMessage).not.toHaveBeenCalled();
		expect(notificationService.getNotificationTokens).not.toHaveBeenCalled();
		expect(notificationService.sendNotifications).not.toHaveBeenCalled();
		expect(mockIOServer.to).not.toHaveBeenCalled();
		expect(mockIOServer.emit).not.toHaveBeenCalled();
	});

	it("should do nothing if message is not defined", async () => {
		const mockIOServer = mockIO as Server;
		const activeUsers: User[] = [];
		const mockUser = mockActiveUsers[0];
		const handler = onNewMessageHandler(mockIOServer, mockUser as User, activeUsers);

		await handler({ message: undefined!, conversationId: 1 });
		expect(chatService.verifyConversationAccess).not.toHaveBeenCalled();
	});

	it("should do nothing if user does not have access to conversation", async () => {
		const mockIOServer = mockIO as Server;
		const mockUser = mockActiveUsers[0];

		// Mock verifyConversationAccess to return false
		(chatService.verifyConversationAccess as jest.Mock).mockResolvedValueOnce(false);
		const handler = onNewMessageHandler(mockIOServer, mockUser as User, []);
		await handler({ message: "Hello World", conversationId: 1 });

		expect(mockIOServer.to).not.toHaveBeenCalled();
		expect(generateUniqueId).not.toHaveBeenCalled();
		expect(getLocalTime).not.toHaveBeenCalled();
		expect(chatService.createMessage).not.toHaveBeenCalled();
		expect(notificationService.sendNotifications).not.toHaveBeenCalled();
		expect(notificationService.getNotificationTokens).not.toHaveBeenCalled();
		expect(chatService.getConversationParticipantIds).not.toHaveBeenCalled();
	});

	it("should not send notifications to active users", async () => {
		const mockIOServer = mockIO as Server;
		const expectedNotifTokens = ["tokenA"];

		// Mock getNotificationTokens
		(notificationService.getNotificationTokens as jest.Mock).mockResolvedValueOnce(
			expectedNotifTokens
		);

		// Send message using user1
		const mockUser = mockActiveUsers[0];

		// There is no active user
		const handler = onNewMessageHandler(mockIOServer, mockUser as User, []);
		const mockMessage = { message: "Hello World", conversationId: 1 };

		await handler(mockMessage);

		// Assert only user2 receive notifications
		expect(chatService.getConversationParticipantIds).toHaveBeenCalledWith(
			mockMessage.conversationId
		);
		expect(notificationService.getNotificationTokens).toHaveBeenCalledWith([2]);
		expect(notificationService.sendNotifications).toHaveBeenCalledWith(
			{
				title: "Pesan baru telah masuk",
				body: `${mockUser.full_name}: ${mockMessage.message}`,
				deeplinkUrl: "account/livechat"
			},
			expectedNotifTokens
		);
	});

	it("should emit newMessageResponse event and save message to database if user has access to conversation", async () => {
		const mockIOServer = mockIO as Server;
		const mockUser = mockActiveUsers[0];
		const handler = onNewMessageHandler(mockIOServer, mockUser as User, []);

		await handler({ message: "Hello World", conversationId: 1 });
		expect(mockIOServer.to).toHaveBeenCalledWith("room-1");
		expect(mockIOServer.emit).toHaveBeenCalledWith("newMessageResponse", {
			id: "UNIQUE_ID",
			conversation_id: 1,
			body: "Hello World",
			sender_id: 1,
			email: "user1@example.com",
			created_at: expect.any(String)
		});
		expect(chatService.createMessage).toHaveBeenCalledWith(1, "Hello World", 1);
		expect(notificationService.sendNotifications).toHaveBeenCalled();
	});
});

describe("webSocket userTyping", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should do nothing if user is not defined", async () => {
		const mockIOServer = mockIO as Server;
		const handler = onUserTypingHandler(mockIOServer, undefined);

		await handler({ conversationId: 1, isTyping: true });

		expect(chatService.verifyConversationAccess).not.toHaveBeenCalled();
		expect(mockIOServer.to).not.toHaveBeenCalled();
		expect(mockIOServer.emit).not.toHaveBeenCalled();
	});

	it("should do nothing if conversationId is not defined", async () => {
		const mockUser = mockActiveUsers[0];
		const mockIOServer = mockIO as Server;
		const handler = onUserTypingHandler(mockIOServer, mockUser as User);

		await handler({ conversationId: undefined!, isTyping: true });

		expect(chatService.verifyConversationAccess).not.toHaveBeenCalled();
		expect(mockIOServer.to).not.toHaveBeenCalled();
		expect(mockIOServer.emit).not.toHaveBeenCalled();
	});

	it("should do nothing if user does not have access to conversation", async () => {
		const mockIOServer = mockIO as Server;
		const mockUser = mockActiveUsers[0];

		// Mock verifyConversationAccess to return false
		(chatService.verifyConversationAccess as jest.Mock).mockResolvedValueOnce(false);
		const handler = onUserTypingHandler(mockIOServer, mockUser as User);
		await handler({ conversationId: 1, isTyping: true });

		expect(mockIOServer.to).not.toHaveBeenCalled();
		expect(mockIOServer.emit).not.toHaveBeenCalled();
	});

	it("should emit userTypingResponse event if user has access to conversation", async () => {
		const mockIOServer = mockIO as Server;
		const mockUser = mockActiveUsers[0];
		const handler = onUserTypingHandler(mockIOServer, mockUser as User);

		// Test data
		const conversationId = 1;
		const isTyping = true;

		const userTyping = {
			is_typing: isTyping,
			full_name: mockUser.full_name || "Lawan bicara",
			conversation_id: conversationId,
			email: mockUser.email
		};

		await handler({ conversationId, isTyping: isTyping });
		expect(mockIOServer.to).toHaveBeenCalledWith("room-1");
		expect(mockIOServer.emit).toHaveBeenCalledWith("userTypingResponse", userTyping);
	});
});

describe("webSocket onDisconnect", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should remove user from activeUsers list if user is disconnected", () => {
		const mockIOServer = mockIO as Server;
		const mockUser = mockActiveUsers[0];
		const handler = onDisconnectHandler(mockIOServer, mockUser as User, mockActiveUsers);

		// Disconnect user
		handler();
		expect(mockIOServer.emit).toHaveBeenCalledWith(
			"activeUsers",
			mockActiveUsers.filter(user => user.id !== "1")
		);
	});

	it("should not remove any user from activeUsers if user is not defined on disconnected", () => {
		const mockIOServer = mockIO as Server;
		const handler = onDisconnectHandler(mockIOServer, undefined, mockActiveUsers);

		// Disconnect user
		handler();
		expect(mockIOServer.emit).toHaveBeenCalledWith("activeUsers", mockActiveUsers);
	});
});
