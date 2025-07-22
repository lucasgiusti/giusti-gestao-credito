import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Carteira } from '../persistence/typeorm/entities/carteira.entity';

// Configuração para o módulo NestJS
export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('POSTGRES_HOST', 'localhost'),
  port: configService.get<number>('POSTGRES_PORT', 5432),
  username: configService.get<string>('POSTGRES_USER', 'postgres'),
  password: configService.get<string>('POSTGRES_PASSWORD', 'postgres'),
  database: configService.get<string>('POSTGRES_DB', 'giusti-gestao-credito'),
  entities: [Carteira],
  synchronize: false,
  logging: configService.get<boolean>('TYPEORM_LOGGING', false),
  // Configurações adicionais
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrationsRun: configService.get<boolean>('TYPEORM_MIGRATIONS_RUN', false),
});

// Configuração para o CLI do TypeORM
const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'giusti-gestao-credito',
  entities: [Carteira],
  synchronize: false,
  logging: process.env.TYPEORM_LOGGING === 'true',
  migrations: [__dirname + '/../persistence/typeorm/migrations/**/*{.ts,.js}'],
  migrationsTableName: 'migrations',
};

// Exportar uma instância de DataSource para o CLI do TypeORM
export default new DataSource(dataSourceOptions);
