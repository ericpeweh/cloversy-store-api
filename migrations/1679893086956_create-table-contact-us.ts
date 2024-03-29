import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("contact_us", {
		id: {
			type: "SERIAL",
			primaryKey: true
		},
		sender_name: {
			type: "VARCHAR(200)",
			notNull: true
		},
		email: {
			type: "VARCHAR(254)",
			notNull: true
		},
		objective: {
			type: "VARCHAR(30)",
			notNull: true
		},
		message_title: {
			type: "VARCHAR(200)",
			notNull: true
		},
		message: {
			type: "TEXT",
			notNull: true
		},
		created_at: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("contact_us");
}
