import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"product_last_seen",
		"fk_product_last_seen.user_id_and_users.id",
		"FOREIGN KEY(user_id) REFERENCES users(id)"
	);

	pgm.addConstraint(
		"product_last_seen",
		"fk_product_last_seen.product_id_and_product.id",
		"FOREIGN KEY(product_id) REFERENCES product(id)"
	);

	pgm.addConstraint(
		"product_last_seen",
		"unique_product_last_seen.user_id_and_product_last_seen.product_id",
		"UNIQUE(user_id, product_id)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint("product_last_seen", "fk_product_last_seen.user_id_and_users.id");
	pgm.dropConstraint("product_last_seen", "fk_product_last_seen.product_id_and_product.id");
	pgm.dropConstraint(
		"product_last_seen",
		"unique_product_last_seen.user_id_and_product_last_seen.product_id"
	);
}
