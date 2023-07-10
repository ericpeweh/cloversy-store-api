import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"conversations",
		"fk_conversations.created_by_and_users.user_id",
		"FOREIGN KEY(created_by) REFERENCES users(user_id)"
	);

	pgm.addConstraint(
		"conversations",
		"unique_conversations.conversation_title_and_conversations.created_by",
		"UNIQUE(conversation_title, created_by)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint("conversations", "fk_conversations.created_by_and_users.user_id");
	pgm.dropConstraint(
		"conversations",
		"unique_conversations.conversation_title_and_conversations.created_by"
	);
}
