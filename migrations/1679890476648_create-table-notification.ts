import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("notification", {
		notification_id: {
			type: "SERIAL",
			primaryKey: true
		},
		notification_title: {
			type: "VARCHAR(120)",
			notNull: true
		},
		notification_description: {
			type: "TEXT",
			notNull: true
		},
		user_id: {
			type: "SMALLINT"
		},
		notification_category_id: {
			type: "SMALLINT",
			notNull: true
		},
		action_link: {
			type: "TEXT"
		},
		created_at: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("notification");
}
