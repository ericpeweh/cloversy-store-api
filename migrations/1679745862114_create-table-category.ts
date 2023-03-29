import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("category", {
		id: {
			type: "SERIAL",
			primaryKey: true
		},
		name: {
			type: "VARCHAR(50)",
			notNull: true
		},
		description: {
			type: "TEXT"
		},
		identifier: {
			type: "VARCHAR(50)",
			notNull: true,
			unique: true
		},
		created_at: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		},
		modified_at: {
			type: "TIMESTAMP",
			default: pgm.func("CURRENT_TIMESTAMP")
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("category");
}
