import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCodigoToCarteiras1753900667078 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE carteiras ADD COLUMN codigo VARCHAR(10) NOT NULL`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE carteiras DROP COLUMN codigo`)
    }

}
