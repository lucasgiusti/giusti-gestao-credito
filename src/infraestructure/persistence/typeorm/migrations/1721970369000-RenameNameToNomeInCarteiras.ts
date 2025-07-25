import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameNameToNomeInCarteiras1721970369000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE carteiras RENAME COLUMN "name" TO "nome"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE carteiras RENAME COLUMN "nome" TO "name"`);
    }

}
