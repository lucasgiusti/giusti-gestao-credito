import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarteiraController } from "./controllers/carteira.controller";
import { CreateCarteiraUseCase } from "src/application/use-cases/carteira/create-carteira.use-case";
import { FindAllCarteirasUseCase } from "src/application/use-cases/carteira/find-all-carteiras.use-case";
import { CreateUserUseCase } from "src/application/use-cases/user/create-user.use-case";
import { UserController } from "./controllers/user.controller";
import { EventBusService } from "src/infraestructure/events/event-bus.service";
import { UpdateSupabaseUserMetadataUseCase } from "src/application/use-cases/user/update-supabase-user-metadata.use-case";
import { SupabaseModule } from "../config/supabase.module";
import { FindAllUsersUseCase } from "src/application/use-cases/user/find-all-users.use-case";
import { UpdateUserUseCase } from "src/application/use-cases/user/update-user.use-case";
import { FindUserByIdUseCase } from "src/application/use-cases/user/find-user-by-id.use-case";

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        SupabaseModule,
    ],
    providers: [
        EventBusService,
        CreateCarteiraUseCase,
        FindAllCarteirasUseCase,
        CreateUserUseCase,
        UpdateSupabaseUserMetadataUseCase,
        FindAllUsersUseCase,
        UpdateUserUseCase,
        FindUserByIdUseCase,
    ],
    controllers: [
        CarteiraController,
        UserController,
    ],
})
export class HttpModule {}