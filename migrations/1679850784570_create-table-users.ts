import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("users", {
		id: {
			type: "SERIAL",
			primaryKey: true
		},
		full_name: {
			type: "VARCHAR(100)"
		},
		email: {
			type: "VARCHAR(255)",
			notNull: true,
			unique: true
		},
		contact: {
			type: "VARCHAR(20)"
		},
		profile_picture: {
			type: "TEXT"
		},
		user_status: {
			type: "VARCHAR(50)",
			notNull: true,
			default: "active"
		},
		credits: {
			type: "INTEGER",
			default: 0
		},
		banned_date: {
			type: "TIMESTAMP"
		},
		user_role: {
			type: "VARCHAR(10)",
			default: "user"
		},
		sub: {
			type: "VARCHAR(100)",
			unique: true
		},
		birth_date: {
			type: "TIMESTAMP"
		},
		created_at: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("users");
}
