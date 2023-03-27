import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("transactions_item", {
		id: {
			type: "SERIAL",
			primaryKey: true
		},
		transaction_id: {
			type: "VARCHAR(10)",
			notNull: true
		},
		product_id: {
			type: "INTEGER",
			notNull: true
		},
		quantity: {
			type: "INTEGER",
			notNull: true
		},
		price: {
			type: "DECIMAL(10,2)",
			notNull: true
		},
		product_size: {
			type: "VARCHAR(10)",
			notNull: true
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("transactions_item");
}
