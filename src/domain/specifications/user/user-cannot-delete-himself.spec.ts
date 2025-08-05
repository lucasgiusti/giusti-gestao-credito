import { IValidationSpec } from "src/application/interfaces/common/validation-spec.interface";
import { IUserRepository } from "src/application/interfaces/repositories/user.repository.interface";
import { User } from "src/domain/entities/user";

export class UserCannotDeleteHimselfSpec implements IValidationSpec<{
    authenticatedUser: User,
    targetUser: User,
  }> {
    constructor(
        private readonly userRepository: IUserRepository,
    ) {}
    async isSatisfiedBy(value: {
      authenticatedUser: User,
      targetUser: User,
    }): Promise<boolean> {

      const updater = await this.userRepository.findByAuthServiceUserId(value.authenticatedUser.id);
      if (!updater) {
        return false;
      }

      if (value.targetUser.id === updater.id) {
        return false;
      }

      return true;
    }
  }