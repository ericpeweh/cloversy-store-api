import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"notification_marketing_target",
		"fk_notification_marketing_target.notification_marketing_id_and_notification_marketing.id",
		"FOREIGN KEY(notification_marketing_id) REFERENCES notification_marketing(id)"
	);

	pgm.addConstraint(
		"notification_marketing_target",
		"fk_notification_marketing_target.user_id_and_users.id",
		"FOREIGN KEY(user_id) REFERENCES users(id)"
	);

	pgm.addConstraint(
		"notification_marketing_target",
		"unique_notification_marketing_target.notification_marketing_id_and_notification_marketing_target.user_id_and_notification_marketing_target.token",
		"UNIQUE(notification_marketing_id, user_id, token)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint(
		"notification_marketing_target",
		"fk_notification_marketing_target.notification_marketing_id_and_notification_marketing.id"
	);
	pgm.dropConstraint(
		"notification_marketing_target",
		"fk_notification_marketing_target.user_id_and_users.id"
	);
	pgm.dropConstraint(
		"notification_marketing_target",
		"unique_notification_marketing_target.notification_marketing_id_and_notification_marketing_target.user_id_and_notification_marketing_target.token"
	);
}
