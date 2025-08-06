import { User } from "src/domain/entities/user";
import { IValidationSpec } from "src/application/interfaces/common/validation-spec.interface";
export class UserObjectMustExistSpec implements IValidationSpec<{
    targetUser: User,
  }> {
    constructor() {}

    isSatisfiedBy(value: {
      targetUser: User,
    }): boolean {
      return !!value.targetUser;
    }
  }