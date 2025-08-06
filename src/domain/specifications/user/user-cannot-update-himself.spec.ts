import { IValidationSpec } from "src/application/interfaces/common/validation-spec.interface";
import { IUserRepository } from "src/application/interfaces/repositories/user.repository.interface";
import { User, UserRole, UserStatus } from "src/domain/entities/user";

export class UserCannotUpdateHimselfSpec implements IValidationSpec<{
    authenticatedUser: User,
    id: string,
    userRole?: UserRole,
    status?: UserStatus,
  }> {
    constructor(
        private readonly userRepository: IUserRepository,
    ) {}
    
    async isSatisfiedBy(value: {
      authenticatedUser: User,
      id: string,
      userRole?: UserRole,
      status?: UserStatus,
    }): Promise<boolean> {
      const updater = await this.userRepository.findByAuthServiceUserId(value.authenticatedUser.id);
      if (!updater) {
        return false;
      }

      const targetUser = await this.userRepository.findById(value.id);
      if (!targetUser) {
        return false;
      }

      if (targetUser.id === updater.id && value.userRole !== undefined && targetUser.userRole !== value.userRole) {
        return false;
      }

      if (targetUser.id === updater.id && value.status !== undefined && targetUser.status !== value.status) {
        return false;
      }

      return true;
    }
  }