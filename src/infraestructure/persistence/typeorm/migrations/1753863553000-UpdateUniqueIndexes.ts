import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class UpdateUniqueIndexes1753863553000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Remover o índice único existente na tabela processos
        await queryRunner.dropIndex("processos", "IDX_PROCESSOS_NUMERO");
        
        // Criar novo índice único na tabela processos incluindo deleted_at
        await queryRunner.createIndex(
            "processos",
            new TableIndex({
                name: "IDX_PROCESSOS_NUMERO",
                columnNames: ["numero", "deleted_at"],
                isUnique: true,
                where: "deleted_at IS NULL"
            })
        );

        // Criar índice único na tabela partes_processo
        await queryRunner.createIndex(
            "partes_processo",
            new TableIndex({
                name: "IDX_PARTES_PROCESSO_PROCESSO_CEDENTE",
                columnNames: ["processo_id", "cedente_id", "deleted_at"],
                isUnique: true,
                where: "deleted_at IS NULL"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover o índice único criado na tabela partes_processo
        await queryRunner.dropIndex("partes_processo", "IDX_PARTES_PROCESSO_PROCESSO_CEDENTE");
        
        // Remover o índice único modificado na tabela processos
        await queryRunner.dropIndex("processos", "IDX_PROCESSOS_NUMERO");
        
        // Recriar o índice único original na tabela processos
        await queryRunner.createIndex(
            "processos",
            new TableIndex({
                name: "IDX_PROCESSOS_NUMERO",
                columnNames: ["numero"],
                isUnique: true
            })
        );
    }
}
