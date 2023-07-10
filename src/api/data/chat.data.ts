// Config
import { QueryResult } from "pg";

// Types
import db from "../../config/connectDB";
import { Message } from "../interfaces";

// Utils
import { ErrorObj, getLocalTime } from "../utils";

export const createNewConversation = async (title: string, userId: number) => {
	const conversationsQuery = `INSERT INTO
    conversations(conversation_title, created_by)
    VALUES($1, $2) 
  ON CONFLICT DO NOTHING
  RETURNING id`;

	const result = await db.query(conversationsQuery, [title, userId]);

	return result.rows[0].id;
};

export const addConversationParticipants = async (conversationId: number, userIds: number[]) => {
	const conversationsUsersQuery = `INSERT 
  INTO conversations_users (conversation_id, user_id)
  VALUES($1, $2)`;

	userIds.forEach(async userId => {
		await db.query(conversationsUsersQuery, [conversationId, userId]);
	});
};

export const checkUserHaveCreatedConversation = async (userId: number) => {
	const conversationsQuery =
		"SELECT conversation_id AS id FROM conversations WHERE created_by = $1";

	const result = await db.query(conversationsQuery, [userId]);

	return result.rowCount ? true : false;
};

export const getAllUserIdsWithoutConversation = async () => {
	const usersQuery = `
  WITH mod_conversations AS (
    SELECT c.conversation_id AS id, c.conversation_title AS title, created_by
		FROM conversations c
    WHERE c.conversation_title = 'private-message-user-admin'
  )
  SELECT COALESCE(array_agg(u.user_id), '{}') AS user_ids
  FROM users u
    LEFT JOIN mod_conversations c
    ON u.user_id = c.created_by
  WHERE u.user_role = 'user' 
  AND c.id IS NULL`;

	const result = await db.query(usersQuery);

	return result.rows[0].user_ids;
};

export const getUserConversationIds = async (userId: number) => {
	const conversationsUsersQuery = `SELECT 
    array_agg(DISTINCT("conversation_id")) AS conversation_ids
  FROM conversations_users
  WHERE user_id = $1`;

	const result: QueryResult<{ conversation_ids: number[] }> = await db.query(
		conversationsUsersQuery,
		[userId]
	);

	return result.rows[0].conversation_ids;
};

export const verifyConversationAccess = async (conversationId: number, userId: number) => {
	const conversationsUsersQuery = `SELECT id 
    FROM conversations_users
  WHERE conversation_id = $1 AND user_id = $2`;

	const result = await db.query(conversationsUsersQuery, [conversationId, userId]);

	return result.rowCount ? true : false;
};

export const createMessage = async (conversationId: number, body: string, senderId: number) => {
	const messagesQuery = `INSERT INTO messages
    (conversation_id, message_body, sender_id)
    VALUES ($1, $2, $3)
  `;

	await db.query(messagesQuery, [conversationId, body, senderId]);
};

export const getConversationById = async (conversationId: string) => {
	const query = `SELECT c.conversation_id AS id, c.conversation_title AS title, c.*
    FROM conversations c
    WHERE c.conversation_id = $1`;

	const result = await db.query(query, [conversationId]);

	if (!result.rowCount) {
		throw new ErrorObj.ClientError("Percakapan tidak ditemukan!", 404);
	}

	return result.rows[0];
};

export const getConversationMessages = async (conversationId: string, userCursor: string) => {
	const limit = 10;

	// Get cursors (chat pagination)
	const cursorQuery = `SELECT 
      MAX(message_id) as max_cursor,
      MIN(message_id) as min_cursor 
    FROM messages 
    WHERE conversation_id = $1`;
	const cursorResult = await db.query(cursorQuery, [conversationId]);

	const maxCursor = cursorResult.rows[0].max_cursor || 1;
	const minCursor = cursorResult.rows[0].min_cursor || 1;
	const currentCursor = userCursor || maxCursor + 1;

	// Get messages based on cursor
	const query = `SELECT m.message_id AS id, m.message_body AS body, m.*, u.email
    FROM messages m
    JOIN users u ON m.sender_id = u.user_id
    WHERE m.conversation_id = $1
    AND m.message_id < $2
    ORDER BY m.created_at DESC
    LIMIT $3`;

	const result: QueryResult<Message> = await db.query(query, [
		conversationId,
		currentCursor,
		limit
	]);

	const nextCursor = result.rows[result.rowCount - 1]?.id || minCursor;

	return {
		messages: result.rows,
		nextCursor,
		currentCursor: currentCursor - 1 === maxCursor ? +currentCursor - 1 : +currentCursor,
		maxCursor,
		minCursor
	};
};

export const updateConversationLastRead = async (conversationId: string, userId: string) => {
	const query = `UPDATE conversations_users 
    SET read_at = $1
    WHERE conversation_id = $2
    AND user_id = $3
  `;

	await db.query(query, [getLocalTime(), conversationId, userId]);
};

export const getConversationList = async (page: string, userId: string) => {
	const limit = 10;
	const offset = parseInt(page) * limit - limit;

	let query = `WITH conversation_list AS 
    (
      SELECT c.conversation_id AS id, c.conversation_title AS title, c.*, u.full_name, u.profile_picture, u.user_contact AS contact
        FROM conversations c
      JOIN users u 
        ON c.created_by = u.user_id
    )
    SELECT *,
      (
        SELECT COUNT(m.message_id) 
          FROM messages m
          LEFT JOIN conversations_users cu
            ON m.conversation_id = cu.conversation_id
          WHERE m.conversation_id = c.conversation_id
          AND cu.user_id = $1
          AND m.sender_id != $1
          AND m.created_at > cu.read_at
      ) AS unread_message 
      FROM conversation_list c
    LEFT JOIN LATERAL (
      SELECT json_build_object(
        'id', m.message_id,
        'conversation_id', m.conversation_id,
        'body', m.message_body,
        'sender_id', m.sender_id,
        'created_at', m.created_at,
        'email', u.email
      ) AS latest_message
      FROM messages m
      JOIN users u
        ON m.sender_id = u.user_id
      WHERE m.conversation_id = c.id
      ORDER BY m.created_at DESC
      LIMIT 1
    ) latest ON TRUE
    ORDER BY unread_message DESC
  `;
	const totalQuery = "SELECT COUNT(conversation_id) FROM conversations";

	if (page) {
		query += ` LIMIT ${limit} OFFSET ${offset}`;
	}

	const result = await db.query(query, [userId]);
	const totalResult = await db.query(totalQuery);
	const totalConversations = totalResult.rows[0].count;

	return {
		conversations: result.rows,
		page: parseInt(page) || "all",
		pageSize: result.rowCount,
		totalCount: parseInt(totalConversations),
		totalPages: Math.ceil(totalConversations / limit)
	};
};

export const getConversationParticipantIds = async (conversationId: number) => {
	const conversationsUsersQuery = `SELECT 
    COALESCE(array_agg(user_id), '{}') 
    AS user_ids
  FROM conversations_users
  WHERE conversation_id = $1`;

	const result: QueryResult<{ user_ids: number[] }> = await db.query(conversationsUsersQuery, [
		conversationId
	]);

	return result.rows[0].user_ids;
};
