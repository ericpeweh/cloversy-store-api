import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"conversations_users",
		"fk_conversations_users.conversation_id_and_conversations.conversation_id",
		"FOREIGN KEY(conversation_id) REFERENCES conversations(conversation_id)"
	);

	pgm.addConstraint(
		"conversations_users",
		"fk_conversations_users.user_id_and_users.user_id",
		"FOREIGN KEY(user_id) REFERENCES users(user_id)"
	);

	pgm.addConstraint(
		"conversations_users",
		"unique_conversations_users.user_id_and_conversations_users.conversation_id",
		"UNIQUE(user_id, conversation_id)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint(
		"conversations_users",
		"fk_conversations_users.conversation_id_and_conversations.conversation_id"
	);
	pgm.dropConstraint("conversations_users", "fk_conversations_users.user_id_and_users.user_id");
	pgm.dropConstraint(
		"conversations_users",
		"unique_conversations_users.user_id_and_conversations_users.conversation_id"
	);
}
