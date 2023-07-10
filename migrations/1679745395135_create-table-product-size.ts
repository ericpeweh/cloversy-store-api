import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("product_size", {
		size_id: {
			type: "SMALLSERIAL",
			primaryKey: true
		},
		product_id: {
			type: "SMALLINT",
			notNull: true
		},
		size: {
			type: "VARCHAR(10)",
			notNull: true
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("product_size");
}
