import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1769598313511 implements MigrationInterface {
    name = 'Init1769598313511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "malicious_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message_id" uuid NOT NULL, "user_id" uuid NOT NULL, "incident_type" character varying(50) NOT NULL, "confidence" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2c6c65a220230c93dcfe7faeda5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_16848abf2921f43f587533720f" ON "malicious_activity" ("message_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_28c24ce19d09bf1509f646fe1c" ON "malicious_activity" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "malicious_activity" ADD CONSTRAINT "FK_16848abf2921f43f587533720f3" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "malicious_activity" ADD CONSTRAINT "FK_28c24ce19d09bf1509f646fe1c0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "malicious_activity" DROP CONSTRAINT "FK_28c24ce19d09bf1509f646fe1c0"`);
        await queryRunner.query(`ALTER TABLE "malicious_activity" DROP CONSTRAINT "FK_16848abf2921f43f587533720f3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_28c24ce19d09bf1509f646fe1c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_16848abf2921f43f587533720f"`);
        await queryRunner.query(`DROP TABLE "malicious_activity"`);
    }

}
