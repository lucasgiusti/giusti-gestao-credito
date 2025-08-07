import { IValidationSpecification } from "src/application/interfaces/common/validation-specification.interface";
import { IProcessoRepository } from "src/application/interfaces/repositories/processo.repository.interface";

export class CarteiraNaoPodeTerProcessosSpecification implements IValidationSpecification<{
    id: string,
  }> {
    constructor(private readonly processoRepository: IProcessoRepository) {}

    async isSatisfiedBy(value: {
      id: string,
    }): Promise<boolean> {
      if (!value.id) {
        return false;
      } 

      const existsProcessos = await this.processoRepository.existsByCarteiraId(value.id);
  
      return !existsProcessos;
    }
  }