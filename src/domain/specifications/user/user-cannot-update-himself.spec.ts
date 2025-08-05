import { IValidationSpec } from "src/application/interfaces/common/validation-spec.interface";
import { IUserRepository } from "src/application/interfaces/repositories/user.repository.interface";
import { User, UserRole, UserStatus } from "src/domain/entities/user";

export class UserCannotUpdateHimselfSpec implements IValidationSpec<{
    authenticatedUser: User,
    targetUser: User,
    userRole?: UserRole,
    status?: UserStatus,
  }> {
    constructor(
        private readonly userRepository: IUserRepository,
    ) {}
    
    async isSatisfiedBy(value: {
      authenticatedUser: User,
      targetUser: User,
      userRole?: UserRole,
      status?: UserStatus,
    }): Promise<boolean> {
      const updater = await this.userRepository.findByAuthServiceUserId(value.authenticatedUser.id);
      if (!updater) {
        return false;
      }

      if (value.targetUser.id === updater.id && value.userRole !== undefined && value.targetUser.userRole !== value.userRole) {
        return false;
      }

      if (value.targetUser.id === updater.id && value.status !== undefined && value.targetUser.status !== value.status) {
        return false;
      }

      return true;
    }
  }