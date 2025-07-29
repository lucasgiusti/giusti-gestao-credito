import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm";

export class CreateProcessosAndPartesProcessoTables1753735464877 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criando a tabela processos
        await queryRunner.createTable(
            new Table({
                name: "processos",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: "gen_random_uuid()"
                    },
                    {
                        name: "numero",
                        type: "varchar",
                        length: "50",
                        isNullable: false
                    },
                    {
                        name: "carteira_id",
                        type: "uuid",
                        isNullable: false
                    },
                    {
                        name: "valor_pedido",
                        type: "decimal",
                        precision: 15,
                        scale: 2,
                        isNullable: false
                    },
                    {
                        name: "valor_homologado",
                        type: "decimal",
                        precision: 15,
                        scale: 2,
                        isNullable: false
                    },
                    {
                        name: "tipo",
                        type: "enum",
                        enum: ["PRECATORIO", "JUDICIAL", "NPL"],
                        isNullable: false
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "deleted_at",
                        type: "timestamp",
                        isNullable: true
                    }
                ]
            }),
            true
        );

        // Criando índice único para o campo numero
        await queryRunner.createIndex(
            "processos",
            new TableIndex({
                name: "IDX_PROCESSOS_NUMERO",
                columnNames: ["numero"],
                isUnique: true
            })
        );

        // Criando foreign key para carteira_id
        await queryRunner.createForeignKey(
            "processos",
            new TableForeignKey({
                name: "FK_PROCESSOS_CARTEIRA",
                columnNames: ["carteira_id"],
                referencedTableName: "carteiras",
                referencedColumnNames: ["id"],
                onDelete: "RESTRICT"
            })
        );

        // Criando a tabela partes-processo
        await queryRunner.createTable(
            new Table({
                name: "partes_processo",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: "gen_random_uuid()"
                    },
                    {
                        name: "processo_id",
                        type: "uuid",
                        isNullable: false
                    },
                    {
                        name: "cedente_id",
                        type: "uuid",
                        isNullable: false
                    },
                    {
                        name: "valor",
                        type: "decimal",
                        precision: 15,
                        scale: 2,
                        isNullable: false
                    },
                    {
                        name: "percentual",
                        type: "decimal",
                        precision: 5,
                        scale: 4,
                        isNullable: false
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "deleted_at",
                        type: "timestamp",
                        isNullable: true
                    }
                ]
            }),
            true
        );

        // Criando foreign key para processo_id
        await queryRunner.createForeignKey(
            "partes_processo",
            new TableForeignKey({
                name: "FK_PARTES_PROCESSO_PROCESSO",
                columnNames: ["processo_id"],
                referencedTableName: "processos",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE"
            })
        );

        // Criando foreign key para cedente_id
        await queryRunner.createForeignKey(
            "partes_processo",
            new TableForeignKey({
                name: "FK_PARTES_PROCESSO_CEDENTE",
                columnNames: ["cedente_id"],
                referencedTableName: "cedentes",
                referencedColumnNames: ["id"],
                onDelete: "RESTRICT"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Removendo foreign keys da tabela partes_processo
        await queryRunner.dropForeignKey("partes_processo", "FK_PARTES_PROCESSO_CEDENTE");
        await queryRunner.dropForeignKey("partes_processo", "FK_PARTES_PROCESSO_PROCESSO");
        
        // Removendo a tabela partes_processo
        await queryRunner.dropTable("partes_processo");
        
        // Removendo foreign key da tabela processos
        await queryRunner.dropForeignKey("processos", "FK_PROCESSOS_CARTEIRA");
        
        // Removendo índice da tabela processos
        await queryRunner.dropIndex("processos", "IDX_PROCESSOS_NUMERO");
        
        // Removendo a tabela processos
        await queryRunner.dropTable("processos");
    }
}
