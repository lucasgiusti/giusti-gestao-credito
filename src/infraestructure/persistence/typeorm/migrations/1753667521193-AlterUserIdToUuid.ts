import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserIdToUuid1753667521193 implements MigrationInterface {
    name = 'AlterUserIdToUuid1753667521193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Verificar índices existentes para evitar erros ao remover constraints
        const indexesResult = await queryRunner.query(`SELECT indexname FROM pg_indexes WHERE tablename = 'users'`);
        const indexes = indexesResult.map(row => row.indexname);

        // Remover a constraint de chave primária
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);

        // Adicionar coluna UUID temporária
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "id_uuid" UUID DEFAULT gen_random_uuid()`);
        
        // Remover coluna id antiga
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        
        // Renomear coluna UUID temporária para id
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "id_uuid" TO "id"`);
        
        // Adicionar nova constraint de chave primária
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_users_id" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover a constraint de chave primária UUID
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_users_id"`);
        
        // Adicionar coluna id numérica temporária
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "id_int" SERIAL`);
        
        // Remover coluna id UUID
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        
        // Renomear coluna id numérica temporária para id
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "id_int" TO "id"`);
        
        // Adicionar constraint de chave primária original
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
    }

}
