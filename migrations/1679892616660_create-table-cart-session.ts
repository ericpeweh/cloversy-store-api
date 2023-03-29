import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.sql(`CREATE TABLE cart_session (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
  )
  WITH (OIDS=FALSE);`);

	pgm.sql(
		`ALTER TABLE cart_session ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;`
	);

	pgm.sql(`CREATE INDEX "IDX_session_expire" ON "cart_session" ("expire");`);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("cart_session");
}
