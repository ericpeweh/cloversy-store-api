import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("address", {
		id: {
			type: "SERIAL",
			primaryKey: true
		},
		user_id: {
			type: "INTEGER",
			notNull: true
		},
		recipient_name: {
			type: "VARCHAR(100)",
			notNull: true
		},
		contact: {
			type: "VARCHAR(20)",
			notNull: true
		},
		address: {
			type: "TEXT",
			notNull: true
		},
		is_default: {
			type: "BOOLEAN",
			notNull: true,
			default: false
		},
		province: {
			type: "VARCHAR(100)",
			notNull: true
		},
		province_id: {
			type: "INTEGER",
			notNull: true
		},
		city: {
			type: "VARCHAR(100)",
			notNull: true
		},
		city_id: {
			type: "INTEGER",
			notNull: true
		},
		subdistrict: {
			type: "VARCHAR(100)",
			notNull: true
		},
		subdistrict_id: {
			type: "INTEGER",
			notNull: true
		},
		postal_code: {
			type: "VARCHAR(10)",
			notNull: true
		},
		label: {
			type: "VARCHAR(100)"
		},
		shipping_note: {
			type: "TEXT"
		}
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("address");
}
