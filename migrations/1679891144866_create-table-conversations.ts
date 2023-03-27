import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("conversations", {
		id: {
			type: "SERIAL",
			primaryKey: true
		},
		title: {
			type: "VARCHAR(100)",
			notNull: true
		},
		created_by: {
			type: "INTEGER",
			notNull: true
		},
		created_at: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("conversations");
}
