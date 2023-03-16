// Mocks
import {
	mockErrorBody,
	mockAuth0User,
	mockUser,
	mockPaginationData,
	mockIdentifyUserErrorBody,
	mockCursorData
} from "./helpers/mockVariables";

const mockConversations: Partial<Conversation>[] = [
	{
		id: 1,
		title: "CONVERSATION_1"
	},
	{
		id: 2,
		title: "CONVERSATION_2"
	}
];

// Mock admin chatRepo
jest.mock("../../data/chat.data.ts", () => ({
	getConversationList: jest.fn(),
	getConversationById: jest.fn(),
	getConversationMessages: jest.fn(),
	updateConversationLastRead: jest.fn()
}));

// Mock middlewares
jest.mock("../../middlewares", () => ({
	...jest.requireActual("../../middlewares"),
	isAuth: jest.fn((req: Request, _: Response, next: NextFunction) => {
		req.auth = mockAuth0User;
		return next();
	}),
	isAdmin: jest.fn((_1: Request, _2: Response, next: NextFunction) => {
		return next();
	}),
	getUserData: jest.fn((req: Request, _2: Response, next: NextFunction) => {
		req.user = mockUser;
		return next();
	})
}));

// Dependencies
import express, { Request, Response, NextFunction } from "express";
import { Server } from "http";
import supertest from "supertest";
import { isAuth, isAdmin, errorHandler, getUserData } from "../../middlewares";
import { userService } from "../../services/client";
import { updateUserAccountDetails } from "../../data/client/user.data";
import { ErrorObj } from "../../utils";
import path from "path";

// Module to test
import chatRouter from "../../routes/chat.route";
import { Conversation } from "../../interfaces";
import { chatRepo } from "../../data";
import { chatService } from "../../services";

describe("admin chat route", () => {
	const app = express();
	let server: Server;

	beforeAll(() => {
		app.use(express.urlencoded({ extended: true }));
		app.use(express.json());
		app.use("/admin/chat", isAuth, isAdmin, getUserData, chatRouter, errorHandler);

		server = app.listen();
	});

	afterAll(() => {
		server.close();
	});

	// Get conversation list
	describe("GET /admin/chat", () => {
		describe("given valid page query and authenticated user id", () => {
			it("should return 200 status code and list of conversations data", async () => {
				// Mock getConversationList DB to return list of conversation
				(chatRepo.getConversationList as jest.Mock).mockResolvedValueOnce({
					...mockPaginationData,
					conversations: mockConversations
				});

				const res = await supertest(app).get("/admin/chat").query({ page: "1" });

				expect(res.status).toBe(200);
				expect(res.body).toEqual({
					status: "success",
					...mockPaginationData,
					data: {
						conversations: mockConversations
					}
				});
			});
		});

		describe("given invalid page query", () => {
			it("should return 400 status code and validation error message", async () => {
				const res = await supertest(app).get("/admin/chat").query({ page: "invalid" });

				expect(res.status).toBe(400);
				expect(res.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: Please provide a valid 'page'.",
            "status": "error",
          }
        `);
			});
		});

		describe("given invalid authenticated user id", () => {
			it("should return 403 status code and error message", async () => {
				// Mock getUserData middleware to set req.user.id as undefined
				(getUserData as jest.Mock).mockImplementationOnce(
					(req: Request, _: Response, next: NextFunction) => {
						req.user = {
							...mockUser,
							id: undefined!
						};
						next();
					}
				);

				const res = await supertest(app).get("/admin/chat").query({ page: "1" });

				expect(res.status).toBe(403);
				expect(res.body).toEqual(mockIdentifyUserErrorBody);
			});
		});

		describe("getConversationList db operation throws error", () => {
			it("should return 500 status code and error message", async () => {
				// Mock getConversationList db to throw db error
				(chatRepo.getConversationList as jest.Mock).mockRejectedValueOnce(new Error("DB Error!"));

				const res = await supertest(app).get("/admin/chat").query({ page: "1" });

				expect(res.status).toBe(500);
				expect(res.body).toEqual(mockErrorBody);
			});
		});
	});

	// Get single conversation
	describe("GET /admin/chat/:conversationId", () => {
		describe("given valid currentCursor query and authenticated user id", () => {
			it("should return 200 status code and list of conversations data", async () => {
				const mockConversation = {
					id: 1,
					title: "private-message-user-admin",
					created_by: 10 // user id
				};

				const mockConversationMessages = [
					{
						id: 1,
						conversation_id: 1,
						body: "message_1",
						sender_id: 1,
						email: "user1@example.com"
					},
					{
						id: 2,
						conversation_id: 1,
						body: "message_2",
						sender_id: 1,
						email: "user1@example.com"
					}
				];

				// Mock getConversationById db to return conversation data
				(chatRepo.getConversationById as jest.Mock).mockResolvedValueOnce(mockConversation);

				// Mock getConversationMessages db to return messages and cursor data
				(chatRepo.getConversationMessages as jest.Mock).mockResolvedValueOnce({
					...mockCursorData,
					messages: mockConversationMessages
				});

				const res = await supertest(app).get("/admin/chat/1");

				// Assert conversation last read is updated
				expect(chatRepo.updateConversationLastRead).toHaveBeenCalledTimes(1);
				expect(chatRepo.updateConversationLastRead).toHaveBeenCalledWith("1", "1");

				// Assert response status and body to expected data
				expect(res.status).toBe(200);
				expect(res.body).toEqual({
					status: "success",
					...mockCursorData,
					data: {
						conversation: { ...mockConversation, messages: mockConversationMessages }
					}
				});
			});
		});

		describe("given invalid conversation id params", () => {
			it("should return 400 status code and validation error message", async () => {
				// Make request with invalid conversationId
				const res = await supertest(app).get("/admin/chat/invalid");

				expect(res.status).toBe(400);
				expect(res.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: Please provide a valid 'conversationId'.",
            "status": "error",
          }
        `);
			});
		});

		describe("given invalid authenticated user id", () => {
			it("should return 403 status code and error message", async () => {
				// Mock getUserData middleware to set req.user.id as undefined
				(getUserData as jest.Mock).mockImplementationOnce(
					(req: Request, _: Response, next: NextFunction) => {
						req.user = {
							...mockUser,
							id: undefined!
						};
						next();
					}
				);

				const res = await supertest(app).get("/admin/chat/1");

				expect(res.status).toBe(403);
				expect(res.body).toEqual(mockIdentifyUserErrorBody);
			});
		});

		describe("getConversation service throws DB error", () => {
			it("should return 500 status code and error message", async () => {
				// Mock getConversationById db to throw error
				(chatRepo.getConversationById as jest.Mock).mockRejectedValueOnce(
					new Error("Service / DB Error!")
				);
				const res1 = await supertest(app).get("/admin/chat/1");
				expect(res1.status).toBe(500);
				expect(res1.body).toEqual(mockErrorBody);

				// Mock getConversationMessages db to throw error
				(chatRepo.getConversationMessages as jest.Mock).mockRejectedValueOnce(
					new Error("Service / DB Error!")
				);
				const res2 = await supertest(app).get("/admin/chat/1");
				expect(res2.status).toBe(500);
				expect(res2.body).toEqual(mockErrorBody);

				// Mock updateConversationLastRead db to throw error
				(chatRepo.updateConversationLastRead as jest.Mock).mockRejectedValueOnce(
					new Error("Service / DB Error!")
				);
				const res3 = await supertest(app).get("/admin/chat/1");
				expect(res3.status).toBe(500);
				expect(res3.body).toEqual(mockErrorBody);
			});
		});

		describe("conversation with the corresponding id not found", () => {
			it("should return 404 status code and not found error message", async () => {
				// Mock getConversationById db to throw not found error
				(chatRepo.getConversationById as jest.Mock).mockRejectedValueOnce(
					new ErrorObj.ClientError("Percakapan tidak ditemukan!", 404)
				);

				const res = await supertest(app).get("/admin/chat/1");

				expect(res.status).toBe(404);
				expect(res.body).toEqual({
					status: "error",
					message: "Percakapan tidak ditemukan!"
				});
			});
		});
	});
});
