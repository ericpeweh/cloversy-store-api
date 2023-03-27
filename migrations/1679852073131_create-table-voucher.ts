import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("voucher", {
		code: {
			type: "VARCHAR(10)",
			primaryKey: true
		},
		title: {
			type: "VARCHAR(255)",
			notNull: true
		},
		expiry_date: {
			type: "TIMESTAMP"
		},
		discount: {
			type: "INTEGER",
			notNull: true
		},
		discount_type: {
			type: "VARCHAR(20)",
			notNull: true
		},
		status: {
			type: "VARCHAR(20)",
			notNull: true
		},
		usage_limit: {
			type: "INTEGER",
			default: 10
		},
		current_usage: {
			type: "INTEGER",
			default: 0
		},
		voucher_scope: {
			type: "VARCHAR(10)",
			notNull: true
		},
		description: {
			type: "TEXT"
		},
		created_at: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("voucher");
}
