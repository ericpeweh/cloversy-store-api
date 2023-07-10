import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("product_image", {
		image_id: {
			type: "SMALLSERIAL",
			primaryKey: true
		},
		product_id: {
			type: "SMALLINT",
			notNull: true
		},
		url: {
			type: "TEXT",
			notNull: true
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("product_image");
}
