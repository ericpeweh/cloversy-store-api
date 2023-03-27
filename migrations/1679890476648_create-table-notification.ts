import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("notification", {
		id: {
			type: "SERIAL",
			primaryKey: true
		},
		title: {
			type: "VARCHAR(255)",
			notNull: true
		},
		description: {
			type: "TEXT",
			notNull: true
		},
		user_id: {
			type: "INTEGER"
		},
		category_id: {
			type: "INTEGER",
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
