import { IValidationSpecification } from "src/application/interfaces/common/validation-specification.interface";
import { IParteProcessoRepository } from "src/application/interfaces/repositories/parte-processo.repository.interface";

export class ParteProcessoNaoPodeExistirSpecification implements IValidationSpecification<{
    id?: string,
    processoId: string,
    cedenteId: string,
}> {
  constructor(private readonly parteProcessoRepository: IParteProcessoRepository) {}

  async isSatisfiedBy(value: {
    id?: string,
    processoId: string,
    cedenteId: string,
  }): Promise<boolean> {
    if (!value.processoId || !value.cedenteId) {
      return false;
    }

    const targetParteProcesso = await this.parteProcessoRepository.findByProcessoIdAndCedenteId(value.processoId, value.cedenteId);

    return !targetParteProcesso || targetParteProcesso.id === value.id;
  }
}