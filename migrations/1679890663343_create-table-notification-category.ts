import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("notification_category", {
		notification_category_id: {
			type: "SMALLSERIAL",
			primaryKey: true
		},
		notification_category_name: {
			type: "VARCHAR(100)",
			notNull: true
		}
	});

	// Insert category data
	pgm.sql("INSERT INTO notification_category (notification_category_name) VALUES ('transaction');");
	pgm.sql("INSERT INTO notification_category (notification_category_name) VALUES ('marketing');");
	pgm.sql("INSERT INTO notification_category (notification_category_name) VALUES ('message');");
	pgm.sql("INSERT INTO notification_category (notification_category_name) VALUES ('system');");
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("notification_category", { cascade: true });
}
