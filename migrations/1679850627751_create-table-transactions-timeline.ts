import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("transactions_timeline", {
		transaction_id: {
			type: "VARCHAR(10)",
			notNull: true
		},
		timeline_object: {
			type: "JSONB"
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("transactions_timeline");
}
