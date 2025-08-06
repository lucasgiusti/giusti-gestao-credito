import { IValidationSpec } from "src/application/interfaces/common/validation-spec.interface";
import { IUserRepository } from "src/application/interfaces/repositories/user.repository.interface";
import { AuthenticatedUser } from "src/domain/entities/authenticated-user";
import { User, UserRole } from "src/domain/entities/user";
export class UpdaterCannotBeUserroleUserSpec implements IValidationSpec<{
    authenticatedUser: AuthenticatedUser,
  }> {
    constructor(
        private readonly userRepository: IUserRepository,
    ) {}
    
    async isSatisfiedBy(value: {
      authenticatedUser: AuthenticatedUser,
    }): Promise<boolean> {
      const updater = await this.userRepository.findByAuthServiceUserId(value.authenticatedUser.id);
      if (!updater) {
        return false;
      }
  
      return updater.userRole !== UserRole.USER;
    }
}