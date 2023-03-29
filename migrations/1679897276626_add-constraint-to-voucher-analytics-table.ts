import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"voucher_analytics",
		"fk_voucher_analytics.voucher_code_and_voucher.code",
		"FOREIGN KEY(voucher_code) REFERENCES voucher(code)"
	);

	pgm.addConstraint(
		"voucher_analytics",
		"fk_voucher_analytics.transaction_id_and_transactions.id",
		"FOREIGN KEY(transaction_id) REFERENCES transactions(id)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint("voucher_analytics", "fk_voucher_analytics.voucher_code_and_voucher.code");
	pgm.dropConstraint(
		"voucher_analytics",
		"fk_voucher_analytics.transaction_id_and_transactions.id"
	);
}
