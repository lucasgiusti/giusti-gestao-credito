import { IValidationSpecification } from "src/application/interfaces/common/validation-specification.interface";
import { ICarteiraRepository } from "src/application/interfaces/repositories/carteira.repository.interface";
export class CarteiraDeveExistirSpecification implements IValidationSpecification<{
    id: string,
  }> {
    constructor(private readonly carteiraRepository: ICarteiraRepository) {}

    async isSatisfiedBy(value: {
      id: string,
    }): Promise<boolean> {
      const carteira = await this.carteiraRepository.findById(value.id);
      return !!carteira;
    }
  }