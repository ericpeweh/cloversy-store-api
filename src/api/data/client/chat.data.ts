// Config
import db from "../../../config/connectDB";

// Utils
import { ErrorObj } from "../../utils";

// Types
import { Message } from "../../interfaces";
import { QueryResult } from "pg";

export const getUserConversation = async (userId: string) => {
	const query = `SELECT c.conversation_id AS id, c.conversation_title AS title, c.*
    FROM conversations c
    WHERE c.created_by = $1
    AND c.conversation_title = 'private-message-user-admin'`;

	const result = await db.query(query, [userId]);

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
