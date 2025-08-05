import { IValidationSpec } from "src/application/interfaces/common/validation-spec.interface";
import { IUserRepository } from "src/application/interfaces/repositories/user.repository.interface";
export class UserEmailCannotExistSpec implements IValidationSpec<{
    email: string,
  }> {
    constructor(private readonly userRepository: IUserRepository) {}

    async isSatisfiedBy(value: {
      email: string,
    }): Promise<boolean> {
      if (!value.email) {
        return false;
      }

      const user = await this.userRepository.findByEmail(value.email);
  
      return !user;
    }
  }