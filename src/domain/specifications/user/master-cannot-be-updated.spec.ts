import { IValidationSpec } from "src/application/interfaces/common/validation-spec.interface";
import { User, UserRole, UserStatus } from "src/domain/entities/user";

export class MasterCannotBeUpdatedSpec implements IValidationSpec<{
    targetUser: User,
    userRole?: UserRole,
    status?: UserStatus,
  }> {
    isSatisfiedBy(value: {
      targetUser: User,
      userRole?: UserRole,
      status?: UserStatus,
    }): boolean {

      if (value.targetUser.isMaster() && ((value.status !== undefined && value.status !== UserStatus.ACTIVE) || (value.userRole !== undefined && value.userRole !== UserRole.MASTER))) {
        return false;
      }

      return true;
    }
  }