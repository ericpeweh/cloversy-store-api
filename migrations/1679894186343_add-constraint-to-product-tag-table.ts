import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"product_tag",
		"unique_product_tag.product_id_and_product_tag.tag",
		"UNIQUE (product_id, tag)"
	);

	pgm.addConstraint(
		"product_tag",
		"fk_product_tag.product_id_and_product.product_id",
		"FOREIGN KEY(product_id) REFERENCES product(product_id)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint("product_tag", "unique_product_tag.product_id_and_product_tag.tag");
	pgm.dropConstraint("product_tag", "fk_product_tag.product_id_and_product.product_id");
}
