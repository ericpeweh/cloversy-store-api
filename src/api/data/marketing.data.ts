// Config
import db from "../../config/connectDB";

// Types
import { QueryResult } from "pg";
import {
	CreateNotifMarketingData,
	SendNotificationResult,
	NotifMarketingItem,
	NotificationSubscription,
	UpdateNotifMarketingDataArgs,
	ScheduledNotifMarketingItem,
	ScheduledEmailMarketingItem,
	EmailMarketingItem,
	CreateEmailMarketingData,
	UpdateEmailMarketingDataArgs,
	SendEmailResult
} from "../interfaces";

// Utils
import { ErrorObj, generateUniqueId, generateUpdateQuery, getLocalTime } from "../utils";

export const createNotificationMarketing = async (
	newNotifMarketingData: CreateNotifMarketingData,
	notifSubscriptions: NotificationSubscription[],
	notificationResult: SendNotificationResult | undefined
) => {
	const client = await db.pool.connect();

	const {
		title,
		scheduled,
		description,
		message_title,
		message_body,
		image_url,
		deeplink_url,
		action_link,
		action_title,
		send_to
	} = newNotifMarketingData;

	try {
		await client.query("BEGIN");

		// Create notification marketing record
		const notifMarketingQuery = `INSERT INTO notification_marketing (
      notification_code, title, sent_at, scheduled, description,
      message_title, message_body, image_url, deeplink_url, action_link, action_title,
      success_count, failure_count, send_to
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *
`;

		const notifMarketingParams = [
			generateUniqueId(),
			title,
			notificationResult?.sendAt,
			scheduled,
			description,
			message_title,
			message_body,
			image_url,
			deeplink_url,
			action_link,
			action_title,
			notificationResult?.successCount,
			notificationResult?.failureCount,
			send_to
		];

		const notifMarketingResult: QueryResult<
			NotifMarketingItem & { notification_marketing_id: number }
		> = await client.query(notifMarketingQuery, notifMarketingParams);

		// Create notification marketing target records
		if (notifSubscriptions.length > 0) {
			const notifMarketingTargetQuery = `INSERT INTO notification_marketing_target(
        notification_marketing_id,
        user_id,
        token
      ) VALUES ($1, $2, $3)`;

			notifSubscriptions.forEach(async sub => {
				await client.query(notifMarketingTargetQuery, [
					notifMarketingResult.rows[0].notification_marketing_id,
					sub.user_id,
					sub.token
				]);
			});
		}

		await client.query("COMMIT");
		return {
			...notifMarketingResult.rows[0],
			id: notifMarketingResult.rows[0].notification_marketing_id
		};
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
};

export const updateNotificationMarketing = async (
	updateNotifMarketingData: UpdateNotifMarketingDataArgs,
	currentNotifMarketing: NotifMarketingItem,
	notifSubscriptions: NotificationSubscription[],
	selectedUserIds?: string[] | number[],
	removedUserIds?: string[] | number[]
) => {
	const client = await db.pool.connect();
	const { updatedNotifMarketingData, notifMarketingId } = updateNotifMarketingData;

	try {
		await client.query("BEGIN");

		const { query: notificationQuery, params: notificationParams } = generateUpdateQuery(
			"notification_marketing",
			updatedNotifMarketingData,
			{ notification_marketing_id: notifMarketingId },
			" RETURNING *"
		);

		const result: QueryResult<NotifMarketingItem & { notification_marketing_id: number }> =
			await client.query(notificationQuery, notificationParams);
		const updatedNotifMarketing = result.rows[0];

		// Handle send_to field changed or send_to still 'all'
		if (
			currentNotifMarketing.send_to !== updatedNotifMarketing.send_to ||
			(currentNotifMarketing.send_to === "all" && updatedNotifMarketing.send_to === "all")
		) {
			// Delete all notification marketing target
			const notifMarketingDeleteQuery =
				"DELETE FROM notification_marketing_target WHERE notification_marketing_id = $1";

			await client.query(notifMarketingDeleteQuery, [notifMarketingId]);

			// Re-insert updated targets
			const notifMarketingInputQuery = `INSERT INTO notification_marketing_target(
        notification_marketing_id,
        user_id,
        token
      ) VALUES ($1, $2, $3)`;

			notifSubscriptions.forEach(async sub => {
				await client.query(notifMarketingInputQuery, [notifMarketingId, sub.user_id, sub.token]);
			});
		}

		// Handle if same send_to (selected)
		if (
			currentNotifMarketing.send_to === "selected" &&
			updatedNotifMarketing.send_to === "selected"
		) {
			if (selectedUserIds && selectedUserIds?.length > 0) {
				const notifMarketingInputQuery = `INSERT INTO notification_marketing_target (
          notification_marketing_id,
          user_id,
          token
        ) VALUES ($1, $2, $3)`;

				notifSubscriptions.forEach(async sub => {
					await client.query(notifMarketingInputQuery, [notifMarketingId, sub.user_id, sub.token]);
				});
			}

			if (removedUserIds && removedUserIds?.length > 0) {
				const notifMarketingDeleteQuery = `DELETE FROM notification_marketing_target
          WHERE notification_marketing_id = $1
          AND user_id = $2`;

				removedUserIds.forEach(async userId => {
					await client.query(notifMarketingDeleteQuery, [notifMarketingId, userId]);
				});
			}
		}

		await client.query("COMMIT");
		return { ...updatedNotifMarketing, id: updatedNotifMarketing.notification_marketing_id };
	} catch (error) {
		await client.query("ROLLBACK");
		console.log(error);

		throw error;
	} finally {
		client.release();
	}
};

export const getNotificationMarketings = async (
	page: string,
	searchQuery: string,
	scheduled: "true" | "false",
	itemsLimit?: string
) => {
	let paramsIndex = 0;
	const params = [];
	const limit = itemsLimit ? +itemsLimit : 10;
	const offset = parseInt(page) * limit - limit;

	let notifMarketingQuery = `SELECT nm.notification_marketing_id AS id, nm.*,
    (SELECT COUNT(id) AS target_count
      FROM notification_marketing_target nmt
      WHERE nmt.notification_marketing_id = nm.notification_marketing_id
    )
  FROM notification_marketing nm
  `;
	let totalQuery = "SELECT COUNT(notification_marketing_id) FROM notification_marketing nm";

	if (searchQuery) {
		const searchPart = ` WHERE (
      nm.notification_code iLIKE $${paramsIndex + 1} OR
      nm.title iLIKE $${paramsIndex + 1} OR
      CAST(nm.created_at AS VARCHAR) iLIKE $${paramsIndex + 1}
    )`;

		notifMarketingQuery += searchPart;
		totalQuery += searchPart;

		paramsIndex += 1;
		params.push(`%${searchQuery}%`);
	}

	if (scheduled === "true") {
		const filter = ` ${paramsIndex === 0 ? "WHERE" : "AND"} nm.scheduled IS NOT NULL 
      AND nm.sent_at IS NULL
      AND nm.scheduled >= $${paramsIndex + 1}
      AND nm.canceled = FALSE
    `;

		notifMarketingQuery += filter;
		totalQuery += filter;

		paramsIndex += 1;
		params.push(getLocalTime());
	}

	// Sort by id (last created first)
	notifMarketingQuery += " ORDER BY nm.notification_marketing_id DESC";

	if (page) {
		notifMarketingQuery += ` LIMIT ${limit} OFFSET ${offset}`;
	}

	const totalNotifMarketings = (await db.query(totalQuery, params)).rows[0].count;

	const notifMarketings: QueryResult<ScheduledNotifMarketingItem> = await db.query(
		notifMarketingQuery,
		params
	);

	return {
		notifMarketings: notifMarketings.rows,
		page: parseInt(page),
		pageSize: limit,
		totalCount: parseInt(totalNotifMarketings),
		totalPages: Math.ceil(totalNotifMarketings / limit)
	};
};

export const getNotificationMarketingDetail = async (notifMarketingId: string | number) => {
	const notifMarketingQuery = `SELECT nm.*, nm.notification_marketing_id AS id,
    (SELECT COUNT(id) AS target_count
      FROM notification_marketing_target nmt
      WHERE nmt.notification_marketing_id = nm.notification_marketing_id
    )
  FROM notification_marketing nm
  WHERE nm.notification_marketing_id = $1`;

	const notifMarketingResult: QueryResult<NotifMarketingItem> = await db.query(
		notifMarketingQuery,
		[notifMarketingId]
	);

	if (notifMarketingResult.rowCount === 0)
		throw new ErrorObj.ClientError(
			`Notification marketing with id of ${notifMarketingId} not found`,
			404
		);

	const notifMarketingTargetQuery = `SELECT DISTINCT ON (nmt.user_id)
      u.user_id AS user_id, u.email AS email,
      u.full_name AS full_name, 
      u.profile_picture AS profile_picture
    FROM notification_marketing_target nmt
    JOIN users u ON nmt.user_id = u.user_id
    WHERE nmt.notification_marketing_id = $1
    `;

	const result = await db.query(notifMarketingTargetQuery, [notifMarketingId]);
	const notifMarketingTargets = result.rows;

	return {
		notifMarketingResult: notifMarketingResult.rows[0],
		selectedUsers: notifMarketingTargets
	};
};

export const getNotifMarketingTargetUserIds = async (notifMarketingId: string | number) => {
	const notifMarketingQuery = `SELECT
    array_agg(DISTINCT("user_id")) AS user_ids
    FROM notification_marketing_target
  WHERE notification_marketing_id = $1`;

	const notifMarketingResult = await db.query(notifMarketingQuery, [notifMarketingId]);

	return notifMarketingResult.rows[0].user_ids;
};

export const getEmailMarketings = async (
	page: string,
	searchQuery: string,
	scheduled: "true" | "false",
	itemsLimit?: string
) => {
	let paramsIndex = 0;
	const params = [];
	const limit = itemsLimit ? +itemsLimit : 10;
	const offset = parseInt(page) * limit - limit;

	let emailMarketingQuery = `SELECT em.email_marketing_id AS id, em.*,
    (SELECT COUNT(id) AS target_count
      FROM email_marketing_target emt
      WHERE emt.email_marketing_id = em.email_marketing_id
    )
  FROM email_marketing em
  `;
	let totalQuery = "SELECT COUNT(email_marketing_id) FROM email_marketing em";

	if (searchQuery) {
		const searchPart = ` WHERE (
      em.notification_code iLIKE $${paramsIndex + 1} OR
      em.title iLIKE $${paramsIndex + 1} OR
      CAST(em.created_at AS VARCHAR) iLIKE $${paramsIndex + 1}
    )`;

		emailMarketingQuery += searchPart;
		totalQuery += searchPart;

		paramsIndex += 1;
		params.push(`%${searchQuery}%`);
	}

	if (scheduled === "true") {
		const filter = ` ${paramsIndex === 0 ? "WHERE" : "AND"} em.scheduled IS NOT NULL 
      AND em.sent_at IS NULL
      AND em.scheduled >= $${paramsIndex + 1}
      AND em.canceled = FALSE
    `;

		emailMarketingQuery += filter;
		totalQuery += filter;

		paramsIndex += 1;
		params.push(getLocalTime());
	}

	// Sort by id (last created first)
	emailMarketingQuery += " ORDER BY em.email_marketing_id DESC";

	if (page) {
		emailMarketingQuery += ` LIMIT ${limit} OFFSET ${offset}`;
	}

	const totalNotifMarketings = (await db.query(totalQuery, params)).rows[0].count;
	const emailMarketings: QueryResult<ScheduledEmailMarketingItem> = await db.query(
		emailMarketingQuery,
		params
	);

	return {
		emailMarketings: emailMarketings.rows,
		page: parseInt(page),
		pageSize: limit,
		totalCount: parseInt(totalNotifMarketings),
		totalPages: Math.ceil(totalNotifMarketings / limit)
	};
};

export const getEmailMarketingDetail = async (emailMarketingId: string | number) => {
	const emailMarketingQuery = `SELECT em.email_marketing_id AS id, em.*, 
    to_json(em.params) as params,
    (SELECT COUNT(id) AS target_count
      FROM email_marketing_target emt
      WHERE emt.email_marketing_id = em.email_marketing_id
    )
  FROM email_marketing em
  WHERE em.email_marketing_id = $1`;

	const emailMarketingResult: QueryResult<EmailMarketingItem> = await db.query(
		emailMarketingQuery,
		[emailMarketingId]
	);

	if (emailMarketingResult.rowCount === 0)
		throw new ErrorObj.ClientError(`Email marketing with id of ${emailMarketingId} not found`, 404);

	const emailMarketingTargetQuery = `SELECT DISTINCT ON (emt.user_id)
      u.user_id AS user_id, u.email AS email,
      u.full_name AS full_name, 
      u.profile_picture AS profile_picture
    FROM email_marketing_target emt
    JOIN users u ON emt.user_id = u.user_id
    WHERE emt.email_marketing_id = $1
    `;

	const result = await db.query(emailMarketingTargetQuery, [emailMarketingId]);
	const emailMarketingTargets = result.rows;

	return {
		emailMarketingResult: emailMarketingResult.rows[0],
		selectedUsers: emailMarketingTargets
	};
};

export const createEmailMarketing = async (
	newEmailMarketingData: CreateEmailMarketingData,
	selectedUserIds: string[],
	emailResult: SendEmailResult | undefined
) => {
	const client = await db.pool.connect();

	const { title, scheduled, description, email_subject, params, template_id, send_to } =
		newEmailMarketingData;

	try {
		await client.query("BEGIN");

		// Delete automatically added params field
		/* eslint-disable  @typescript-eslint/no-unused-vars */
		const { email_subject: _, full_name: _1, ...emailParams } = params;

		// Create email marketing record
		const emailMarketingQuery = `INSERT INTO email_marketing (
      notification_code, title, sent_at, scheduled, description,
      email_subject, send_to, params, template_id,
      success_count, failure_count, failed_emails
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *
`;

		const emailMarketingParams = [
			generateUniqueId(),
			title,
			emailResult?.sendAt,
			scheduled,
			description,
			email_subject,
			send_to,
			JSON.stringify(emailParams),
			template_id,
			emailResult?.successCount,
			emailResult?.failureCount,
			JSON.stringify(emailResult?.failedEmails + "")
		];

		const emailMarketingResult: QueryResult<EmailMarketingItem & { email_marketing_id: number }> =
			await client.query(emailMarketingQuery, emailMarketingParams);

		// Create email marketing target records
		if (selectedUserIds.length > 0) {
			const emailMarketingTargetQuery = `INSERT INTO email_marketing_target(
        email_marketing_id,
        user_id
      ) VALUES ($1, $2)`;

			selectedUserIds.forEach(async userId => {
				await client.query(emailMarketingTargetQuery, [
					emailMarketingResult.rows[0].email_marketing_id,
					userId
				]);
			});
		}

		await client.query("COMMIT");
		return { ...emailMarketingResult.rows[0], id: emailMarketingResult.rows[0].email_marketing_id };
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
};

export const getSingleEmailMarketing = async (emailMarketingId: number | string) => {
	const emailQuery =
		"SELECT em.email_marketing_id AS id, em.* FROM email_marketing em WHERE em.email_marketing_id = $1";

	const emailResult: QueryResult<EmailMarketingItem> = await db.query(emailQuery, [
		emailMarketingId
	]);

	return emailResult.rows[0];
};

export const updateEmailMarketing = async (
	updateEmailMarketingData: UpdateEmailMarketingDataArgs,
	selectedUserIds?: string[] | number[],
	removedUserIds?: string[] | number[]
) => {
	const client = await db.pool.connect();
	const { updatedEmailMarketingData, emailMarketingId } = updateEmailMarketingData;

	try {
		await client.query("BEGIN");

		const { query: emailQuery, params: emailParams } = generateUpdateQuery(
			"email_marketing",
			updatedEmailMarketingData,
			{ email_marketing_id: emailMarketingId },
			" RETURNING *"
		);

		const result: QueryResult<EmailMarketingItem & { email_marketing_id: number }> =
			await client.query(emailQuery, emailParams);
		const updatedEmailMarketing = result.rows[0];

		if (selectedUserIds && selectedUserIds?.length > 0) {
			const emailMarketingInputQuery = `INSERT INTO email_marketing_target (
          email_marketing_id,
          user_id
        ) VALUES ($1, $2)`;

			selectedUserIds.forEach(async userId => {
				await client.query(emailMarketingInputQuery, [emailMarketingId, userId]);
			});
		}

		if (removedUserIds && removedUserIds?.length > 0) {
			const emailMarketingDeleteQuery = `DELETE FROM email_marketing_target
          WHERE email_marketing_id = $1
          AND user_id = $2`;

			removedUserIds.forEach(async userId => {
				await client.query(emailMarketingDeleteQuery, [emailMarketingId, userId]);
			});
		}

		await client.query("COMMIT");
		return { ...updatedEmailMarketing, id: updatedEmailMarketing.email_marketing_id };
	} catch (error) {
		await client.query("ROLLBACK");
		console.log(error);

		throw error;
	} finally {
		client.release();
	}
};

export const getEmailMarketingTargetUserIds = async (emailMarketingId: string | number) => {
	const emailMarketingQuery = `SELECT
    array_agg(DISTINCT("user_id")) AS user_ids
    FROM email_marketing_target
  WHERE email_marketing_id = $1`;

	const emailMarketingResult = await db.query(emailMarketingQuery, [emailMarketingId]);

	return emailMarketingResult.rows[0].user_ids;
};

export const getSelectedBirthdayUsers = async () => {
	const minTransactionTotal = 1000000;
	const selectedUsersLimit = 100;

	/* 
    Select all users with req of:
    - Have transaction_total >= Rp.1.000.000,-
    - Must be 'user' (not 'admin')
    - Active user (not banned)
    - Account is more older or equal to 90 days
    - Exact birth_date as today date
    - No duplicate offer in the same year (offers table)
  */
	const usersQuery = `SELECT id
    FROM users u
    JOIN (
      SELECT user_id, SUM(total) AS transaction_total
      FROM transactions t
      GROUP BY t.user_id
      HAVING SUM(total) >= $1
    ) t
      ON u.user_id = t.user_id
    WHERE NOT EXISTS (
      SELECT 1
      FROM offers o
      WHERE o.user_id = u.user_id
        AND o.offer_name = 'birthday_offer'
        AND DATE_PART('year', o.created_at) = DATE_PART('year', CURRENT_DATE)
    )
      AND u.created_at <= NOW() - INTERVAL '90 days'
      AND u.user_role = 'user'
      AND u.banned_date IS NULL
      AND DATE_PART('month', u.birth_date) = DATE_PART('month', CURRENT_DATE)
      AND DATE_PART('day', u.birth_date) = DATE_PART('day', CURRENT_DATE)
    ORDER BY t.transaction_total DESC
    LIMIT $2;
  `;

	const usersResult: QueryResult<{ id: number }> = await db.query(usersQuery, [
		minTransactionTotal,
		selectedUsersLimit
	]);

	return usersResult;
};

export const createOffers = async (
	{ offerName }: { offerName: string },
	selectedUserIds: string[] | number[]
) => {
	const client = await db.pool.connect();

	try {
		await client.query("BEGIN");

		const offersQuery = `INSERT INTO offers(
    user_id,
    offer_name
  ) VALUES ($1, $2) RETURNING *`;

		selectedUserIds.forEach(userId => {
			client.query(offersQuery, [userId, offerName]);
		});

		await client.query("COMMIT");
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
};
