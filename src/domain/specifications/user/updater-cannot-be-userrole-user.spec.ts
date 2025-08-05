import { IValidationSpec } from "src/application/interfaces/common/validation-spec.interface";
import { User, UserRole } from "src/domain/entities/user";
export class UpdaterCannotBeUserroleUserSpec implements IValidationSpec<{
    updater: User,
  }> {
    isSatisfiedBy(value: {
      updater: User,
    }): boolean {
      if (!value.updater) {
        return false;
      }
  
      return value.updater.userRole !== UserRole.USER;
    }
}