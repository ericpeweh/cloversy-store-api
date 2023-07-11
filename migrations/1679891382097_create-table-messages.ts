import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("messages", {
		message_id: {
			type: "SERIAL",
			primaryKey: true
		},
		conversation_id: {
			type: "INTEGER",
			notNull: true
		},
		message_body: {
			type: "TEXT",
			notNull: true
		},
		sender_id: {
			type: "SMALLINT",
			notNull: true
		},
		created_at: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("messages");
}
