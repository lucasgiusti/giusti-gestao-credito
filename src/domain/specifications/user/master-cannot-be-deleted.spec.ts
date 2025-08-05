import { IValidationSpec } from "src/application/interfaces/common/validation-spec.interface";
import { User } from "src/domain/entities/user";

export class MasterCannotBeDeletedSpec implements IValidationSpec<{
    targetUser: User,
  }> {
    isSatisfiedBy(value: {
      targetUser: User,
    }): boolean {

      if (value.targetUser.isMaster()) {
        return false;
      }

      return true;
    }
  }