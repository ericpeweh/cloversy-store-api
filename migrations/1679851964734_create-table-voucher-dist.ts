import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("voucher_dist", {
		id: {
			type: "SERIAL",
			primaryKey: true
		},
		user_id: {
			type: "INTEGER",
			notNull: true
		},
		voucher_code: {
			type: "VARCHAR(10)",
			notNull: true
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("voucher_dist");
}
