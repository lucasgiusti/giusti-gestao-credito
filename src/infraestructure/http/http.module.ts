import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarteiraController } from "./controllers/carteira.controller";
import { CreateCarteiraUseCase } from "src/application/use-cases/carteira/create-carteira.use-case";
import { FindAllCarteirasUseCase } from "src/application/use-cases/carteira/find-all-carteiras.use-case";
import { CreateUserUseCase } from "src/application/use-cases/user/create-user.use-case";
import { UserController } from "./controllers/user.controller";
import { EventBusService } from "src/infraestructure/events/event-bus.service";
import { UpdateSupabaseUserUseCase } from "src/application/use-cases/user/update-supabase-user.use-case";
import { SupabaseModule } from "../config/supabase.module";
import { FindAllUsersUseCase } from "src/application/use-cases/user/find-all-users.use-case";
import { UpdateUserUseCase } from "src/application/use-cases/user/update-user.use-case";
import { FindUserByIdUseCase } from "src/application/use-cases/user/find-user-by-id.use-case";
import { DeleteSupabaseUserUseCase } from "src/application/use-cases/user/delete-supabase-user.use-case";
import { DeleteUserUseCase } from "src/application/use-cases/user/delete-user.use-case";
import { UpdateCarteiraUseCase } from "src/application/use-cases/carteira/update-carteira.use-case";
import { FindCarteiraByIdUseCase } from "src/application/use-cases/carteira/find-carteira-by-id.use-case";
import { CreateCedenteUseCase } from "src/application/use-cases/cedente/create-cedente.use-case";
import { CedenteController } from "./controllers/cedente.controller";
import { FindAllCedentesUseCase } from "src/application/use-cases/cedente/find-all-cedentes.use-case";
import { FindCedenteByIdUseCase } from "src/application/use-cases/cedente/find-cedente-by-id.use-case";
import { FindCedenteByDocumentoUseCase } from "src/application/use-cases/cedente/find-cedente-by-documento.use-case";
import { UpdateCedenteUseCase } from "src/application/use-cases/cedente/update-cedente.use-case";
import { DeleteCedenteUseCase } from "src/application/use-cases/cedente/delete-cedente.use-case";
import { DeleteCarteiraUseCase } from "src/application/use-cases/carteira/delete-carteira.use-case";

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        SupabaseModule,
    ],
    providers: [
        EventBusService,
        CreateUserUseCase,
        FindAllUsersUseCase,
        FindUserByIdUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
        CreateCarteiraUseCase,
        FindAllCarteirasUseCase,
        FindCarteiraByIdUseCase,
        UpdateCarteiraUseCase,
        DeleteCarteiraUseCase,
        UpdateSupabaseUserUseCase,
        DeleteSupabaseUserUseCase,
        CreateCedenteUseCase,
        FindAllCedentesUseCase,
        FindCedenteByIdUseCase,
        FindCedenteByDocumentoUseCase,
        UpdateCedenteUseCase,
        DeleteCedenteUseCase,
    ],
    controllers: [
        CarteiraController,
        UserController,
        CedenteController,
    ],
})
export class HttpModule {}