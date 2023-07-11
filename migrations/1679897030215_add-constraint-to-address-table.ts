import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"address",
		"fk_address.user_id_and_users.user_id",
		"FOREIGN KEY(user_id) REFERENCES users(user_id)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint("address", "fk_address.user_id_and_users.user_id");
}
