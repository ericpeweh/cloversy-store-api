import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"notification",
		"fk_notification.user_id_and_users.user_id",
		"FOREIGN KEY(user_id) REFERENCES users(user_id)"
	);

	pgm.addConstraint(
		"notification",
		"fk_notification.notification_category_id_and_notification_category.notification_category_id",
		"FOREIGN KEY(notification_category_id) REFERENCES notification_category(notification_category_id)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint("notification", "fk_notification.user_id_and_users.user_id");
	pgm.dropConstraint(
		"notification",
		"fk_notification.notification_category_id_and_notification_category.notification_category_id"
	);
}
