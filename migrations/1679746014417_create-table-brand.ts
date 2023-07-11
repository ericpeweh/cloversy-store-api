import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("brand", {
		brand_id: {
			type: "SMALLSERIAL",
			primaryKey: true
		},
		brand_name: {
			type: "VARCHAR(50)",
			notNull: true
		},
		brand_identifier: {
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
	pgm.dropTable("brand");
}
