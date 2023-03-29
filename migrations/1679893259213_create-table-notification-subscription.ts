import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("notification_subscription", {
		id: {
			type: "SERIAL",
			primaryKey: true
		},
		token: {
			type: "TEXT",
			notNull: true,
			unique: true
		},
		user_id: {
			type: "INTEGER",
			notNull: true
		},
		last_online: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("notification_subscription");
}
