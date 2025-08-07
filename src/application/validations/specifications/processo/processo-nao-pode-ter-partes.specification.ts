import { IValidationSpecification } from "src/application/interfaces/common/validation-specification.interface";
import { IParteProcessoRepository } from "src/application/interfaces/repositories/parte-processo.repository.interface";

export class ProcessoNaoDeveTerPartesSpecification implements IValidationSpecification<{
    id: string,
  }> {
    constructor(private readonly parteProcessoRepository: IParteProcessoRepository) {}

    async isSatisfiedBy(value: {
      id: string,
    }): Promise<boolean> {
      if (!value.id) {
        return false;
      } 

      const existsPartes = await this.parteProcessoRepository.existsByProcessoId(value.id);
  
      return !existsPartes;
    }
  }