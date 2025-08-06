import { IValidationSpec } from "src/application/interfaces/common/validation-spec.interface";
import { ICarteiraRepository } from "src/application/interfaces/repositories/carteira.repository.interface";
export class CarteiraCodeCannotExistSpec implements IValidationSpec<{
    codigo: string,
  }> {
    constructor(private readonly carteiraRepository: ICarteiraRepository) {}

    async isSatisfiedBy(value: {
      codigo: string,
    }): Promise<boolean> {
      if (!value.codigo) {
        return false;
      }

      const carteira = await this.carteiraRepository.findByCodigo(value.codigo);
  
      return !carteira;
    }
  }