import { MultiStageValidationRegistry } from "./registry/multi-stage.registry";
import { CarteiraCannotHaveProcessesSpec } from "src/domain/specifications/carteira/carteira-cannot-have-processes.spec";
import { ICarteiraRepository } from "src/application/interfaces/repositories/carteira.repository.interface";
import { IProcessoRepository } from "src/application/interfaces/repositories/processo.repository.interface";
import { CarteiraCodeCannotExistSpec } from "src/domain/specifications/carteira/carteira-code-cannot-exist.spec";
import { CreateCarteiraCommand, DeleteCarteiraCommand } from "../use-cases/carteira/carteira.command";

export class CarteiraValidationsSetup {
    static initialize(carteiraRepository: ICarteiraRepository, processoRepository: IProcessoRepository) {

      /* CreateCarteiraUseCase_rules ********************************************** */

      // 'invalid.carteira.codigo.ja.existe'
      MultiStageValidationRegistry.register(
        'CreateCarteiraUseCase',
        'CreateCarteiraUseCase_rules',
        'invalid.carteira.codigo.ja.existe',
        new CarteiraCodeCannotExistSpec(carteiraRepository),
        (cmd: CreateCarteiraCommand) => ({
          codigo: cmd.codigo,
        })
      );
      /* CreateCarteiraUseCase_rules ********************************************** */

      /* DeleteCarteiraUseCase_rules ********************************************** */

      // 'invalid.carteira.tem.processos'
      MultiStageValidationRegistry.register(
        'DeleteCarteiraUseCase',
        'DeleteCarteiraUseCase_rules',
        'invalid.carteira.tem.processos',
        new CarteiraCannotHaveProcessesSpec(processoRepository),
        (cmd: DeleteCarteiraCommand) => ({
          id: cmd.id,
        })
      );
      /* DeleteCarteiraUseCase_rules ********************************************** */
    }
  }