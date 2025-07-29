import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule as TypeOrmModuleLib } from "@nestjs/typeorm";
import { Carteira } from "./entities/carteira.entity";
import { ICarteiraRepository } from "src/application/interfaces/repositories/carteira.repository.interface";
import { TypeOrmCarteiraRepository } from "./repositories/typeorm-carteira.repository";
import { IUserRepository } from "src/application/interfaces/repositories/user.repository.interface";
import { TypeOrmUserRepository } from "./repositories/typeorm-user.repository";
import { User } from "./entities/user.entity";
import { Cedente } from "./entities/cedente.entity";
import { ICedenteRepository } from "src/application/interfaces/repositories/cedente.repository.interface";
import { TypeOrmCedenteRepository } from "./repositories/typeorm-cedente.repository";
import { Processo } from "./entities/processo.entity";
import { ParteProcesso } from "./entities/parte-processo.entity";
import { IProcessoRepository } from "src/application/interfaces/repositories/processo.repository.interface";
import { IParteProcessoRepository } from "src/application/interfaces/repositories/parte-processo.repository.interface";
import { TypeOrmProcessoRepository } from "./repositories/typeorm-processo.repository";
import { TypeOrmParteProcessoRepository } from "./repositories/typeorm-parte-processo.repository";

@Module({
  imports: [
    TypeOrmModuleLib.forRootAsync({
      imports: [
        ConfigModule,
      ],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('POSTGRES_HOST', 'localhost'),
          port: configService.get<number>('POSTGRES_PORT', 5432),
          username: configService.get<string>('POSTGRES_USER', 'postgres'),
          password: configService.get<string>('POSTGRES_PASSWORD', 'postgres'),
          database: configService.get<string>('POSTGRES_DB', 'giusti-gestao-credito'),
          entities: [Carteira, User, Cedente, Processo, ParteProcesso],
          synchronize: false,
          logging: configService.get<boolean>('TYPEORM_LOGGING', false),
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModuleLib.forFeature([Carteira, User, Cedente, Processo, ParteProcesso]),
  ],
  providers: [
    {
      provide: ICarteiraRepository,
      useClass: TypeOrmCarteiraRepository,
    },
    {
      provide: IUserRepository,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: ICedenteRepository,
      useClass: TypeOrmCedenteRepository,
    },
    {
      provide: IProcessoRepository,
      useClass: TypeOrmProcessoRepository,
    },
    {
      provide: IParteProcessoRepository,
      useClass: TypeOrmParteProcessoRepository,
    },
  ],
  exports: [
    ICarteiraRepository,
    IUserRepository,
    ICedenteRepository,
    IProcessoRepository,
    IParteProcessoRepository,
  ],
})
export class TypeOrmModule {}
