import { ICarteiraRepository } from "src/application/interfaces/repositories/carteira.repository.interface";
import { IValidationSpec } from "src/application/interfaces/common/validation-spec.interface";

export class CarteiraMustExistSpec implements IValidationSpec<{
    id: string,
  }> {
    constructor(private readonly carteiraRepository: ICarteiraRepository) {}

    async isSatisfiedBy(value: {
      id: string,
    }): Promise<boolean> {
      if (!value.id) {
        return false;
      }

      const carteira = await this.carteiraRepository.findById(value.id);

      return !!carteira;
    }
  }