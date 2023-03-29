import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("transactions_shipping", {
		transaction_id: {
			type: "VARCHAR(10)",
			primaryKey: true
		},
		shipping_cost: {
			type: "DECIMAL(10,2)",
			notNull: true
		},
		shipping_courier: {
			type: "VARCHAR(100)",
			notNull: true
		},
		shipping_service: {
			type: "VARCHAR(50)",
			notNull: true
		},
		shipping_tracking_code: {
			type: "VARCHAR(255)"
		},
		shipping_etd: {
			type: "VARCHAR(10)",
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
	pgm.dropTable("transactions_shipping");
}
