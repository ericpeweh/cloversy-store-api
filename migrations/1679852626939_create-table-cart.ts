import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("cart", {
		id: {
			type: "SERIAL",
			primaryKey: true
		},
		user_id: {
			type: "INTEGER",
			notNull: true
		},
		product_id: {
			type: "INTEGER",
			notNull: true
		},
		size: {
			type: "VARCHAR(10)",
			notNull: true
		},
		quantity: {
			type: "INTEGER",
			notNull: true
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("cart");
}
