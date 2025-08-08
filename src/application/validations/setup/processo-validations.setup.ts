import { ValidationHelper } from "../registry/multi-stage.registry";
import { IProcessoRepository } from "src/application/interfaces/repositories/processo.repository.interface";
import { ICreateProcessoUseCaseCommand } from "../../use-cases/processo/create-processo.use-case";
import { IDeleteProcessoUseCaseCommand } from "../../use-cases/processo/delete-processo.use-case";
import { IUpdateProcessoUseCaseCommand } from "../../use-cases/processo/update-processo.use-case";
import { ProcessoNaoPodeExistirSpecification } from "src/application/validations/specifications/processo/processo-nao-pode-existir.specification";
import { CarteiraDeveExistirSpecification } from "src/application/validations/specifications/carteira/carteira-deve-existir.specification";
import { ICarteiraRepository } from "src/application/interfaces/repositories/carteira.repository.interface";
import { ProcessoNaoDeveTerPartesSpecification } from "src/application/validations/specifications/processo/processo-nao-pode-ter-partes.specification";
import { IParteProcessoRepository } from "src/application/interfaces/repositories/parte-processo.repository.interface";
import { ValidationIdentifiers } from "../constants/validation-identifiers";
import { ErrorMessages } from "../constants/error.messages";

export class ProcessoValidationsSetup {
    static initialize(processoRepository: IProcessoRepository, carteiraRepository: ICarteiraRepository, parteProcessoRepository: IParteProcessoRepository) {

      // CREATE
      ValidationHelper.registerValidation<ICreateProcessoUseCaseCommand, { numero: string }>(
        ValidationIdentifiers.PROCESSO_CREATE,
        ErrorMessages.PROCESSO_JA_EXISTE,
        new ProcessoNaoPodeExistirSpecification(processoRepository),
        (cmd) => ({
          numero: cmd.numero,
        })
      );

      ValidationHelper.registerValidation<ICreateProcessoUseCaseCommand, { id: string }>(
        ValidationIdentifiers.PROCESSO_CREATE,
        ErrorMessages.CARTEIRA_NAO_EXISTE,
        new CarteiraDeveExistirSpecification(carteiraRepository),
        (cmd) => ({
          id: cmd.carteiraId,
        })
      );

      // UPDATE
      ValidationHelper.registerValidation<IUpdateProcessoUseCaseCommand, { id: string, numero: string }>(
        ValidationIdentifiers.PROCESSO_UPDATE,
        ErrorMessages.PROCESSO_JA_EXISTE,
        new ProcessoNaoPodeExistirSpecification(processoRepository),
        (cmd) => ({
          id: cmd.id,
          numero: cmd.numero,
        })
      );

      ValidationHelper.registerValidation<IUpdateProcessoUseCaseCommand, { id: string }>(
        ValidationIdentifiers.PROCESSO_UPDATE,
        ErrorMessages.CARTEIRA_NAO_EXISTE,
        new CarteiraDeveExistirSpecification(carteiraRepository),
        (cmd) => ({
          id: cmd.carteiraId,
        })
      );

      // DELETE
      ValidationHelper.registerValidation<IDeleteProcessoUseCaseCommand, { id: string }>(
        ValidationIdentifiers.PROCESSO_DELETE,
        ErrorMessages.PROCESSO_TEM_PARTES,
        new ProcessoNaoDeveTerPartesSpecification(parteProcessoRepository),
        (cmd) => {
          return {
            id: cmd.id,
          };
        }
      );
    }
}