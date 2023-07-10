import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("product", {
		product_id: {
			type: "SMALLSERIAL",
			primaryKey: true
		},
		product_title: {
			type: "VARCHAR(100)",
			notNull: true
		},
		sku: {
			type: "VARCHAR(50)",
			notNull: true
		},
		price: {
			type: "DECIMAL(10,2)",
			notNull: true
		},
		product_status: {
			type: "VARCHAR(10)",
			notNull: true
		},
		category_id: {
			type: "SMALLINT",
			notNull: true
		},
		brand_id: {
			type: "SMALLINT",
			notNull: true
		},
		product_description: {
			type: "TEXT"
		},
		product_slug: {
			type: "VARCHAR(100)",
			unique: true,
			notNull: true
		},
		created_at: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		},
		modified_at: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("product");
}
