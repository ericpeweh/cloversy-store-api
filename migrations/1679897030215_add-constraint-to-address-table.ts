import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"address",
		"fk_address.user_id_and_users.id",
		"FOREIGN KEY(user_id) REFERENCES users(id)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint("address", "fk_address.user_id_and_users.id");
}
