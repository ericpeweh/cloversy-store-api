import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"product_image",
		"fk_product_image.product_id_and_product.id",
		"FOREIGN KEY(product_id) REFERENCES product(id)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint("product_image", "fk_product_image.product_id_and_product.id");
}
