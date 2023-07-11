import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"wishlist",
		"fk_wishlist.user_id_and_users.user_id",
		"FOREIGN KEY(user_id) REFERENCES users(user_id)"
	);

	pgm.addConstraint(
		"wishlist",
		"fk_wishlist.product_id_and_product.product_id",
		"FOREIGN KEY(product_id) REFERENCES product(product_id)"
	);

	pgm.addConstraint(
		"wishlist",
		"unique_wishlist.user_id_and_wishlist.product_id",
		"UNIQUE(user_id, product_id)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint("wishlist", "fk_wishlist.user_id_and_users.user_id");
	pgm.dropConstraint("wishlist", "fk_wishlist.product_id_and_product.product_id");
	pgm.dropConstraint("wishlist", "unique_wishlist.user_id_and_wishlist.product_id");
}
