import { IValidationSpecification } from "src/application/interfaces/common/validation-specification.interface";
import { IUserRepository } from "src/application/interfaces/repositories/user.repository.interface";

export class UserNaoPodeExistirSpecification implements IValidationSpecification<{
    email: string,
  }> {
    constructor(private readonly userRepository: IUserRepository) {}

    async isSatisfiedBy(value: {
      email: string,
    }): Promise<boolean> {
      if (!value.email) {
        return false;
      }

      const targetUser = await this.userRepository.findByEmail(value.email);
  
      return !targetUser;
    }
  }