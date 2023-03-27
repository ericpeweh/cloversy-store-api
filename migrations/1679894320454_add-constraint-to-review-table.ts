import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"review",
		"fk_review.product_id_and_product.id",
		"FOREIGN KEY(product_id) REFERENCES product(id)"
	);

	pgm.addConstraint(
		"review",
		"fk_review.user_id_and_users.id",
		"FOREIGN KEY(user_id) REFERENCES users(id)"
	);

	pgm.addConstraint(
		"review",
		"fk_review.transaction_id_and_transactions.id",
		"FOREIGN KEY(transaction_id) REFERENCES transactions(id)"
	);

	pgm.addConstraint(
		"review",
		"unique_review.product_id_and_review.user_id_and_review.transaction_id",
		"UNIQUE(product_id, user_id, transaction_id)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint("review", "fk_review.product_id_and_product.id");
	pgm.dropConstraint("review", "fk_review.user_id_and_users.id");
	pgm.dropConstraint("review", "fk_review.transaction_id_and_transactions.id");
	pgm.dropConstraint(
		"review",
		"unique_review.product_id_and_review.user_id_and_review.transaction_id"
	);
}
