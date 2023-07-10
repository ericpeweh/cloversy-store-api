import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"cart",
		"fk_cart.user_id_and_users.user_id",
		"FOREIGN KEY(user_id) REFERENCES users(user_id)"
	);

	pgm.addConstraint(
		"cart",
		"fk_cart.product_id_and_product.product_id",
		"FOREIGN KEY(product_id) REFERENCES product(product_id)"
	);

	pgm.addConstraint(
		"cart",
		"unique_cart.user_id_and_cart.product_id_and_cart.size",
		"UNIQUE (user_id, product_id, size)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint("cart", "fk_cart.user_id_and_users.user_id");
	pgm.dropConstraint("cart", "fk_cart.product_id_and_product.product_id");
	pgm.dropConstraint("cart", "unique_cart.user_id_and_cart.product_id_and_cart.size");
}
