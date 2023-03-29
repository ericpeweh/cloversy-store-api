import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"product_size",
		"unique_product_size.product_id_and_product_size.size",
		"UNIQUE (product_id, size)"
	);

	pgm.addConstraint(
		"product_size",
		"fk_product_size.product_id_and_product.id",
		"FOREIGN KEY(product_id) REFERENCES product(id)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint("product_size", "unique_product_size.product_id_and_product_size.size");
	pgm.dropConstraint("product_size", "fk_product_size.product_id_and_product.id");
}
