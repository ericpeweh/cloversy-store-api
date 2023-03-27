import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"messages",
		"fk_messages.conversation_id_and_conversations.id",
		"FOREIGN KEY(conversation_id) REFERENCES conversations(id)"
	);

	pgm.addConstraint(
		"messages",
		"fk_messages.sender_id_and_users.id",
		"FOREIGN KEY(sender_id) REFERENCES users(id)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint("messages", "fk_messages.conversation_id_and_conversations.id");
	pgm.dropConstraint("messages", "fk_messages.sender_id_and_users.id");
}
