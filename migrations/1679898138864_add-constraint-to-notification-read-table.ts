import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"notification_read",
		"fk_notification_read.notification_id_and_notification.id",
		"FOREIGN KEY(notification_id) REFERENCES notification(id)"
	);

	pgm.addConstraint(
		"notification_read",
		"fk_notification.read.user_id_and_users.id",
		"FOREIGN KEY(user_id) REFERENCES users(id)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint(
		"notification_read",
		"fk_notification_read.notification_id_and_notification.id"
	);
	pgm.dropConstraint("notification_read", "fk_notification.read.user_id_and_users.id");
}
