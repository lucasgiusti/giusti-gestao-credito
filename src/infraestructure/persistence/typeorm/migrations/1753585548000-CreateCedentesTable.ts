import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateCedentesTable1753585548000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "cedentes",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "nome",
                        type: "varchar",
                        length: "100",
                        isNullable: false
                    },
                    {
                        name: "tipo_documento",
                        type: "enum",
                        enum: ["CPF", "CNPJ"],
                        isNullable: false
                    },
                    {
                        name: "documento",
                        type: "varchar",
                        length: "14",
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
                    }
                ]
            }),
            true
        );

        // Criando índice único para o campo documento
        await queryRunner.createIndex(
            "cedentes",
            new TableIndex({
                name: "IDX_CEDENTES_DOCUMENTO",
                columnNames: ["documento"],
                isUnique: true
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("cedentes", "IDX_CEDENTES_DOCUMENTO");
        await queryRunner.dropTable("cedentes");
    }
}
