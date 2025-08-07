import { ValidationHelper } from "../registry/multi-stage.registry";
import { ICreateParteProcessoUseCaseCommand } from "../../use-cases/parte-processo/create-parte-processo.use-case";
import { IDeleteParteProcessoUseCaseCommand } from "../../use-cases/parte-processo/delete-parte-processo.use-case";
import { IUpdateParteProcessoUseCaseCommand } from "../../use-cases/parte-processo/update-parte-processo.use-case";
import { CedenteDeveExistirSpecification } from "src/application/validations/specifications/cedente/cedente-deve-existir.specification";
import { ICedenteRepository } from "src/application/interfaces/repositories/cedente.repository.interface";
import { ParteProcessoNaoPodeExistirSpecification } from "src/application/validations/specifications/parte-processo/parte-processo-nao-pode-existir.specification";
import { IParteProcessoRepository } from "src/application/interfaces/repositories/parte-processo.repository.interface";
import { ParteProcessoDeveExistirSpecification } from "src/application/validations/specifications/parte-processo/parte-processo-deve-existir.specification";
import { ValidationIdentifiers } from "../constants/validation-identifiers";
import { ErrorMessages } from "../constants/error.messages";

export class ParteProcessoValidationsSetup {
    static initialize(parteProcessoRepository: IParteProcessoRepository, cedenteRepository: ICedenteRepository) {

      ValidationHelper.registerValidation<ICreateParteProcessoUseCaseCommand, { id: string }>(
        ValidationIdentifiers.PARTE_PROCESSO_CREATE,
        ErrorMessages.CEDENTE_NAO_EXISTE,
        new CedenteDeveExistirSpecification(cedenteRepository),
        (cmd) => ({
          id: cmd.cedenteId,
        })
      );

      ValidationHelper.registerValidation<ICreateParteProcessoUseCaseCommand, { processoId: string, cedenteId: string }>(
        ValidationIdentifiers.PARTE_PROCESSO_CREATE,
        ErrorMessages.PARTE_PROCESSO_JA_EXISTE,
        new ParteProcessoNaoPodeExistirSpecification(parteProcessoRepository),
        (cmd) => ({
          processoId: cmd.processoId,
          cedenteId: cmd.cedenteId,
        })
      );

      ValidationHelper.registerValidation<IUpdateParteProcessoUseCaseCommand, { id: string }>(
        ValidationIdentifiers.PARTE_PROCESSO_UPDATE,
        ErrorMessages.CEDENTE_NAO_EXISTE,
        new CedenteDeveExistirSpecification(cedenteRepository),
        (cmd) => ({
          id: cmd.cedenteId,
        })
      );

      ValidationHelper.registerValidation<IUpdateParteProcessoUseCaseCommand, { id: string }>(
        ValidationIdentifiers.PARTE_PROCESSO_UPDATE,
        ErrorMessages.CEDENTE_NAO_EXISTE,
        new CedenteDeveExistirSpecification(cedenteRepository),
        (cmd) => ({
          id: cmd.cedenteId,
        })
      );

      ValidationHelper.registerValidation<IUpdateParteProcessoUseCaseCommand, { id: string, processoId: string }>(
        ValidationIdentifiers.PARTE_PROCESSO_UPDATE,
        ErrorMessages.PARTE_PROCESSO_NAO_EXISTE,
        new ParteProcessoDeveExistirSpecification(parteProcessoRepository),
        (cmd) => ({
          id: cmd.id,
          processoId: cmd.processoId,
        })
      );

      ValidationHelper.registerValidation<IUpdateParteProcessoUseCaseCommand, { id: string, processoId: string, cedenteId: string }>(
        ValidationIdentifiers.PARTE_PROCESSO_UPDATE,
        ErrorMessages.PARTE_PROCESSO_JA_EXISTE,
        new ParteProcessoNaoPodeExistirSpecification(parteProcessoRepository),
        (cmd) => ({
          id: cmd.id,
          processoId: cmd.processoId,
          cedenteId: cmd.cedenteId,
        })
      );

      ValidationHelper.registerValidation<IDeleteParteProcessoUseCaseCommand, { id: string, processoId: string }>(
        ValidationIdentifiers.PARTE_PROCESSO_DELETE,
        ErrorMessages.PARTE_PROCESSO_NAO_EXISTE,
        new ParteProcessoDeveExistirSpecification(parteProcessoRepository),
        (cmd) => ({
          id: cmd.id,
          processoId: cmd.processoId,
        })
      );
    }
  }