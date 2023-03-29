import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"wishlist",
		"fk_wishlist.user_id_and_users.id",
		"FOREIGN KEY(user_id) REFERENCES users(id)"
	);

	pgm.addConstraint(
		"wishlist",
		"fk_wishlist.product_id_and_product.id",
		"FOREIGN KEY(product_id) REFERENCES product(id)"
	);

	pgm.addConstraint(
		"wishlist",
		"unique_wishlist.user_id_and_wishlist.product_id",
		"UNIQUE(user_id, product_id)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint("wishlist", "fk_wishlist.user_id_and_users.id");
	pgm.dropConstraint("wishlist", "fk_wishlist.product_id_and_product.id");
	pgm.dropConstraint("wishlist", "unique_wishlist.user_id_and_wishlist.product_id");
}
