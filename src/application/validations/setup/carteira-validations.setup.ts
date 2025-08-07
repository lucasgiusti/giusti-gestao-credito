import { ValidationHelper } from "../registry/multi-stage.registry";
import { CarteiraNaoPodeTerProcessosSpecification } from "src/application/validations/specifications/carteira/carteira-nao-pode-ter-processos.specification";
import { ICarteiraRepository } from "src/application/interfaces/repositories/carteira.repository.interface";
import { IProcessoRepository } from "src/application/interfaces/repositories/processo.repository.interface";
import { CodigoCarteiraNaoPodeExistirSpecification } from "src/application/validations/specifications/carteira/codigo-carteira-nao-pode-existir.specification";
import { ICreateCarteiraUseCaseCommand } from "../../use-cases/carteira/create-carteira.use-case";
import { IDeleteCarteiraUseCaseCommand } from "../../use-cases/carteira/delete-carteira.use-case";
import { IUpdateCarteiraUseCaseCommand } from "../../use-cases/carteira/update-carteira.use-case";
import { ValidationIdentifiers } from "../constants/validation-identifiers";
import { ErrorMessages } from "../constants/error.messages";

export class CarteiraValidationsSetup {
    static initialize(carteiraRepository: ICarteiraRepository, processoRepository: IProcessoRepository) {

      ValidationHelper.registerValidation<ICreateCarteiraUseCaseCommand, { codigo: string }>(
        ValidationIdentifiers.CARTEIRA_CREATE,
        ErrorMessages.CARTEIRA_JA_EXISTE,
        new CodigoCarteiraNaoPodeExistirSpecification(carteiraRepository),
        (cmd) => ({ 
          codigo: cmd.codigo
        })
      );

      ValidationHelper.registerValidation<IUpdateCarteiraUseCaseCommand, { id: string, codigo: string }>(
        ValidationIdentifiers.CARTEIRA_UPDATE,
        ErrorMessages.CARTEIRA_JA_EXISTE,
        new CodigoCarteiraNaoPodeExistirSpecification(carteiraRepository),
        (cmd) => ({ 
          id: cmd.id,
          codigo: cmd.codigo 
        })
      );

      ValidationHelper.registerValidation<IDeleteCarteiraUseCaseCommand, { id: string }>(
        ValidationIdentifiers.CARTEIRA_DELETE,
        ErrorMessages.CARTEIRA_TEM_PROCESSOS,
        new CarteiraNaoPodeTerProcessosSpecification(processoRepository),
        (cmd) => ({ 
          id: cmd.id 
        })
      );
    }
  }