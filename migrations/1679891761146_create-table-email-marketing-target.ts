import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("email_marketing_target", {
		id: {
			type: "SERIAL",
			primaryKey: true
		},
		email_marketing_id: {
			type: "SMALLINT",
			notNull: true
		},
		user_id: {
			type: "SMALLINT",
			notNull: true
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("email_marketing_target");
}
