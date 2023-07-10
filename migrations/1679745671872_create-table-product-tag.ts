import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("product_tag", {
		tag_id: {
			type: "SMALLSERIAL",
			primaryKey: true
		},
		product_id: {
			type: "SMALLINT",
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
