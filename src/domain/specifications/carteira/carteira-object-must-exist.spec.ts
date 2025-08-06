import { Carteira } from "src/domain/entities/carteira";
import { IValidationSpec } from "src/application/interfaces/common/validation-spec.interface";
export class CarteiraObjectMustExistSpec implements IValidationSpec<{
    targetCarteira: Carteira,
  }> {
    constructor() {}

    isSatisfiedBy(value: {
      targetCarteira: Carteira,
    }): boolean {
      return !!value.targetCarteira;
    }
  }