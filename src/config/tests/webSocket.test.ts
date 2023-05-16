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

const mockIO = {
	on: jest.fn((event: string, handler: (socket: unknown) => void) => {
		if (event === "connection") {
			handler(mockSocket);
		}
	}),
	emit: jest.fn()
};

jest.mock("socket.io", () => ({
	Server: jest.fn().mockImplementation(() => mockIO)
}));

jest.mock("../../api/services", () => ({
	chatService: {
		userJoinConversations: jest.fn().mockResolvedValue([1, 2, 3]),
		adminJoinConversations: jest.fn().mockResolvedValue([4, 5, 6])
	}
}));

// Dependencies
import { Server } from "socket.io";
import { onConnectionHandler } from "../webSocket";

// Types
import { CustomSocket } from "../../api/types/socket.io";
import { User } from "../../api/interfaces";

// Services
import { chatService } from "../../api/services";

describe("webSocket", () => {
	it("should add user to activeUsers list if user is not already in the list", async () => {
		const mockUser2 = mockActiveUsers[1];
		const mockActiveUsersWithoutUser2 = mockActiveUsers.filter(user => user.id !== "2");

		const mockSocketWithoutUser = {
			request: {
				user: mockUser2
			},
			join: jest.fn(),
			on: jest.fn(),
			emit: jest.fn()
		};
		const mockIOWithNewUser = {
			...mockIO,
			emit: jest.fn()
		};

		expect(mockActiveUsersWithoutUser2).not.toContainEqual(mockUser2);

		await onConnectionHandler(
			mockIOWithNewUser as unknown as Server,
			mockActiveUsersWithoutUser2
		)(mockSocketWithoutUser as unknown as CustomSocket);

		expect(mockIOWithNewUser.emit).toHaveBeenCalledWith("activeUsers", mockActiveUsers);
	});

	it("should not add user to activeUsers list if user is already in the list", async () => {
		const mockUser1 = mockActiveUsers[0];
		const mockActiveUsersOnline = [...mockActiveUsers];
		const mockSocketWithExistingUser = {
			request: {
				user: mockUser1
			},
			join: jest.fn(),
			on: jest.fn(),
			emit: jest.fn()
		};

		expect(mockActiveUsers).toEqual(mockActiveUsersOnline);

		await onConnectionHandler(
			mockIO as unknown as Server,
			mockActiveUsersOnline
		)(mockSocketWithExistingUser as unknown as CustomSocket);

		expect(mockIO.emit).toHaveBeenCalledWith("activeUsers", mockActiveUsers);
	});

	it("should join user to a conversation if user role is 'user'", async () => {
		const mockUser = mockActiveUsers[0];

		const mockSocketWithUser = {
			request: {
				user: mockUser
			},
			join: jest.fn(),
			on: jest.fn(),
			emit: jest.fn()
		};

		await onConnectionHandler(
			mockIO as unknown as Server,
			mockActiveUsers
		)(mockSocketWithUser as unknown as CustomSocket);

		expect(chatService.userJoinConversations).toHaveBeenCalledWith(+mockUser.id!);
	});

	it("should join user to a conversation if user role is 'admin'", async () => {
		const mockAdmin = mockActiveUsers[1];

		const mockSocketWithAdmin = {
			request: {
				user: mockAdmin
			},
			join: jest.fn(),
			on: jest.fn(),
			emit: jest.fn()
		};

		await onConnectionHandler(
			mockIO as unknown as Server,
			mockActiveUsers
		)(mockSocketWithAdmin as unknown as CustomSocket);

		expect(chatService.adminJoinConversations).toHaveBeenCalledWith(+mockAdmin.id!);
	});
});
