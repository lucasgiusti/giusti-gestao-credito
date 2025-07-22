import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarteiraController } from "./controllers/carteira.controller";
import { CreateCarteiraUseCase } from "src/application/use-cases/carteira/create-carteira.use-case";
import { FindAllCarteirasUseCase } from "src/application/use-cases/carteira/find-all-carteiras.use-case";

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
    ],
    providers: [
        CreateCarteiraUseCase,
        FindAllCarteirasUseCase,
    ],
    controllers: [
        CarteiraController,
    ],
})
export class HttpModule {}