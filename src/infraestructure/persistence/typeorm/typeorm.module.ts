import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule as TypeOrmModuleLib } from "@nestjs/typeorm";
import { Carteira } from "./entities/carteira.entity";
import { ICarteiraRepository } from "src/application/interfaces/repositories/carteira.repository.interface";
import { TypeOrmCarteiraRepository } from "./repositories/typeorm-carteira.repository";
import { IUserRepository } from "src/application/interfaces/repositories/user.repository.interface";
import { TypeOrmUserRepository } from "./repositories/typeorm-user.repository";
import { User } from "./entities/user.entity";

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
          entities: [Carteira, User],
          synchronize: false,
          logging: configService.get<boolean>('TYPEORM_LOGGING', false),
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModuleLib.forFeature([Carteira, User]),
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
  ],
  exports: [
    ICarteiraRepository,
    IUserRepository,
  ],
})
export class TypeOrmModule {}
