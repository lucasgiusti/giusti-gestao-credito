import { ValidationHelper } from "../registry/multi-stage.registry";
import { UserNaoPodeAtualizarEleMesmoSpecification } from "../specifications/user/user-nao-pode-atualizar-ele-mesmo.specification";
import { UserMasterNaoPodeSerAlteradoSpecification } from "../specifications/user/user-master-nao-pode-ser-alterado.specification";
import { IUserRepository } from "../../interfaces/repositories/user.repository.interface";
import { UserNaoPodeExistirSpecification } from "../specifications/user/user-nao-pode-existir.specification";
import { UserNaoPodeDeletarEleMesmoSpecification } from "../specifications/user/user-nao-pode-deletar-ele-mesmo.specification";
import { UserMasterNaoPodeSerExcluidoSpecification } from "../specifications/user/user-master-nao-pode-ser-excluido.specification";
import { UserUpdaterNaoPodeSerUserSpecification } from "../specifications/user/user-updater-nao-pode-ser-user.specification";
import { ICreateUserUseCaseCommand } from "../../use-cases/user/create-user.use-case";
import { IDeleteUserUseCaseCommand } from "../../use-cases/user/delete-user.use-case";
import { IUpdateUserUseCaseCommand } from "../../use-cases/user/update-user.use-case";
import { ValidationIdentifiers } from "../constants/validation-identifiers";
import { ErrorMessages } from "../constants/error.messages";

export class UserValidationsSetup {
    static initialize(userRepository: IUserRepository) {

      ValidationHelper.registerValidation<ICreateUserUseCaseCommand, { email: string }>(
        ValidationIdentifiers.USER_CREATE,
        ErrorMessages.USER_JA_EXISTE,
        new UserNaoPodeExistirSpecification(userRepository),
        (cmd) => ({
          email: cmd.email,
        })
      );

      ValidationHelper.registerValidation<IUpdateUserUseCaseCommand, { authServiceUserId: string }>(
        ValidationIdentifiers.USER_UPDATE,
        ErrorMessages.USUARIO_COM_USERROLE_USER_NAO_PODE_ATUALIZAR_USUARIO,
        new UserUpdaterNaoPodeSerUserSpecification(userRepository),
        (cmd) => ({
          authServiceUserId: cmd.authServiceUserId,
        })
      );

      ValidationHelper.registerValidation<IUpdateUserUseCaseCommand, { authServiceUserId: string, id: string, userRole: string, status: string }>(
        ValidationIdentifiers.USER_UPDATE,
        ErrorMessages.USUARIO_NAO_PODE_ATUALIZAR_SEU_USERROLE_OR_STATUS,
        new UserNaoPodeAtualizarEleMesmoSpecification(userRepository),
        (cmd) => ({
          authServiceUserId: cmd.authServiceUserId,
          id: cmd.id,
          userRole: cmd.userRole,
          status: cmd.status,
        })
      );

      ValidationHelper.registerValidation<IUpdateUserUseCaseCommand, { id: string, userRole: string, status: string }>(
        ValidationIdentifiers.USER_UPDATE,
        ErrorMessages.USUARIO_MASTER_NAO_PODE_TER_SEU_USERROLE_OR_STATUS_ALTERADO,
        new UserMasterNaoPodeSerAlteradoSpecification(userRepository),
        (cmd) => ({
          id: cmd.id,
          userRole: cmd.userRole,
          status: cmd.status,
        })
      );

      ValidationHelper.registerValidation<IDeleteUserUseCaseCommand, { authServiceUserId: string }>(
        ValidationIdentifiers.USER_DELETE,
        ErrorMessages.USUARIO_COM_USERROLE_USER_NAO_PODE_EXCLUIR_USUARIO,
        new UserUpdaterNaoPodeSerUserSpecification(userRepository),
        (cmd) => ({
          authServiceUserId: cmd.authServiceUserId,
        })
      );

      ValidationHelper.registerValidation<IDeleteUserUseCaseCommand, { authServiceUserId: string, id: string }>(
        ValidationIdentifiers.USER_DELETE,
        ErrorMessages.USUARIO_NAO_PODE_EXCLUIR_ELE_MESMO,
        new UserNaoPodeDeletarEleMesmoSpecification(userRepository),
        (cmd) => ({
          authServiceUserId: cmd.authServiceUserId,
          id: cmd.id,
        })
      );

      ValidationHelper.registerValidation<IDeleteUserUseCaseCommand, { id: string }>(
        ValidationIdentifiers.USER_DELETE,
        ErrorMessages.USUARIO_MASTER_NAO_PODE_SER_EXCLUIDO,
        new UserMasterNaoPodeSerExcluidoSpecification(userRepository),
        (cmd) => ({
          id: cmd.id,
        })
      );
    }
  }