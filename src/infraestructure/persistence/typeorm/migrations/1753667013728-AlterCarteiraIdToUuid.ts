import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterCarteiraIdToUuid1753667013728 implements MigrationInterface {
    name = 'AlterCarteiraIdToUuid1753667013728';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Primeiro, removemos as restrições existentes (chave primária)
        await queryRunner.query(`ALTER TABLE "carteiras" DROP CONSTRAINT "PK_efe9dd56ffcf32615a6bb284619"`); 
        
        // Verificamos se existem índices antes de tentar removê-los
        const indexesExist = await queryRunner.query(
            `SELECT indexname FROM pg_indexes WHERE tablename = 'carteiras'`
        );
        
        // Removemos índices se existirem
        for (const index of indexesExist) {
            if (index.indexname.startsWith('IDX_')) {
                await queryRunner.query(`DROP INDEX "${index.indexname}"`); 
            }
        }

        // Adicionamos uma coluna temporária para armazenar os novos UUIDs
        await queryRunner.query(`ALTER TABLE "carteiras" ADD COLUMN "id_uuid" UUID DEFAULT gen_random_uuid()`); 

        // Removemos a coluna id antiga
        await queryRunner.query(`ALTER TABLE "carteiras" DROP COLUMN "id"`); 

        // Renomeamos a coluna id_uuid para id
        await queryRunner.query(`ALTER TABLE "carteiras" RENAME COLUMN "id_uuid" TO "id"`); 

        // Definimos a nova coluna id como chave primária
        await queryRunner.query(`ALTER TABLE "carteiras" ADD CONSTRAINT "PK_carteiras_id" PRIMARY KEY ("id")`); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Removemos as restrições existentes
        await queryRunner.query(`ALTER TABLE "carteiras" DROP CONSTRAINT "PK_carteiras_id"`); 
        
        // Verificamos se existem índices antes de tentar removê-los
        const indexesExist = await queryRunner.query(
            `SELECT indexname FROM pg_indexes WHERE tablename = 'carteiras'`
        );
        
        // Removemos índices se existirem
        for (const index of indexesExist) {
            if (index.indexname.startsWith('IDX_')) {
                await queryRunner.query(`DROP INDEX "${index.indexname}"`); 
            }
        }

        // Adicionamos uma coluna temporária para armazenar os IDs numéricos
        await queryRunner.query(`ALTER TABLE "carteiras" ADD COLUMN "id_int" SERIAL`); 

        // Removemos a coluna id UUID
        await queryRunner.query(`ALTER TABLE "carteiras" DROP COLUMN "id"`); 

        // Renomeamos a coluna id_int para id
        await queryRunner.query(`ALTER TABLE "carteiras" RENAME COLUMN "id_int" TO "id"`); 

        // Definimos a nova coluna id como chave primária
        await queryRunner.query(`ALTER TABLE "carteiras" ADD CONSTRAINT "PK_carteiras_id" PRIMARY KEY ("id")`); 
    }
}
