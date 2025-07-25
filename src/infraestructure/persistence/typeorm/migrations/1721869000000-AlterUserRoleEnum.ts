import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserRoleEnum1721869000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Primeiro, remover a restrição de enum existente
        await queryRunner.query(`
            ALTER TABLE users 
            ALTER COLUMN user_role TYPE VARCHAR(255)
        `);

        // Criar o novo tipo enum com os valores atualizados
        await queryRunner.query(`
            DROP TYPE IF EXISTS users_user_role_enum2;
            CREATE TYPE users_user_role_enum2 AS ENUM ('ADMIN', 'USER', 'MASTER');
        `);

        // Converter a coluna para usar o novo tipo enum
        await queryRunner.query(`
            ALTER TABLE users 
            ALTER COLUMN user_role TYPE users_user_role_enum2 
            USING user_role::text::users_user_role_enum2
        `);

        // Não renomeamos o tipo, mantemos o novo nome users_user_role_enum2
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverter para o enum original
        await queryRunner.query(`
            ALTER TABLE users 
            ALTER COLUMN user_role TYPE VARCHAR(255)
        `);

        // Recriar o tipo enum original
        await queryRunner.query(`
            DROP TYPE IF EXISTS user_role_enum;
            CREATE TYPE user_role_enum AS ENUM ('ADMIN', 'USER');
        `);

        // Converter a coluna para usar o tipo enum original
        await queryRunner.query(`
            ALTER TABLE users 
            ALTER COLUMN user_role TYPE user_role_enum 
            USING (CASE WHEN user_role = 'MASTER' THEN 'ADMIN' ELSE user_role END)::text::user_role_enum
        `);

        // Remover o tipo enum2 que não é mais necessário
        await queryRunner.query(`
            DROP TYPE IF EXISTS users_user_role_enum2;
        `);
    }
}
