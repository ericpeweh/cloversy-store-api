import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"product",
		"fk_product.category_id_and_category.category_id",
		"FOREIGN KEY(category_id) REFERENCES category(category_id)"
	);

	pgm.addConstraint(
		"product",
		"fk_product.brand_id_and_brand.brand_id",
		"FOREIGN KEY(brand_id) REFERENCES brand(brand_id)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint("product", "fk_product.category_id_and_category.category_id");
	pgm.dropConstraint("product", "fk_product.brand_id_and_brand.brand_id");
}
