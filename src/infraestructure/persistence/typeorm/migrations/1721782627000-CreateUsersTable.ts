import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateUsersTable1721782627000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100",
                        isNullable: false
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: "user_role",
                        type: "enum",
                        enum: ["ADMIN", "USER"],
                        isNullable: false
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["ACTIVE", "INACTIVE"],
                        isNullable: false
                    },
                    {
                        name: "auth_service_user_id",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                        isUnique: true
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

        // Criar índice único para email e deleted_at
        await queryRunner.createIndex(
            "users",
            new TableIndex({
                name: "IDX_USERS_EMAIL_DELETED_AT",
                columnNames: ["email", "deleted_at"],
                isUnique: true
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("users", "IDX_USERS_EMAIL_DELETED_AT");
        await queryRunner.dropTable("users");
    }
}
