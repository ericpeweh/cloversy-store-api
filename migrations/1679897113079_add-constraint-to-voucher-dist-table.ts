import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"voucher_dist",
		"fk_voucher_dist.user_id_and_users.id",
		"FOREIGN KEY(user_id) REFERENCES users(id)"
	);

	pgm.addConstraint(
		"voucher_dist",
		"fk_voucher_dist.voucher_code_and_voucher.code",
		"FOREIGN KEY(voucher_code) REFERENCES voucher(code)"
	);

	pgm.addConstraint(
		"voucher_dist",
		"unique_voucher_dist.user_id_and_voucher_dist.voucher_code",
		"UNIQUE(user_id, voucher_code)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint("voucher_dist", "fk_voucher_dist.user_id_and_users.id");
	pgm.dropConstraint("voucher_dist", "fk_voucher_dist.voucher_code_and_voucher.code");
	pgm.dropConstraint("voucher_dist", "unique_voucher_dist.user_id_and_voucher_dist.voucher_code");
}
