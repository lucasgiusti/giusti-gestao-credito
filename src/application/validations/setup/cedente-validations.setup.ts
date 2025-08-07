import { ICedenteRepository } from "../../interfaces/repositories/cedente.repository.interface";
import { DocumentoCedenteNaoPodeExistirSpecification } from "src/application/validations/specifications/cedente/documento-cedente-nao-pode-existir.specification";
import { ICreateCedenteUseCaseCommand } from "../../use-cases/cedente/create-cedente.use-case";
import { IUpdateCedenteUseCaseCommand } from "../../use-cases/cedente/update-cedente.use-case";
import { IDeleteCedenteUseCaseCommand } from "../../use-cases/cedente/delete-cedente.use-case";
import { CedenteNaoPodeTerPartesSpecification } from "src/application/validations/specifications/cedente/cedente-nao-pode-ter-partes.specification";
import { IParteProcessoRepository } from "src/application/interfaces/repositories/parte-processo.repository.interface";
import { ValidationHelper } from "../registry/multi-stage.registry";
import { ValidationIdentifiers } from "../constants/validation-identifiers";
import { ErrorMessages } from "../constants/error.messages";

export class CedenteValidationsSetup {
    static initialize(cedenteRepository: ICedenteRepository, parteProcessoRepository: IParteProcessoRepository) {

      ValidationHelper.registerValidation<ICreateCedenteUseCaseCommand, { documento: string }>(
        ValidationIdentifiers.CEDENTE_CREATE,
        ErrorMessages.CEDENTE_JA_EXISTE,
        new DocumentoCedenteNaoPodeExistirSpecification(cedenteRepository),
        (cmd) => ({
          documento: cmd.documento,
        })
      );

      ValidationHelper.registerValidation<IUpdateCedenteUseCaseCommand, { id: string, documento: string }>(
        ValidationIdentifiers.CEDENTE_UPDATE,
        ErrorMessages.CEDENTE_JA_EXISTE,
        new DocumentoCedenteNaoPodeExistirSpecification(cedenteRepository),
        (cmd) => ({
          id: cmd.id,
          documento: cmd.documento,
        })
      );

      ValidationHelper.registerValidation<IDeleteCedenteUseCaseCommand, { id: string }>(
        ValidationIdentifiers.CEDENTE_DELETE,
        ErrorMessages.CEDENTE_TEM_PARTES,
        new CedenteNaoPodeTerPartesSpecification(parteProcessoRepository),
        (cmd) => ({
          id: cmd.id,
        })
      );
    }
  }