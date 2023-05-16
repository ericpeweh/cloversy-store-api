// Mocks
import { mockAuth0User, mockPaginationData } from "./helpers/mockVariables";

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

// Mock console.log
jest.spyOn(global.console, "log").mockImplementation(() => {});

const newEmailMarketing = {
	title: "NEW_EMAIL_MARKETING",
	description: "NEW_EMAIL_MARKETING_DESC",
	scheduled: undefined, // not scheduled email marketing
	email_subject: "EMAIL_SUBJECT",
	selectedUserIds: [1],
	params: {
		template1: "PARAMS_VALUE" // using template 1 from mock
	},
	sendTo: "selected",
	templateId: 1
};

const mockEmailTemplates = [
	{
		id: 1,
		name: "template-1",
		htmlContent: "<h1>{{params.template1}}</h1>"
	},
	{
		id: 2,
		name: "template-1",
		htmlContent: "<h2>{{params.template2}}</h2>"
	}
];

const mockEmailMarketings = [
	{
		id: 1,
		title: "EMAIL_MARKETING_1",
		sent_at: "2023-01-01T12:00:00.000Z",
		scheduled: null,
		send_to: "all"
	},
	{
		id: 2,
		title: "EMAIL_MARKETING_2",
		sent_at: null,
		scheduled: "2023-01-01T12:00:00.000Z",
		send_to: "selected"
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

// Dependencies
import express, { Request, Response, NextFunction } from "express";
import supertest from "supertest";
import { Server } from "http";
import { errorHandler, isAdmin, isAuth } from "../../middlewares";
import { marketingService, notificationService, userService } from "../../services";
import { EmailMarketingItem, EmailTemplate, ScheduledEmailMarketingItem } from "../../interfaces";
import { marketingRepo } from "../../data";
import { ErrorObj } from "../../utils";
import schedule from "../../utils/scheduler";

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

	describe("GET /admin/marketing/emails/template", () => {
		afterEach(() => {
			jest.clearAllMocks();
		});

		describe("get email templates list", () => {
			it("should return 200 status code and email templates list data", async () => {
				// Mock marketingService.getEmailsTemplate to return list of email templates
				jest
					.spyOn(marketingService, "getEmailsTemplate")
					.mockResolvedValueOnce(mockEmailTemplates as EmailTemplate[]);

				const res = await supertest(app).get("/admin/marketing/emails/template");

				expect(res.status).toBe(200);
				expect(res.body).toMatchInlineSnapshot(`
          {
            "data": {
              "emailsTemplate": [
                {
                  "htmlContent": "<h1>{{params.template1}}</h1>",
                  "id": 1,
                  "name": "template-1",
                  "params": [
                    "template1",
                  ],
                },
                {
                  "htmlContent": "<h2>{{params.template2}}</h2>",
                  "id": 2,
                  "name": "template-1",
                  "params": [
                    "template2",
                  ],
                },
              ],
            },
            "status": "success",
          }
        `);

				// Restore marketingService.getEmailsTemplate
				(marketingService.getEmailsTemplate as jest.Mock).mockRestore();
			});
		});
	});

	describe("GET /admin/marketing/emails", () => {
		afterEach(() => {
			jest.clearAllMocks();
		});

		describe("get valid request query", () => {
			it("should return 200 status code and email marketings list data", async () => {
				// Mock getNotificationMarketings DB to return mocked email marketings
				jest.spyOn(marketingRepo, "getEmailMarketings").mockResolvedValueOnce({
					emailMarketings: mockEmailMarketings as ScheduledEmailMarketingItem[],
					...mockPaginationData
				});

				const res = await supertest(app).get("/admin/marketing/emails").query({
					page: "1",
					q: "abc",
					scheduled: "false"
				});

				// Assert DB method wa called with expected args
				expect(marketingRepo.getEmailMarketings).toHaveBeenCalledWith("1", "abc", "false");

				// Assert response status code and body
				expect(res.status).toBe(200);
				expect(res.body).toEqual({
					status: "success",
					...mockPaginationData,
					data: {
						emailMarketings: mockEmailMarketings
					}
				});

				// Restore marketingService.getEmailsTemplate
				(marketingRepo.getEmailMarketings as jest.Mock).mockRestore();
			});
		});

		describe("given invalid query", () => {
			it("should return 400 status code and validation error message", async () => {
				// Invalid 'page' query
				const res1 = await supertest(app).get("/admin/marketing/emails").query({
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
				const res2 = await supertest(app).get("/admin/marketing/emails").query({
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
	});

	describe("GET /admin/marketing/emails/:emailMarketingId", () => {
		afterEach(() => {
			jest.clearAllMocks();
		});

		describe("given valid email marketing id params", () => {
			it("should return 200 status code and email marketing details data", async () => {
				// Mock getEmailMarketingDetail db repo
				jest.spyOn(marketingRepo, "getEmailMarketingDetail").mockResolvedValueOnce({
					emailMarketingResult: mockEmailMarketings[0] as EmailMarketingItem,
					selectedUsers: mockSelectedUsers
				});

				const res = await supertest(app).get("/admin/marketing/emails/1");

				expect(res.status).toBe(200);
				expect(res.body).toEqual({
					status: "success",
					data: {
						emailMarketing: {
							...mockEmailMarketings[0],
							selectedUsers: mockSelectedUsers
						}
					}
				});

				// Restore marketingRepo.getEmailMarketingDetail
				(marketingRepo.getEmailMarketingDetail as jest.Mock).mockRestore();
			});
		});

		describe("given invalid email marketing id params", () => {
			it("should return 400 status code and validation error message", async () => {
				const res = await supertest(app).get("/admin/marketing/emails/invalid"); // send request with invalid email marketing id

				expect(res.status).toBe(400);
				expect(res.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: Please provide a valid 'emailMarketingId'.",
            "status": "error",
          }
        `);
			});
		});
	});

	describe("POST /admin/marketing/emails", () => {
		describe("given valid new email marketing data", () => {
			it("should return 201 status and successfully create new email marketing with expected data", async () => {
				// Mock userService.getUserEmailAndNameByIds
				jest
					.spyOn(userService, "getUserEmailAndNameByIds")
					.mockResolvedValueOnce(mockSelectedUsers);

				// Mock marketingService.getSingleEmailTemplate
				jest
					.spyOn(marketingService, "getSingleEmailTemplate")
					.mockResolvedValueOnce(mockEmailTemplates[0] as EmailTemplate);

				// Mock marketingService.sendEmails
				jest.spyOn(marketingService, "sendEmails").mockResolvedValueOnce({
					failedEmails: [],
					successCount: 1,
					failureCount: 0,
					sendAt: "2023-01-01T00:00:00.000Z"
				});

				// Mock marketingRepo.createEmailMarketing
				jest.spyOn(marketingRepo, "createEmailMarketing").mockResolvedValueOnce({
					notification_code: "ABCDE12345",
					...newEmailMarketing
				} as unknown as EmailMarketingItem);

				// Mock userService.getAllAdminUserIds
				jest.spyOn(userService, "getAllAdminUserIds").mockResolvedValueOnce([1, 2, 3]);

				// Mock notificationService.storeNotification
				jest.spyOn(notificationService, "storeNotification").mockResolvedValueOnce();

				// Send the request
				const res = await supertest(app).post("/admin/marketing/emails").send(newEmailMarketing);

				// Assert that emails is sent directly
				expect(marketingService.sendEmails).toHaveBeenCalledTimes(1);

				// Assert email marketing notification is stored
				expect(notificationService.storeNotification).toHaveBeenCalledWith(
					[1, 2, 3],
					expect.any(Object)
				);

				// Assert response status and data
				expect(res.status).toBe(201);
				expect(res.body).toEqual({
					status: "success",
					data: {
						newEmailMarketing: { ...newEmailMarketing, notification_code: "ABCDE12345" }
					}
				});

				jest.clearAllMocks();
			});
		});

		describe("email template not found", () => {
			it("should return 404 status code and not found error message", async () => {
				// Mock userService.getUserEmailAndNameByIds
				jest
					.spyOn(userService, "getUserEmailAndNameByIds")
					.mockResolvedValueOnce(mockSelectedUsers);

				// Mock marketingService.getSingleEmailTemplate to throw not found error
				jest
					.spyOn(marketingService, "getSingleEmailTemplate")
					.mockRejectedValueOnce(
						new ErrorObj.ClientError("Failed to find email template with id of '1'", 404)
					);

				const res = await supertest(app)
					.post("/admin/marketing/emails")
					.send({ ...newEmailMarketing, templateId: "2" });

				expect(res.status).toBe(404);
				expect(res.body).toMatchInlineSnapshot(`
          {
            "message": "Failed to find email template with id of '1'",
            "status": "error",
          }
        `);

				jest.clearAllMocks();
			});
		});

		describe("new email marketing is scheduled type", () => {
			it("should schedule email marketing with expected date", async () => {
				// Mock userService.getUserEmailAndNameByIds
				jest
					.spyOn(userService, "getUserEmailAndNameByIds")
					.mockResolvedValueOnce(mockSelectedUsers);

				// Mock marketingService.getSingleEmailTemplate
				jest
					.spyOn(marketingService, "getSingleEmailTemplate")
					.mockResolvedValueOnce(mockEmailTemplates[0] as EmailTemplate);

				// Mock marketingService.sendEmails
				jest.spyOn(schedule, "scheduleJob").mockImplementation(() => jest.fn() as any);

				// Mock marketingRepo.createEmailMarketing
				jest.spyOn(marketingRepo, "createEmailMarketing").mockResolvedValueOnce({
					notification_code: "ABCDE12345",
					...newEmailMarketing
				} as unknown as EmailMarketingItem);

				// Send the request
				const res = await supertest(app)
					.post("/admin/marketing/emails")
					.send({
						...newEmailMarketing,
						scheduled: "2023-01-01T00:00:00.000Z" // scheduled email marketing
					});

				// Assert that emails is sent directly
				expect(schedule.scheduleJob).toHaveBeenCalledTimes(1);
				expect(schedule.scheduleJob).toHaveBeenCalledWith(
					"ABCDE12345",
					new Date("2023-01-01T00:00:00.000Z"),
					expect.any(Function)
				);

				// Assert response status and data
				expect(res.status).toBe(201);
				expect(res.body).toEqual({
					status: "success",
					data: {
						newEmailMarketing: { ...newEmailMarketing, notification_code: "ABCDE12345" }
					}
				});

				jest.clearAllMocks();
			});
		});

		describe("given invalid new email marketing data", () => {
			it("should return 400 status code and validation error message", async () => {
				// Invalid title
				const res1 = await supertest(app)
					.post("/admin/marketing/emails")
					.send({ ...newEmailMarketing, title: "" });

				expect(res1.status).toBe(400);
				expect(res1.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: "title" is not allowed to be empty",
            "status": "error",
          }
        `);

				// Invalid scheduled date string (not ISO 8601)
				const res2 = await supertest(app)
					.post("/admin/marketing/emails")
					.send({ ...newEmailMarketing, scheduled: "01-01-2023" });

				expect(res2.status).toBe(400);
				expect(res2.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: "scheduled" must be in ISO 8601 date format",
            "status": "error",
          }
        `);

				// Invalid selected user ids format
				const res3 = await supertest(app)
					.post("/admin/marketing/emails")
					.send({
						...newEmailMarketing,
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
					.post("/admin/marketing/emails")
					.send({
						...newEmailMarketing,
						sendTo: "all" // should be 'selected'
					});

				expect(res4.status).toBe(400);
				expect(res4.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: "sendTo" must be [selected]",
            "status": "error",
          }
        `);

				// Exceed maximum selected users
				const res5 = await supertest(app)
					.post("/admin/marketing/emails")
					.send({
						...newEmailMarketing,
						selectedUserIds: Array(101).fill(1) // Length must be <= 100
					});

				expect(res5.status).toBe(400);
				expect(res5.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: Maximum selected users exceeded (max 100 users).",
            "status": "error",
          }
        `);

				// Empty selected users
				const res6 = await supertest(app)
					.post("/admin/marketing/emails")
					.send({
						...newEmailMarketing,
						selectedUserIds: [] // Length must be > 0
					});

				expect(res6.status).toBe(400);
				expect(res6.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: Selected users can't be empty",
            "status": "error",
          }
        `);
			});
		});
	});

	describe("POST /admin/marketing/emails/:emailMarketingId/cancel", () => {
		afterEach(() => {
			jest.clearAllMocks();
		});

		describe("given valid email marketing id and email marketing is not sent yet", () => {
			it("should return 200 status code and canceled email marketing id", async () => {
				// Mock marketingRepo.getEmailMarketingDetail
				jest.spyOn(marketingRepo, "getEmailMarketingDetail").mockResolvedValueOnce({
					emailMarketingResult: { ...mockEmailMarketings[0], sent_at: null } as EmailMarketingItem, // email marketing is not sent
					selectedUsers: mockSelectedUsers
				});

				// Mock marketingService.updateEmailMarketing
				jest.spyOn(marketingService, "updateEmailMarketing").mockResolvedValueOnce({
					...mockEmailMarketings[0],
					canceled: true
				} as EmailMarketingItem);

				const res = await supertest(app).post("/admin/marketing/emails/1/cancel");

				expect(res.status).toBe(200);
				expect(res.body).toEqual({
					status: "success",
					data: {
						canceledEmailMarketingId: mockEmailMarketings[0].id
					}
				});
			});
		});

		describe("given valid email marketing id but email marketing is already sent", () => {
			it("should return 400 status code and failed error message", async () => {
				// Mock getNotificationMarketingDetail db repo
				jest.spyOn(marketingRepo, "getEmailMarketingDetail").mockResolvedValueOnce({
					emailMarketingResult: { ...mockEmailMarketings[0] } as EmailMarketingItem, // email marketing is already sent
					selectedUsers: mockSelectedUsers
				});

				const res = await supertest(app).post("/admin/marketing/emails/1/cancel");

				expect(res.status).toBe(400);
				expect(res.body).toEqual({
					status: "error",
					message: "Can't cancel already sent email marketing!"
				});

				(marketingRepo.getEmailMarketingDetail as jest.Mock).mockRestore();
			});
		});

		describe("email marketing with corresponding id is not found", () => {
			it("should return 404 status code and error message", async () => {
				// Mock marketingService.getEmailMarketingDetail
				jest.spyOn(marketingRepo, "getEmailMarketingDetail").mockResolvedValueOnce({
					emailMarketingResult: { ...mockEmailMarketings[0], sent_at: null } as EmailMarketingItem, // email marketing is not sent yet
					selectedUsers: mockSelectedUsers
				});

				// Mock marketingRepo.getSingleEmailMarketing to return undefined
				jest.spyOn(marketingRepo, "getSingleEmailMarketing").mockResolvedValueOnce(undefined!);

				const res = await supertest(app).post("/admin/marketing/emails/1/cancel");

				expect(res.status).toBe(404);
				expect(res.body).toEqual({
					status: "error",
					message: "Email marketing not found!"
				});

				(marketingRepo.getEmailMarketingDetail as jest.Mock).mockRestore();
			});
		});
	});

	describe("PUT /admin/marketing/emails/:emailMarketingId", () => {
		afterEach(() => {
			jest.clearAllMocks();
		});

		describe("given valid email marketing id and email marketing is not sent yet", () => {
			it("should return 200 status code and updated email marketing data", async () => {
				// Mock marketingService.getEmailMarketingDetail
				jest.spyOn(marketingRepo, "getEmailMarketingDetail").mockResolvedValue({
					emailMarketingResult: { ...mockEmailMarketings[0], sent_at: null } as EmailMarketingItem, // email marketing is not sent yet
					selectedUsers: mockSelectedUsers
				});

				// Mock marketingService.getSingleEmailTemplate
				jest
					.spyOn(marketingService, "getSingleEmailTemplate")
					.mockResolvedValueOnce(mockEmailTemplates[0] as EmailTemplate);

				// Mock marketingService.updateEmailMarketing
				jest
					.spyOn(marketingService, "updateEmailMarketing")
					.mockResolvedValueOnce(mockEmailMarketings[0] as EmailMarketingItem);

				// Mock marketingService.scheduleEmailMarketing
				jest
					.spyOn(marketingService, "scheduleEmailMarketing")
					.mockImplementationOnce(() => jest.fn() as any);

				/* eslint-disable @typescript-eslint/no-unused-vars */
				const { sendTo: _, ...newEmailMarketingData } = newEmailMarketing;
				const updatedEmailMarketing = { ...newEmailMarketingData, removedUserIds: [3, 4, 5] };
				const res = await supertest(app)
					.put("/admin/marketing/emails/1")
					.send(updatedEmailMarketing);

				// Assert response status code and data
				expect(res.status).toBe(200);
				expect(res.body).toEqual({
					status: "success",
					data: {
						updatedEmailMarketing: {
							...mockEmailMarketings[0],
							sent_at: null,
							selectedUsers: mockSelectedUsers
						}
					}
				});

				const updatedEmailMarketingData = {
					title: newEmailMarketing.title,
					description: newEmailMarketing.description,
					scheduled: null,
					email_subject: newEmailMarketing.email_subject,
					template_id: newEmailMarketing.templateId,
					params: { ...newEmailMarketing.params, email_subject: "EMAIL_SUBJECT" }
				};

				// Assert email marketing was updated with expected data
				expect(marketingService.updateEmailMarketing).toHaveBeenCalledWith(
					{
						updatedEmailMarketingData,
						emailMarketingId: "1"
					},
					[1],
					[3, 4, 5]
				);
			});
		});

		describe("given valid email marketing id and email marketing is already sent yet", () => {
			it("should return 200 status code and updated email marketing data", async () => {
				// Mock marketingService.getEmailMarketingDetail
				jest.spyOn(marketingRepo, "getEmailMarketingDetail").mockResolvedValue({
					emailMarketingResult: { ...mockEmailMarketings[0] } as EmailMarketingItem, // email marketing status is sent
					selectedUsers: mockSelectedUsers
				});

				// Mock marketingService.getSingleEmailTemplate
				jest
					.spyOn(marketingService, "getSingleEmailTemplate")
					.mockResolvedValueOnce(mockEmailTemplates[0] as EmailTemplate);

				// Mock marketingService.updateEmailMarketing
				jest
					.spyOn(marketingService, "updateEmailMarketing")
					.mockResolvedValueOnce(mockEmailMarketings[0] as EmailMarketingItem);

				// Mock marketingService.scheduleEmailMarketing
				jest
					.spyOn(marketingService, "scheduleEmailMarketing")
					.mockImplementationOnce(() => jest.fn() as any);

				/* @typescript-eslint/no-unused-vars */
				const { sendTo: _, ...newEmailMarketingData } = newEmailMarketing;
				const updatedEmailMarketing = { ...newEmailMarketingData, removedUserIds: [3, 4, 5] };

				await supertest(app).put("/admin/marketing/emails/1").send(updatedEmailMarketing);

				const updatedEmailMarketingData = {
					title: updatedEmailMarketing.title,
					description: updatedEmailMarketing.description
				};

				// Assert email marketing was updated with expected data
				expect(marketingService.updateEmailMarketing).toHaveBeenCalledWith(
					{
						updatedEmailMarketingData,
						emailMarketingId: "1"
					},
					[1],
					[3, 4, 5]
				);
			});
		});
	});
});
