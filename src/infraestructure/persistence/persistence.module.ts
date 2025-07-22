import { DynamicModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "./typeorm/typeorm.module";

interface DatabaseOptions {
    type: 'typeorm';
    global?: boolean;
}

@Module({})
export class PersistenceModule {
    static async register({ global = false, type }: DatabaseOptions): Promise<DynamicModule> {
        return {
            global,
            module: PersistenceModule,
            imports: [
                TypeOrmModule,
            ],
            exports: [
                TypeOrmModule,
            ],
        };
    };
}