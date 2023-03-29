import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("notification_read", {
		id: {
			type: "SERIAL",
			primaryKey: true
		},
		user_id: {
			type: "INTEGER",
			notNull: true
		},
		notification_id: {
			type: "INTEGER",
			notNull: true
		},
		is_read: {
			type: "BOOLEAN",
			notNull: true,
			default: false
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("notification_read");
}
