import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"transactions_timeline",
		"fk_transactions_timeline.transaction_id_and_transactions.id",
		"FOREIGN KEY(transaction_id) REFERENCES transactions(id)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint(
		"transactions_timeline",
		"fk_transactions_timeline.transaction_id_and_transactions.id"
	);
}
