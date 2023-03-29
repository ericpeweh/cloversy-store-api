import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("voucher_analytics", {
		id: {
			type: "SERIAL",
			primaryKey: true
		},
		voucher_code: {
			type: "VARCHAR(10)",
			notNull: true
		},
		transaction_id: {
			type: "VARCHAR(10)",
			notNull: true,
			unique: true
		},
		discount_total: {
			type: "DECIMAL(10,2)",
			notNull: true
		},
		usage_date: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("voucher_analytics");
}
