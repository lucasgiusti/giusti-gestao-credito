import { IValidationSpec } from "src/application/interfaces/common/validation-spec.interface";
import { IProcessoRepository } from "src/application/interfaces/repositories/processo.repository.interface";

export class CarteiraCannotHaveProcessesSpec implements IValidationSpec<{
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