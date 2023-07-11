import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"notification_read",
		"fk_notification_read.notification_id_and_notification.notification_id",
		"FOREIGN KEY(notification_id) REFERENCES notification(notification_id)"
	);

	pgm.addConstraint(
		"notification_read",
		"fk_notification.read.user_id_and_users.user_id",
		"FOREIGN KEY(user_id) REFERENCES users(user_id)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint(
		"notification_read",
		"fk_notification_read.notification_id_and_notification.notification_id"
	);
	pgm.dropConstraint("notification_read", "fk_notification.read.user_id_and_users.user_id");
}
