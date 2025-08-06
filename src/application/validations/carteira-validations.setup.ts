import { MultiStageValidationRegistry } from "./registry/multi-stage.registry";
import { CarteiraCannotHaveProcessesSpec } from "src/domain/specifications/carteira/carteira-cannot-have-processes.spec";
import { ICarteiraRepository } from "src/application/interfaces/repositories/carteira.repository.interface";
import { IProcessoRepository } from "src/application/interfaces/repositories/processo.repository.interface";
import { CarteiraMustExistSpec } from "src/domain/specifications/carteira/carteira-must-exist.spec";
import { CarteiraCodeCannotExistSpec } from "src/domain/specifications/carteira/carteira-code-cannot-exist.spec";
import { Carteira } from "src/domain/entities/carteira";
import { CarteiraObjectMustExistSpec } from "src/domain/specifications/carteira/carteira-object-must-exist.spec";

export class CarteiraValidationsSetup {
    static initialize(carteiraRepository: ICarteiraRepository, processoRepository: IProcessoRepository) {

      /* CreateCarteiraUseCase_rules ********************************************** */

      // 'invalid.carteira.codigo.ja.existe'
      MultiStageValidationRegistry.register(
        'CreateCarteiraUseCase',
        'CreateCarteiraUseCase_rules',
        'invalid.carteira.codigo.ja.existe',
        new CarteiraCodeCannotExistSpec(carteiraRepository),
        (cmd: { 
          codigo: string
        }) => ({
          codigo: cmd.codigo,
        })
      );
      /* CreateCarteiraUseCase_rules ********************************************** */

      /* DeleteCarteiraUseCase_rules ********************************************** */

      // 'notfound.carteira'
      MultiStageValidationRegistry.register(
        'DeleteCarteiraUseCase',
        'DeleteCarteiraUseCase_rules',
        'notfound.carteira',
        new CarteiraMustExistSpec(carteiraRepository),
        (cmd: { 
          id: string
        }) => ({
          id: cmd.id,
        })
      );

      // 'invalid.carteira.tem.processos'
      MultiStageValidationRegistry.register(
        'DeleteCarteiraUseCase',
        'DeleteCarteiraUseCase_rules',
        'invalid.carteira.tem.processos',
        new CarteiraCannotHaveProcessesSpec(processoRepository),
        (cmd: { 
          id: string
        }) => ({
          id: cmd.id,
        })
      );
      /* DeleteCarteiraUseCase_rules ********************************************** */

      /* FindCarteiraByIdUseCase_rules ********************************************** */

      // 'notfound.carteira'
      MultiStageValidationRegistry.register(
        'FindCarteiraByIdUseCase',
        'FindCarteiraByIdUseCase_rules',
        'notfound.carteira',
        new CarteiraObjectMustExistSpec(),
        (cmd: { 
          targetCarteira: Carteira
        }) => ({
          targetCarteira: cmd.targetCarteira,
        })
      );
      /* FindCarteiraByIdUseCase_rules ********************************************** */

      /* UpdateCarteiraUseCase_rules ********************************************** */

      // 'notfound.carteira'
      MultiStageValidationRegistry.register(
        'UpdateCarteiraUseCase',
        'UpdateCarteiraUseCase_rules',
        'notfound.carteira',
        new CarteiraObjectMustExistSpec(),
        (cmd: { 
          targetCarteira: Carteira
        }) => ({
          targetCarteira: cmd.targetCarteira,
        })
      );
      /* UpdateCarteiraUseCase_rules ********************************************** */
    }
  }