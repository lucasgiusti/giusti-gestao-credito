import { IValidationSpecification } from "src/application/interfaces/common/validation-specification.interface";
import { User, UserRole, UserStatus } from "src/domain/entities/user";
import { IUserRepository } from "src/application/interfaces/repositories/user.repository.interface";

export class UserMasterNaoPodeSerAlteradoSpecification implements IValidationSpecification<{
    id: string,
    userRole?: UserRole,
    status?: UserStatus,
  }> {
    constructor(
        private readonly userRepository: IUserRepository,
    ) {}
    
    async isSatisfiedBy(value: {
      id: string,
      userRole?: UserRole,
      status?: UserStatus,
    }): Promise<boolean> {
      const targetUser = await this.userRepository.findById(value.id);
      if (!targetUser) {
        return false;
      }

      if (targetUser.isMaster() && ((value.status !== undefined && value.status !== UserStatus.ACTIVE) || (value.userRole !== undefined && value.userRole !== UserRole.MASTER))) {
        return false;
      }

      return true;
    }
  }