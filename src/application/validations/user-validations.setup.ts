import { MultiStageValidationRegistry } from "./registry/multi-stage.registry";
import { UserCannotUpdateHimselfSpec } from "../../domain/specifications/user/user-cannot-update-himself.spec";
import { MasterCannotBeUpdatedSpec } from "../../domain/specifications/user/master-cannot-be-updated.spec";
import { IUserRepository } from "../interfaces/repositories/user.repository.interface";
import { UserEmailCannotExistSpec } from "../../domain/specifications/user/user-email-cannot-exist.spec";
import { UserCannotDeleteHimselfSpec } from "../../domain/specifications/user/user-cannot-delete-himself.spec";
import { MasterCannotBeDeletedSpec } from "../../domain/specifications/user/master-cannot-be-deleted.spec";
import { UpdaterCannotBeUserroleUserSpec } from "../../domain/specifications/user/updater-cannot-be-userrole-user.spec";
import { UserMustExistSpec } from "../../domain/specifications/user/user-must-exist.spec";
import { AuthenticatedUser } from "../../domain/entities/authenticated-user";
import { User } from "../../domain/entities/user";
import { UserRole, UserStatus } from "../../domain/entities/user";

export class UserValidationsSetup {
    static initialize(userRepository: IUserRepository) {

      /* CreateUserUseCase_rules ********************************************** */

      // 'invalid.usuario.com.este.email.ja.existe'
      MultiStageValidationRegistry.register(
        'CreateUserUseCase',
        'CreateUserUseCase_rules',
        'invalid.usuario.com.este.email.ja.existe',
        new UserEmailCannotExistSpec(userRepository),
        (cmd: { 
          email: string
        }) => ({
          email: cmd.email,
        })
      );
      /* CreateUserUseCase_rules ********************************************** */

      /* UpdateUserUseCase_rules ********************************************** */

      // 'invalid.usuario.nao.existe'
      MultiStageValidationRegistry.register(
        'UpdateUserUseCase',
        'UpdateUserUseCase_rules',
        'invalid.usuario.nao.existe',
        new UserMustExistSpec(),
        (cmd: { 
          targetUser: User
        }) => ({
          targetUser: cmd.targetUser,
        })
      );

      // 'unauthorized.usuario.com.userrole.user.nao.pode.atualizar.usuario'
      MultiStageValidationRegistry.register(
        'UpdateUserUseCase',
        'UpdateUserUseCase_rules',
        'unauthorized.usuario.com.userrole.user.nao.pode.atualizar.usuario',
        new UpdaterCannotBeUserroleUserSpec(),
        (cmd: {
          authenticatedUser: AuthenticatedUser
        }) => ({
          authenticatedUser: cmd.authenticatedUser,
        })
      );

      // 'unauthorized.usuario.nao.pode.atualizar.seu.proprio.userrole.or.status'
      MultiStageValidationRegistry.register(
        'UpdateUserUseCase',
        'UpdateUserUseCase_rules',
        'unauthorized.usuario.nao.pode.atualizar.seu.userrole.or.status',
        new UserCannotUpdateHimselfSpec(userRepository),
        (cmd: {
          authenticatedUser: AuthenticatedUser,
          targetUser: User,
          userRole: UserRole,
          status: UserStatus
        }) => ({
          authenticatedUser: cmd.authenticatedUser,
          targetUser: cmd.targetUser,
          userRole: cmd.userRole,
          status: cmd.status,
        })
      );

      // 'unauthorized.usuario.master.nao.pode.ter.seu.userrole.or.status.alterado'
      MultiStageValidationRegistry.register(
        'UpdateUserUseCase',
        'UpdateUserUseCase_rules',
        'unauthorized.usuario.master.nao.pode.ter.seu.userrole.or.status.alterado',
        new MasterCannotBeUpdatedSpec(),
        (cmd: {
          targetUser: User,
          userRole: UserRole,
          status: UserStatus
        }) => ({
          targetUser: cmd.targetUser,
          userRole: cmd.userRole,
          status: cmd.status,
        })
      );

      
      /* UpdateUserUseCase_rules ********************************************** */

      /* DeleteUserUseCase_rules ********************************************** */

      // 'invalid.usuario.nao.existe'
      MultiStageValidationRegistry.register(
        'DeleteUserUseCase',
        'DeleteUserUseCase_rules',
        'invalid.usuario.nao.existe',
        new UserMustExistSpec(),
        (cmd: { 
          targetUser: User
        }) => ({
          targetUser: cmd.targetUser,
        })
      );

      // 'unauthorized.usuario.com.userrole.user.nao.pode.excluir.usuario'
      MultiStageValidationRegistry.register(
        'DeleteUserUseCase',
        'DeleteUserUseCase_rules',
        'unauthorized.usuario.com.userrole.user.nao.pode.excluir.usuario',
        new UpdaterCannotBeUserroleUserSpec(),
        (cmd: { 
          authenticatedUser: AuthenticatedUser
        }) => ({
          authenticatedUser: cmd.authenticatedUser,
        })
      );

      // 'unauthorized.usuario.nao.pode.excluir.ele.proprio'
      MultiStageValidationRegistry.register(
        'DeleteUserUseCase',
        'DeleteUserUseCase_rules',
        'unauthorized.usuario.nao.pode.excluir.ele.proprio',
        new UserCannotDeleteHimselfSpec(userRepository),
        (cmd: { 
          authenticatedUser: AuthenticatedUser, 
          targetUser: User
        }) => ({
          authenticatedUser: cmd.authenticatedUser,
          targetUser: cmd.targetUser,
        })
      );

      // 'unauthorized.usuario.master.nao.pode.ser.excluido'
      MultiStageValidationRegistry.register(
        'DeleteUserUseCase',
        'DeleteUserUseCase_rules',
        'unauthorized.usuario.master.nao.pode.ser.excluido',
        new MasterCannotBeDeletedSpec(),
        (cmd: { 
          targetUser: User
        }) => ({
          targetUser: cmd.targetUser,
        })
      );
      /* DeleteUserUseCase_rules ********************************************** */

      /* FindUserByIdUseCase_rules ********************************************** */

      // 'invalid.usuario.nao.existe'
      MultiStageValidationRegistry.register(
        'FindUserByIdUseCase',
        'FindUserByIdUseCase_rules',
        'invalid.usuario.nao.existe',
        new UserMustExistSpec(),
        (cmd: { 
          targetUser: User
        }) => ({
          targetUser: cmd.targetUser,
        })
      );
      /* FindUserByIdUseCase_rules ********************************************** */
    }
  }