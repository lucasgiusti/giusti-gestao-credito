import { IValidationSpecification } from "src/application/interfaces/common/validation-specification.interface";
import { IProcessoRepository } from "src/application/interfaces/repositories/processo.repository.interface";

export class ProcessoNaoPodeExistirSpecification implements IValidationSpecification<{
    id?: string,
    numero: string,
  }> {
    constructor(private readonly processoRepository: IProcessoRepository) {}

    async isSatisfiedBy(value: {
      id?: string,
      numero: string,
    }): Promise<boolean> {
      if (!value.numero) {
        return false;
      }

      const processo = await this.processoRepository.findByNumero(value.numero);
  
      return !processo || processo.id === value.id;
    }
  }