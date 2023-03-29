import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"transactions",
		"fk_transactions.user_id_and_users.id",
		"FOREIGN KEY(user_id) REFERENCES users(id)"
	);

	pgm.addConstraint(
		"transactions",
		"fk_transactions.voucher_code_and_voucher.code",
		"FOREIGN KEY(voucher_code) REFERENCES voucher(code)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint("transactions", "fk_transactions.user_id_and_users.id");
	pgm.dropConstraint("transactions", "fk_transactions.voucher_code_and_voucher.code");
}
