import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"email_marketing_target",
		"fk_email_marketing_target.email_marketing_id_and_email_marketing.id",
		"FOREIGN KEY(email_marketing_id) REFERENCES email_marketing(id)"
	);

	pgm.addConstraint(
		"email_marketing_target",
		"fk_email_marketing_target.user_id_and_users.id",
		"FOREIGN KEY(user_id) REFERENCES users(id)"
	);

	pgm.addConstraint(
		"email_marketing_target",
		"unique_email_marketing_target.email_marketing_id_and_email_marketing_target.user_id",
		"UNIQUE(email_marketing_id, user_id)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint(
		"email_marketing_target",
		"fk_email_marketing_target.email_marketing_id_and_email_marketing.id"
	);
	pgm.dropConstraint("email_marketing_target", "fk_email_marketing_target.user_id_and_users.id");
	pgm.dropConstraint(
		"email_marketing_target",
		"unique_email_marketing_target.email_marketing_id_and_email_marketing_target.user_id"
	);
}
