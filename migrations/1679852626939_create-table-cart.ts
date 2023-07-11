import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("cart", {
		cart_item_id: {
			type: "SERIAL",
			primaryKey: true
		},
		user_id: {
			type: "SMALLINT",
			notNull: true
		},
		product_id: {
			type: "SMALLINT",
			notNull: true
		},
		size: {
			type: "VARCHAR(10)",
			notNull: true
		},
		quantity: {
			type: "SMALLINT",
			notNull: true
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("cart");
}
