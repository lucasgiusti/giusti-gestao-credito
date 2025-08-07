import { IValidationSpecification } from "src/application/interfaces/common/validation-specification.interface";
import { IUserRepository } from "src/application/interfaces/repositories/user.repository.interface";
import { UserRole } from "src/domain/entities/user";

export class UserUpdaterNaoPodeSerUserSpecification implements IValidationSpecification<{
    authServiceUserId: string,
  }> {
    constructor(
        private readonly userRepository: IUserRepository,
    ) {}
    
    async isSatisfiedBy(value: {
      authServiceUserId: string,
    }): Promise<boolean> {
      const updater = await this.userRepository.findByAuthServiceUserId(value.authServiceUserId);
      if (!updater) {
        return false;
      }
  
      return updater.userRole !== UserRole.USER;
    }
}