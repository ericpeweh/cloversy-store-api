import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("email_subscription", {
		id: {
			type: "SERIAL",
			primaryKey: true
		},
		email: {
			type: "VARCHAR(255)",
			notNull: true,
			unique: true
		},
		subscription_date: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("email_subscription");
}
