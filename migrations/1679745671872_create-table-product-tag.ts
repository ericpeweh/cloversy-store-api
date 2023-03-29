import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("product_tag", {
		id: {
			type: "SERIAL",
			primaryKey: true
		},
		product_id: {
			type: "INTEGER",
			notNull: true
		},
		tag: {
			type: "VARCHAR(50)",
			notNull: true
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("product_tag");
}
