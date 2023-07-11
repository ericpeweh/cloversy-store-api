import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("email_marketing", {
		email_marketing_id: {
			type: "SMALLSERIAL",
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
		scheduled: {
			type: "TIMESTAMP"
		},
		description: {
			type: "TEXT"
		},
		email_subject: {
			type: "VARCHAR(120)",
			notNull: true
		},
		send_to: {
			type: "VARCHAR(10)",
			notNull: true
		},
		canceled: {
			type: "BOOLEAN",
			notNull: true,
			default: false
		},
		params: {
			type: "JSONB"
		},
		success_count: {
			type: "SMALLINT"
		},
		failure_count: {
			type: "SMALLINT"
		},
		template_id: {
			type: "SMALLINT",
			notNull: true
		},
		failed_emails: {
			type: "JSONB"
		},
		created_at: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("email_marketing");
}
