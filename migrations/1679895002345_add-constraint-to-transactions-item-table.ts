import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"transactions_item",
		"fk_transactions_item.transaction_id_and_transactions.transaction_id",
		"FOREIGN KEY(transaction_id) REFERENCES transactions(transaction_id)"
	);

	pgm.addConstraint(
		"transactions_item",
		"fk_transactions_item.product_id_and_product.product_id",
		"FOREIGN KEY(product_id) REFERENCES product(product_id)"
	);

	pgm.addConstraint(
		"transactions_item",
		"unique_transactions_item.transaction_id_and_transactions_item.product_id_and_transactions_item.product_size",
		"UNIQUE(transaction_id, product_id, product_size)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint(
		"transactions_item",
		"fk_transactions_item.transaction_id_and_transactions.transaction_id"
	);

	pgm.dropConstraint("transactions_item", "fk_transactions_item.product_id_and_product.product_id");

	pgm.dropConstraint(
		"transactions_item",
		"unique_transactions_item.transaction_id_and_transactions_item.product_id_and_transactions_item.product_size"
	);
}
