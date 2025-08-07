import { IValidationSpecification } from "src/application/interfaces/common/validation-specification.interface";
import { IParteProcessoRepository } from "src/application/interfaces/repositories/parte-processo.repository.interface";

export class CedenteNaoPodeTerPartesSpecification implements IValidationSpecification<{
    id: string,
  }> {
    constructor(private readonly parteProcessoRepository: IParteProcessoRepository) {}

    async isSatisfiedBy(value: {
      id: string,
    }): Promise<boolean> {
      if (!value.id) {
        return false;
      } 

      const existsPartes = await this.parteProcessoRepository.existsByCedenteId(value.id);
  
      return !existsPartes;
    }
  }