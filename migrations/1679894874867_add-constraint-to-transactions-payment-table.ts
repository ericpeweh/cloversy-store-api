import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"transactions_payment",
		"fk_transactions_payment.transaction_id_and_transactions.transaction_id",
		"FOREIGN KEY(transaction_id) REFERENCES transactions(transaction_id)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint(
		"transactions_payment",
		"fk_transactions_payment.transaction_id_and_transactions.transaction_id"
	);
}
