import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("product_last_seen", {
		id: {
			type: "SERIAL",
			primaryKey: true
		},
		user_id: {
			type: "SMALLINT",
			notNull: true
		},
		product_id: {
			type: "SMALLINT",
			notNull: true
		},
		seen_date: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("product_last_seen");
}
