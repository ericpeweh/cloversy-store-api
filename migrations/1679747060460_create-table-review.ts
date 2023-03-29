import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("review", {
		id: {
			type: "SERIAL",
			primaryKey: true
		},
		product_id: {
			type: "INTEGER",
			notNull: true
		},
		user_id: {
			type: "INTEGER",
			notNull: true
		},
		transaction_id: {
			type: "VARCHAR(10)",
			notNull: true
		},
		rating: {
			type: "SMALLINT",
			notNull: true,
			check: "(rating BETWEEN 1 AND 10)"
		},
		description: {
			type: "TEXT",
			notNull: true
		},
		status: {
			type: "VARCHAR(10)",
			notNull: true,
			default: "active"
		},
		created_at: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("review");
}
