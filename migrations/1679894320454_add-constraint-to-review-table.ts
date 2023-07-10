import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"review",
		"fk_review.product_id_and_product.product_id",
		"FOREIGN KEY(product_id) REFERENCES product(product_id)"
	);

	pgm.addConstraint(
		"review",
		"fk_review.user_id_and_users.user_id",
		"FOREIGN KEY(user_id) REFERENCES users(user_id)"
	);

	pgm.addConstraint(
		"review",
		"fk_review.transaction_id_and_transactions.transaction_id",
		"FOREIGN KEY(transaction_id) REFERENCES transactions(transaction_id)"
	);

	pgm.addConstraint(
		"review",
		"unique_review.product_id_and_review.user_id_and_review.transaction_id",
		"UNIQUE(product_id, user_id, transaction_id)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint("review", "fk_review.product_id_and_product.product_id");
	pgm.dropConstraint("review", "fk_review.user_id_and_users.user_id");
	pgm.dropConstraint("review", "fk_review.transaction_id_and_transactions.transaction_id");
	pgm.dropConstraint(
		"review",
		"unique_review.product_id_and_review.user_id_and_review.transaction_id"
	);
}
