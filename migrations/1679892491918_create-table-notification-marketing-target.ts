import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("notification_marketing_target", {
		id: {
			type: "SERIAL",
			primaryKey: true
		},
		notification_marketing_id: {
			type: "INTEGER",
			notNull: true
		},
		user_id: {
			type: "INTEGER",
			notNull: true
		},
		token: {
			type: "TEXT",
			notNull: true
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("notification_marketing_target");
}
