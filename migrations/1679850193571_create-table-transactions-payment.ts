import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("transactions_payment", {
		transaction_id: {
			type: "VARCHAR(10)",
			primaryKey: true
		},
		payment_method: {
			type: "VARCHAR(20)",
			notNull: true
		},
		payment_status: {
			type: "VARCHAR(50)",
			notNull: true
		},
		payment_status_modified: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		},
		payment_object: {
			type: "JSON"
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("transactions_payment");
}
