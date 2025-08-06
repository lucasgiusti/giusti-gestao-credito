import { IValidationSpec } from "src/application/interfaces/common/validation-spec.interface";
import { IUserRepository } from "src/application/interfaces/repositories/user.repository.interface";
import { User } from "src/domain/entities/user";

export class UserCannotDeleteHimselfSpec implements IValidationSpec<{
    authenticatedUser: User,
    id: string,
  }> {
    constructor(
        private readonly userRepository: IUserRepository,
    ) {}
    async isSatisfiedBy(value: {
      authenticatedUser: User,
      id: string,
    }): Promise<boolean> {

      const updater = await this.userRepository.findByAuthServiceUserId(value.authenticatedUser.id);
      if (!updater) {
        return false;
      }

      const targetUser = await this.userRepository.findById(value.id);
      if (!targetUser) {
        return false;
      }

      if (targetUser.id === updater.id) {
        return false;
      }

      return true;
    }
  }