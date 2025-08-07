import { IValidationSpecification } from "src/application/interfaces/common/validation-specification.interface";
import { IParteProcessoRepository } from "src/application/interfaces/repositories/parte-processo.repository.interface";

export class ParteProcessoDeveExistirSpecification implements IValidationSpecification<{
    id: string,
    processoId: string,
}> {
  constructor(private readonly parteProcessoRepository: IParteProcessoRepository) {}

  async isSatisfiedBy(value: {
    id: string,
    processoId: string,
  }): Promise<boolean> {
    const targetParteProcesso = await this.parteProcessoRepository.findByIdAndProcessoId(value.id, value.processoId);

    return !!targetParteProcesso;
  }
}