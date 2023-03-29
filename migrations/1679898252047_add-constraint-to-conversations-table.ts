import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"conversations",
		"fk_conversations.created_by_and_users.id",
		"FOREIGN KEY(created_by) REFERENCES users(id)"
	);

	pgm.addConstraint(
		"conversations",
		"unique_conversations.title_and_conversations.created_by",
		"UNIQUE(title, created_by)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint("conversations", "fk_conversations.created_by_and_users.id");
	pgm.dropConstraint("conversations", "unique_conversations.title_and_conversations.created_by");
}
