import { IValidationSpecification } from "src/application/interfaces/common/validation-specification.interface";
import { ICarteiraRepository } from "src/application/interfaces/repositories/carteira.repository.interface";
export class CodigoCarteiraNaoPodeExistirSpecification implements IValidationSpecification<{
    id?: string,
    codigo: string,
  }> {
    constructor(private readonly carteiraRepository: ICarteiraRepository) {}

    async isSatisfiedBy(value: {
      id?: string,
      codigo: string,
    }): Promise<boolean> {
      if (!value.codigo) {
        return false;
      }

      const carteira = await this.carteiraRepository.findByCodigo(value.codigo);
  
      return !carteira || carteira.id === value.id;
    }
  }