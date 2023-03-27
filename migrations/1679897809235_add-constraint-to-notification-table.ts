import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint(
		"notification",
		"fk_notification.user_id_and_users.id",
		"FOREIGN KEY(user_id) REFERENCES users(id)"
	);

	pgm.addConstraint(
		"notification",
		"fk_notification.category_id_and_notification_category.id",
		"FOREIGN KEY(category_id) REFERENCES notification_category(id)"
	);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint("notification", "fk_notification.user_id_and_users.id");
	pgm.dropConstraint("notification", "fk_notification.category_id_and_notification_category.id");
}
