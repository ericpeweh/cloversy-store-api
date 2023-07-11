import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("conversations_users", {
		id: {
			type: "SERIAL",
			primaryKey: true
		},
		conversation_id: {
			type: "INTEGER",
			notNull: true
		},
		user_id: {
			type: "SMALLINT",
			notNull: true
		},
		read_at: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		},
		created_at: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("conversations_users");
}
