import { MultiStageValidationRegistry } from "./registry/multi-stage.registry";
import { UserCannotUpdateHimselfSpec } from "../../domain/specifications/user/user-cannot-update-himself.spec";
import { MasterCannotBeUpdatedSpec } from "../../domain/specifications/user/master-cannot-be-updated.spec";
import { IUserRepository } from "../interfaces/repositories/user.repository.interface";
import { UserEmailCannotExistSpec } from "../../domain/specifications/user/user-email-cannot-exist.spec";
import { UserCannotDeleteHimselfSpec } from "../../domain/specifications/user/user-cannot-delete-himself.spec";
import { MasterCannotBeDeletedSpec } from "../../domain/specifications/user/master-cannot-be-deleted.spec";
import { UpdaterCannotBeUserroleUserSpec } from "../../domain/specifications/user/updater-cannot-be-userrole-user.spec";
import { AuthenticatedUser } from "../../domain/entities/authenticated-user";
import { User } from "../../domain/entities/user";
import { UserRole, UserStatus } from "../../domain/entities/user";
import { CreateUserCommand, DeleteUserCommand, UpdateUserCommand } from "../use-cases/user/user.command";

export class UserValidationsSetup {
    static initialize(userRepository: IUserRepository) {

      /* CreateUserUseCase_rules ********************************************** */

      // 'invalid.usuario.com.este.email.ja.existe'
      MultiStageValidationRegistry.register(
        'CreateUserUseCase',
        'CreateUserUseCase_rules',
        'invalid.usuario.com.este.email.ja.existe',
        new UserEmailCannotExistSpec(userRepository),
        (cmd: CreateUserCommand) => ({
          email: cmd.authenticatedUser.email,
        })
      );
      /* CreateUserUseCase_rules ********************************************** */

      /* UpdateUserUseCase_rules ********************************************** */

      // 'unauthorized.usuario.com.userrole.user.nao.pode.atualizar.usuario'
      MultiStageValidationRegistry.register(
        'UpdateUserUseCase',
        'UpdateUserUseCase_rules',
        'unauthorized.usuario.com.userrole.user.nao.pode.atualizar.usuario',
        new UpdaterCannotBeUserroleUserSpec(userRepository),
        (cmd: UpdateUserCommand) => ({
          authenticatedUser: cmd.authenticatedUser,
        })
      );

      // 'unauthorized.usuario.nao.pode.atualizar.seu.proprio.userrole.or.status'
      MultiStageValidationRegistry.register(
        'UpdateUserUseCase',
        'UpdateUserUseCase_rules',
        'unauthorized.usuario.nao.pode.atualizar.seu.userrole.or.status',
        new UserCannotUpdateHimselfSpec(userRepository),
        (cmd: UpdateUserCommand) => ({
          authenticatedUser: cmd.authenticatedUser,
          id: cmd.id,
          userRole: cmd.userRole,
          status: cmd.status,
        })
      );

      // 'unauthorized.usuario.master.nao.pode.ter.seu.userrole.or.status.alterado'
      MultiStageValidationRegistry.register(
        'UpdateUserUseCase',
        'UpdateUserUseCase_rules',
        'unauthorized.usuario.master.nao.pode.ter.seu.userrole.or.status.alterado',
        new MasterCannotBeUpdatedSpec(userRepository),
        (cmd: UpdateUserCommand) => ({
          id: cmd.id,
          userRole: cmd.userRole,
          status: cmd.status,
        })
      );

      /* UpdateUserUseCase_rules ********************************************** */

      /* DeleteUserUseCase_rules ********************************************** */

      // 'unauthorized.usuario.com.userrole.user.nao.pode.excluir.usuario'
      MultiStageValidationRegistry.register(
        'DeleteUserUseCase',
        'DeleteUserUseCase_rules',
        'unauthorized.usuario.com.userrole.user.nao.pode.excluir.usuario',
        new UpdaterCannotBeUserroleUserSpec(userRepository),
        (cmd: DeleteUserCommand) => ({
          authenticatedUser: cmd.authenticatedUser,
        })
      );

      // 'unauthorized.usuario.nao.pode.excluir.ele.proprio'
      MultiStageValidationRegistry.register(
        'DeleteUserUseCase',
        'DeleteUserUseCase_rules',
        'unauthorized.usuario.nao.pode.excluir.ele.proprio',
        new UserCannotDeleteHimselfSpec(userRepository),
        (cmd: DeleteUserCommand) => ({
          authenticatedUser: cmd.authenticatedUser,
          id: cmd.id,
        })
      );

      // 'unauthorized.usuario.master.nao.pode.ser.excluido'
      MultiStageValidationRegistry.register(
        'DeleteUserUseCase',
        'DeleteUserUseCase_rules',
        'unauthorized.usuario.master.nao.pode.ser.excluido',
        new MasterCannotBeDeletedSpec(userRepository),
        (cmd: DeleteUserCommand) => ({
          id: cmd.id,
        })
      );
      /* DeleteUserUseCase_rules ********************************************** */
    }
  }