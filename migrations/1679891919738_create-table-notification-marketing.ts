import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("notification_marketing", {
		notification_marketing_id: {
			type: "SERIAL",
			primaryKey: true
		},
		notification_code: {
			type: "VARCHAR(10)",
			notNull: true,
			unique: true
		},
		title: {
			type: "VARCHAR(100)",
			notNull: true
		},
		sent_at: {
			type: "TIMESTAMP"
		},
		send_to: {
			type: "VARCHAR(10)",
			notNull: true
		},
		scheduled: {
			type: "TIMESTAMP"
		},
		description: {
			type: "TEXT"
		},
		message_title: {
			type: "VARCHAR(100)",
			notNull: true
		},
		message_body: {
			type: "TEXT",
			notNull: true
		},
		image_url: {
			type: "TEXT"
		},
		action_link: {
			type: "VARCHAR(255)"
		},
		action_title: {
			type: "VARCHAR(50)"
		},
		success_count: {
			type: "SMALLINT"
		},
		failure_count: {
			type: "SMALLINT"
		},
		canceled: {
			type: "BOOLEAN",
			notNull: true,
			default: false
		},
		deeplink_url: {
			type: "VARCHAR(255)"
		},
		created_at: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("notification_marketing");
}
