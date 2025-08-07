import { IValidationSpecification } from "src/application/interfaces/common/validation-specification.interface";
import { IUserRepository } from "src/application/interfaces/repositories/user.repository.interface";

export class UserMasterNaoPodeSerExcluidoSpecification implements IValidationSpecification<{
    id: string,
  }> {
    constructor(
        private readonly userRepository: IUserRepository,
    ) {}
    
    async isSatisfiedBy(value: {
      id: string,
    }): Promise<boolean> {
      const targetUser = await this.userRepository.findById(value.id);
      if (!targetUser) {
        return false;
      }

      if (targetUser.isMaster()) {
        return false;
      }

      return true;
    }
  }