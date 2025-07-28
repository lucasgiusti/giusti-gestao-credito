import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterCedenteIdToUuid1753730573000 implements MigrationInterface {
    name = 'AlterCedenteIdToUuid1753730573000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Primeiro, removemos as restrições existentes (chave primária)
        await queryRunner.query(`ALTER TABLE "cedentes" DROP CONSTRAINT "PK_9a6664acb027e660265d909013d"`);
        
        // Verificamos se o índice existe antes de tentar removê-lo
        const indexExists = await queryRunner.query(
            `SELECT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'IDX_CEDENTES_DOCUMENTO')`
        );
        
        if (indexExists[0].exists) {
            await queryRunner.query(`DROP INDEX "IDX_CEDENTES_DOCUMENTO"`);
        }

        // Adicionamos uma coluna temporária para armazenar os novos UUIDs
        await queryRunner.query(`ALTER TABLE "cedentes" ADD COLUMN "id_uuid" UUID DEFAULT gen_random_uuid()`);

        // Recriamos o índice único para documento
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_CEDENTES_DOCUMENTO" ON "cedentes" ("documento")`);

        // Removemos a coluna id antiga
        await queryRunner.query(`ALTER TABLE "cedentes" DROP COLUMN "id"`);

        // Renomeamos a coluna id_uuid para id
        await queryRunner.query(`ALTER TABLE "cedentes" RENAME COLUMN "id_uuid" TO "id"`);

        // Definimos a nova coluna id como chave primária
        await queryRunner.query(`ALTER TABLE "cedentes" ADD CONSTRAINT "PK_cedentes_id" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Removemos as restrições existentes
        await queryRunner.query(`ALTER TABLE "cedentes" DROP CONSTRAINT "PK_cedentes_id"`);
        
        // Verificamos se o índice existe antes de tentar removê-lo
        const indexExists = await queryRunner.query(
            `SELECT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'IDX_CEDENTES_DOCUMENTO')`
        );
        
        if (indexExists[0].exists) {
            await queryRunner.query(`DROP INDEX "IDX_CEDENTES_DOCUMENTO"`);
        }

        // Adicionamos uma coluna temporária para armazenar os IDs numéricos
        await queryRunner.query(`ALTER TABLE "cedentes" ADD COLUMN "id_int" SERIAL`);

        // Recriamos o índice único para documento
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_CEDENTES_DOCUMENTO" ON "cedentes" ("documento")`);

        // Removemos a coluna id UUID
        await queryRunner.query(`ALTER TABLE "cedentes" DROP COLUMN "id"`);

        // Renomeamos a coluna id_int para id
        await queryRunner.query(`ALTER TABLE "cedentes" RENAME COLUMN "id_int" TO "id"`);

        // Definimos a nova coluna id como chave primária
        await queryRunner.query(`ALTER TABLE "cedentes" ADD CONSTRAINT "PK_cedentes_id" PRIMARY KEY ("id")`);
    }
}
