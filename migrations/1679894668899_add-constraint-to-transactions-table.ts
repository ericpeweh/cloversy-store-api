import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"transactions",
		"fk_transactions.user_id_and_users.user_id",
		"FOREIGN KEY(user_id) REFERENCES users(user_id)"
	);

	pgm.addConstraint(
		"transactions",
		"fk_transactions.voucher_code_and_voucher.voucher_code",
		"FOREIGN KEY(voucher_code) REFERENCES voucher(voucher_code)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint("transactions", "fk_transactions.user_id_and_users.user_id");
	pgm.dropConstraint("transactions", "fk_transactions.voucher_code_and_voucher.voucher_code");
}
