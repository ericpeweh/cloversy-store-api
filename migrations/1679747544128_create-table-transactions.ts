import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("transactions", {
		transaction_id: {
			type: "VARCHAR(10)",
			primaryKey: true
		},
		user_id: {
			type: "SMALLINT",
			notNull: true
		},
		order_status: {
			type: "VARCHAR(50)",
			notNull: true
		},
		order_status_modified: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		},
		order_note: {
			type: "TEXT"
		},
		gift_note: {
			type: "TEXT"
		},
		customer_note: {
			type: "TEXT"
		},
		voucher_code: {
			type: "VARCHAR(10)"
		},
		is_reviewed: {
			type: "BOOLEAN"
		},
		discount_total: {
			type: "DECIMAL(10,2)",
			notNull: true,
			default: 0
		},
		subtotal: {
			type: "DECIMAL(10,2)",
			notNull: true
		},
		total: {
			type: "DECIMAL(10,2)",
			notNull: true
		},
		created_at: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("transactions");
}
