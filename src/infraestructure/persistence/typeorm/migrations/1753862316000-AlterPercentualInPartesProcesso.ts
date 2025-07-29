import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterPercentualInPartesProcesso1753862316000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE partes_processo ALTER COLUMN "percentual" TYPE numeric(3,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE partes_processo ALTER COLUMN "percentual" TYPE decimal(5,4)`);
    }

}
