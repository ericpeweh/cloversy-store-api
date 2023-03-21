// Mocks
import { mockErrorBody, mockAuth0User, mockPaginationData } from "./helpers/mockVariables";

const mockNotifMarketings = [
	{
		id: 1,
		notification_code: "ABCDEABCDE",
		title: "NOTIF_TITLE_1",
		sent_at: "2023-01-01T12:00:00.000Z",
		scheduled: null,
		description: "",
		message_title: "MESSAGE_TITLE_1",
		message_body: "MESSAGE_BODY_1",
		image_url: "",
		action_link: "",
		action_title: "",
		success_count: 1,
		failure_count: 0,
		created_at: "2023-01-01T12:00:00.000Z",
		send_to: "all",
		canceled: false,
		deeplink_url: "id.cloversyid.cloversystoremobile://orders/WZAVBBAHN1/details",
		target_count: "1"
	},
	{
		id: 36,
		notification_code: "FGHIJKLMNO",
		title: "NOTIF_TITLE_1",
		sent_at: "2023-01-01T12:00:00.000Z",
		scheduled: null,
		description: "",
		message_title: "MESSAGE_TITLE_1",
		message_body: "MESSAGE_BODY_1",
		image_url: "",
		action_link: "",
		action_title: "",
		success_count: 1,
		failure_count: 0,
		created_at: "2023-01-01T12:00:00.000Z",
		send_to: "all",
		canceled: false,
		deeplink_url: null,
		target_count: "1"
	}
];

const mockSelectedUsers = [
	{
		user_id: 1,
		email: "user1@example.com",
		full_name: "user1",
		profile_picture: "PROFILE_PICTURE_URL"
	}
];

const newNotifMarketingData = {
	title: "NOTIF_MARKETING_1",
	description: "MARKETING_DESC",
	scheduled: "2023-01-01T12:00:00.000Z", // Scheduled notification
	selectedUserIds: [1],
	message_title: "MESSAGE_TITLE_1",
	message_body: "MESSAGE_BODY_1",
	image_url: "https://example.com/images/abc",
	deeplink_url: "cloversystoreid://home",
	action_link: "https://example.com/link",
	action_title: "ACTION_TITLE",
	sendTo: "selected"
};

// Mock middlewares
jest.mock("../../middlewares", () => ({
	...jest.requireActual("../../middlewares"),
	isAuth: jest.fn((req: Request, _: Response, next: NextFunction) => {
		req.auth = mockAuth0User;
		return next();
	}),
	isAdmin: jest.fn((_1: Request, _2: Response, next: NextFunction) => {
		return next();
	})
}));

// Mock admin marketingRepo DB
jest.mock("../../data/marketing.data.ts", () => ({
	getNotificationMarketings: jest.fn(),
	getNotificationMarketingDetail: jest.fn(),
	createNotificationMarketing: jest.fn(),
	updateNotificationMarketing: jest.fn()
}));

// Mock admin notificationRepo DB
jest.mock("../../data/notification.data.ts", () => ({
	getAllUserNotificationTokens: jest.fn(),
	getUserNotificationTokens: jest.fn(),
	storeNotification: jest.fn(),
	getSingleNotificationMarketing: jest.fn()
}));

// Mock admin subscriptionRepo DB
jest.mock("../../data/subscription.data.ts", () => ({
	getNotifSubscriptionsByUserIds: jest.fn(),
	getAllNotifSubscriptions: jest.fn()
}));

// Mock admin userRepo DB
jest.mock("../../data/user.data.ts", () => ({
	getAllAdminUserIds: jest.fn()
}));

// Mock admin notificationService
jest.mock("../../services/notification.service.ts", () => ({
	...jest.requireActual("../../services/notification.service.ts"),
	sendNotifications: jest.fn(),
	storeNotification: jest.fn()
}));

// Mock admin marketingService
jest.mock("../../services/marketing.service.ts", () => ({
	...jest.requireActual("../../services/marketing.service.ts"),
	updateNotificationMarketing: jest.fn(),
	scheduleNotifMarketingNotification: jest.fn()
}));

// Mock scheduler utils
jest.mock("../../utils/scheduler.ts", () => ({
	scheduleJob: jest.fn()
}));

// Mock console.log
jest.spyOn(global.console, "log").mockImplementation(() => {});

// Dependencies
import express, { Request, Response, NextFunction } from "express";
import supertest from "supertest";
import { Server } from "http";
import { errorHandler, isAdmin, isAuth } from "../../middlewares";
import { marketingRepo, notificationRepo, subscriptionRepo } from "../../data";
import { ErrorObj, scheduler } from "../../utils";
import { marketingService, notificationService } from "../../services";

// Module to test
import marketingRouter from "../../routes/marketing.route";

describe("notification marketing route", () => {
	const app = express();
	let server: Server;

	beforeAll(() => {
		app.use(express.urlencoded({ extended: true }));
		app.use(express.json());
		app.use("/admin/marketing", isAuth, isAdmin, marketingRouter, errorHandler);

		server = app.listen();
	});

	afterAll(() => {
		server.close();
	});

	describe("GET /admin/marketing/notifications", () => {
		afterEach(() => {
			jest.clearAllMocks();
		});

		describe("given valid request query", () => {
			it("should return 200 status code and notif marketings list data", async () => {
				// Mock getNotificationMarketings DB to return mocked notif marketings
				(marketingRepo.getNotificationMarketings as jest.Mock).mockResolvedValueOnce({
					notifMarketings: mockNotifMarketings,
					...mockPaginationData
				});

				const res = await supertest(app).get("/admin/marketing/notifications").query({
					page: "1",
					q: "abc",
					scheduled: "false"
				});

				// Assert DB method wa called with expected args
				expect(marketingRepo.getNotificationMarketings).toHaveBeenCalledWith("1", "abc", "false");

				// Assert response status code and body
				expect(res.status).toBe(200);
				expect(res.body).toEqual({
					status: "success",
					...mockPaginationData,
					data: {
						notifMarketings: mockNotifMarketings
					}
				});
			});
		});

		describe("given invalid query", () => {
			it("should return 400 status code and validation error message", async () => {
				// Invalid 'page' query
				const res1 = await supertest(app).get("/admin/marketing/notifications").query({
					page: "abc"
				});

				expect(res1.status).toBe(400);
				expect(res1.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: Please provide a valid 'page'.",
            "status": "error",
          }
        `);

				// Invalid 'scheduled' query
				const res2 = await supertest(app).get("/admin/marketing/notifications").query({
					scheduled: "invalid"
				});

				expect(res2.status).toBe(400);
				expect(res2.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: "scheduled" must be a boolean",
            "status": "error",
          }
        `);
			});
		});

		describe("getNotificationMarketings throw DB error", () => {
			it("should return 500 status code and server error", async () => {
				// Mock getNotificationMarketings DB to throw error
				(marketingRepo.getNotificationMarketings as jest.Mock).mockRejectedValueOnce(
					new Error("DB Error!")
				);

				const res = await supertest(app).get("/admin/marketing/notifications");

				expect(res.status).toBe(500);
				expect(res.body).toEqual(mockErrorBody);
			});
		});
	});

	describe("GET /admin/marketing/notifications/:notifMarketingId", () => {
		afterEach(() => {
			jest.clearAllMocks();
		});

		describe("given valid notif marketing id params", () => {
			it("should return 200 status code and notif marketing details data", async () => {
				// Mock getNotificationMarketingDetail db repo
				(marketingRepo.getNotificationMarketingDetail as jest.Mock).mockResolvedValueOnce({
					notifMarketingResult: mockNotifMarketings[0],
					selectedUsers: mockSelectedUsers
				});

				const res = await supertest(app).get("/admin/marketing/notifications/1");

				expect(res.status).toBe(200);
				expect(res.body).toEqual({
					status: "success",
					data: {
						notifMarketing: {
							...mockNotifMarketings[0],
							selectedUsers: mockSelectedUsers
						}
					}
				});
			});
		});

		describe("given invalid notif marketing id params", () => {
			it("should return 400 status code and validation error message", async () => {
				const res = await supertest(app).get("/admin/marketing/notifications/invalid"); // send request with invalid notif marketing id

				expect(res.status).toBe(400);
				expect(res.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: Please provide a valid 'notifMarketingId'.",
            "status": "error",
          }
        `);
			});
		});
	});

	describe("POST /admin/marketing/notifications", () => {
		afterEach(() => {
			jest.clearAllMocks();
		});

		describe("given valid new notif marketing data", () => {
			it("should return 201 status and successfully create new notif marketing with expected data", async () => {
				// Mock admin marketingRepo createNotificationMarketing DB
				(marketingRepo.createNotificationMarketing as jest.Mock).mockResolvedValueOnce({
					notification_code: "ABCDE12345",
					...newNotifMarketingData
				});

				const res = await supertest(app)
					.post("/admin/marketing/notifications")
					.send(newNotifMarketingData);

				// Assert notificationRepo getUserNotificationTokens was called (sendTo === 'selected')
				expect(notificationRepo.getUserNotificationTokens).toHaveBeenCalledWith(
					newNotifMarketingData.selectedUserIds
				);

				// Assert notification is scheduled
				expect(scheduler.scheduleJob).toHaveBeenCalledTimes(1);
				expect(scheduler.scheduleJob).toHaveBeenCalledWith(
					"ABCDE12345",
					new Date(newNotifMarketingData.scheduled),
					expect.any(Function)
				);

				// Assert response status and data
				expect(res.status).toBe(201);
				expect(res.body).toEqual({
					status: "success",
					data: {
						newNotifMarketing: { ...newNotifMarketingData, notification_code: "ABCDE12345" }
					}
				});
			});
		});

		describe("notifications target is set to all users", () => {
			it("should send notification to all users", async () => {
				// Mock admin marketingRepo createNotificationMarketing DB
				(marketingRepo.createNotificationMarketing as jest.Mock).mockResolvedValueOnce({
					notification_code: "ABCDE12345",
					...newNotifMarketingData,
					sendTo: "all"
				});

				await supertest(app)
					.post("/admin/marketing/notifications")
					.send({ ...newNotifMarketingData, sendTo: "all" }); // set target to all users

				// Assert notificationRepo getAllUserNotificationTokens was called
				expect(notificationRepo.getAllUserNotificationTokens).toHaveBeenCalled();
			});
		});

		describe("notification marketing is not scheduled type", () => {
			it("should send notifications directly", async () => {
				// Mock admin marketingRepo createNotificationMarketing DB
				(marketingRepo.createNotificationMarketing as jest.Mock).mockResolvedValueOnce({
					notification_code: "ABCDE12345",
					...newNotifMarketingData
				});

				await supertest(app)
					.post("/admin/marketing/notifications")
					.send({ ...newNotifMarketingData, scheduled: undefined });

				// Assert notificationService sendNotifications was called
				expect(notificationService.sendNotifications).toHaveBeenCalledTimes(1);

				// Assert notification was stored to db
				expect(notificationService.storeNotification).toHaveBeenCalledTimes(1);
			});
		});

		describe("notification marketing was created", () => {
			it("should send a correct notifications message", async () => {
				// Mock admin marketingRepo createNotificationMarketing DB
				(marketingRepo.createNotificationMarketing as jest.Mock).mockResolvedValueOnce({
					notification_code: "ABCDE12345",
					...newNotifMarketingData
				});

				// Mock admin getUserNotificationTokens DB to return mock tokens
				(notificationRepo.getUserNotificationTokens as jest.Mock).mockResolvedValueOnce([1, 2, 3]);

				await supertest(app)
					.post("/admin/marketing/notifications")
					.send({ ...newNotifMarketingData, scheduled: undefined });

				// Assert notificationService sendNotifications was called with expected args
				const { message_title, message_body, image_url, deeplink_url, action_link, action_title } =
					newNotifMarketingData;
				expect(notificationService.sendNotifications).toHaveBeenCalledWith(
					{
						title: message_title,
						body: message_body,
						imageUrl: image_url,
						deeplinkUrl: deeplink_url,
						actionLink: action_link,
						actionTitle: action_title
					},
					[1, 2, 3],
					{ removeFailedTokens: true }
				);
			});
		});

		describe("given invalid new notif marketing data", () => {
			it("should return 400 status code and validation error message", async () => {
				// Invalid title
				const res1 = await supertest(app)
					.post("/admin/marketing/notifications")
					.send({ ...newNotifMarketingData, title: "" });

				expect(res1.status).toBe(400);
				expect(res1.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: "title" is not allowed to be empty",
            "status": "error",
          }
        `);

				// Invalid scheduled date string (not ISO 8601)
				const res2 = await supertest(app)
					.post("/admin/marketing/notifications")
					.send({ ...newNotifMarketingData, scheduled: "01-01-2023" });

				expect(res2.status).toBe(400);
				expect(res2.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: "scheduled" must be in ISO 8601 date format",
            "status": "error",
          }
        `);

				// Invalid selected user ids format
				const res3 = await supertest(app)
					.post("/admin/marketing/notifications")
					.send({
						...newNotifMarketingData,
						selectedUserIds: [true, false]
					});

				expect(res3.status).toBe(400);
				expect(res3.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: "selectedUserIds[0]" does not match any of the allowed types",
            "status": "error",
          }
        `);

				// Invalid sendTo
				const res4 = await supertest(app)
					.post("/admin/marketing/notifications")
					.send({
						...newNotifMarketingData,
						sendTo: "me" // should be either 'all' or 'selected'
					});

				expect(res4.status).toBe(400);
				expect(res4.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: "sendTo" must be one of [all, selected]",
            "status": "error",
          }
        `);
			});
		});

		describe("notification marketing send target of 'selected' but no selected user ids provided", () => {
			it("should return 400 status code and error message", async () => {
				const res = await supertest(app)
					.post("/admin/marketing/notifications")
					.send({
						...newNotifMarketingData,
						selectedUserIds: []
					});

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					status: "error",
					message: "Selected users can't be empty if sendTo is set to 'selected'."
				});
			});
		});
	});

	describe("POST /admin/marketing/notifications/:notifMarketingId/cancel", () => {
		afterEach(() => {
			jest.clearAllMocks();
		});

		describe("given valid notification marketing id and notif marketing is not sent yet", () => {
			it("should return 200 status code and canceled notif marketing id", async () => {
				// Mock getNotificationMarketingDetail db repo
				(marketingRepo.getNotificationMarketingDetail as jest.Mock).mockResolvedValueOnce({
					notifMarketingResult: { ...mockNotifMarketings[0], sent_at: null }, // notif marketing is not sent
					selectedUsers: mockSelectedUsers
				});

				// Mock updateNotificationMarketing service
				(marketingService.updateNotificationMarketing as jest.Mock).mockResolvedValueOnce({
					...mockNotifMarketings[0],
					canceled: true
				});

				const res = await supertest(app).post("/admin/marketing/notifications/1/cancel");

				expect(res.status).toBe(200);
				expect(res.body).toEqual({
					status: "success",
					data: {
						canceledNotifMarketingId: mockNotifMarketings[0].id
					}
				});
			});
		});

		describe("given valid notification marketing id but notif marketing is already sent", () => {
			it("should return 400 status code and failed error message", async () => {
				// Mock getNotificationMarketingDetail db repo
				(marketingRepo.getNotificationMarketingDetail as jest.Mock).mockResolvedValueOnce({
					notifMarketingResult: { ...mockNotifMarketings[0] }, // notif marketing is already sent
					selectedUsers: mockSelectedUsers
				});

				const res = await supertest(app).post("/admin/marketing/notifications/1/cancel");

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					status: "error",
					message: "Can't cancel already sent notification marketing!"
				});
			});
		});

		describe("notification marketing with corresponding id is not found", () => {
			it("should return 404 status code and error message", async () => {
				// Mock getNotificationMarketingDetail db repo to throw not found error
				const errorMessage = "Notification marketing with id of '1' not found";
				(marketingRepo.getNotificationMarketingDetail as jest.Mock).mockRejectedValueOnce(
					new ErrorObj.ClientError(errorMessage, 404)
				);

				const res = await supertest(app).post("/admin/marketing/notifications/1/cancel");

				expect(res.status).toBe(404);
				expect(res.body).toEqual({
					status: "error",
					message: errorMessage
				});
			});
		});
	});

	describe("PUT /admin/marketing/notifications/:notifMarketingId", () => {
		afterEach(() => {
			jest.clearAllMocks();
		});

		describe("given valid notif marketing id and notif marketing is not sent yet", () => {
			it("should return 200 status code and updated notif marketing data", async () => {
				// Mock getNotificationMarketingDetail db repo
				(marketingRepo.getNotificationMarketingDetail as jest.Mock).mockResolvedValue({
					notifMarketingResult: { ...mockNotifMarketings[0], sent_at: null }, // set notif marketing as not sent
					selectedUsers: mockSelectedUsers
				});

				// Mock notificationRepo getSingleNotificationMarketing
				(notificationRepo.getSingleNotificationMarketing as jest.Mock).mockResolvedValueOnce(
					mockNotifMarketings[0]
				);

				// Mock subscriptionRepo getNotifSubscriptionsByUserIds
				(subscriptionRepo.getNotifSubscriptionsByUserIds as jest.Mock).mockResolvedValueOnce({
					id: 1,
					token: "USER_1_TOKEN",
					user_id: 1,
					last_online: "2023-01-01T12:00:00.000Z"
				});

				// Mock marketingRepo updateNotificationMarketing
				(marketingRepo.updateNotificationMarketing as jest.Mock).mockResolvedValueOnce(
					mockNotifMarketings[0]
				);

				const res = await supertest(app)
					.put("/admin/marketing/notifications/1")
					.send({ ...newNotifMarketingData, removedUserIds: [3, 4, 5] });

				// Assert response status code and data
				expect(res.status).toBe(200);
				expect(res.body).toEqual({
					status: "success",
					data: {
						updatedNotifMarketing: {
							...mockNotifMarketings[0],
							sent_at: null,
							selectedUsers: mockSelectedUsers
						}
					}
				});

				const updatedNotifMarketingData = {
					title: newNotifMarketingData.title,
					description: newNotifMarketingData.description,
					scheduled: newNotifMarketingData.scheduled,
					message_title: newNotifMarketingData.message_title,
					message_body: newNotifMarketingData.message_body,
					image_url: newNotifMarketingData.image_url,
					deeplink_url: newNotifMarketingData.deeplink_url,
					action_link: newNotifMarketingData.action_link,
					action_title: newNotifMarketingData.action_title,
					send_to: newNotifMarketingData.sendTo
				};

				// Assert notification marketing was updated with expected data
				expect(marketingService.updateNotificationMarketing).toHaveBeenCalledWith(
					{
						updatedNotifMarketingData,
						notifMarketingId: "1"
					},
					[1],
					[3, 4, 5]
				);

				(marketingRepo.getNotificationMarketingDetail as jest.Mock).mockReset();
			});
		});

		describe("given valid notif marketing id and notif marketing is already sent", () => {
			it("should return 200 status code and updated notif marketing data", async () => {
				// Mock getNotificationMarketingDetail db repo
				(marketingRepo.getNotificationMarketingDetail as jest.Mock).mockResolvedValue({
					notifMarketingResult: { ...mockNotifMarketings[0] }, // notification already sent
					selectedUsers: mockSelectedUsers
				});

				// Mock notificationRepo getSingleNotificationMarketing
				(notificationRepo.getSingleNotificationMarketing as jest.Mock).mockResolvedValueOnce(
					mockNotifMarketings[0]
				);

				// Mock subscriptionRepo getNotifSubscriptionsByUserIds
				(subscriptionRepo.getNotifSubscriptionsByUserIds as jest.Mock).mockResolvedValueOnce({
					id: 1,
					token: "USER_1_TOKEN",
					user_id: 1,
					last_online: "2023-01-01T12:00:00.000Z"
				});

				// Mock marketingRepo updateNotificationMarketing
				(marketingRepo.updateNotificationMarketing as jest.Mock).mockResolvedValueOnce(
					mockNotifMarketings[0]
				);

				await supertest(app)
					.put("/admin/marketing/notifications/1")
					.send({ ...newNotifMarketingData, removedUserIds: [3, 4, 5] });

				const updatedNotifMarketingData = {
					title: newNotifMarketingData.title,
					description: newNotifMarketingData.description
				};

				// Assert notification marketing was updated with expected data
				expect(marketingService.updateNotificationMarketing).toHaveBeenCalledWith(
					{
						updatedNotifMarketingData,
						notifMarketingId: "1"
					},
					[1],
					[3, 4, 5]
				);

				(marketingRepo.getNotificationMarketingDetail as jest.Mock).mockReset();
			});
		});
	});
});
