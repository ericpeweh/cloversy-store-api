import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("offers", {
		id: {
			type: "SERIAL",
			primaryKey: true
		},
		user_id: {
			type: "INTEGER",
			notNull: true
		},
		offer_name: {
			type: "VARCHAR(255)",
			notNull: true
		},
		created_at: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("offers");
}
