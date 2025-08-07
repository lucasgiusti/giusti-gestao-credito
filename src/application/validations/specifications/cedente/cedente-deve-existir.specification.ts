import { IValidationSpecification } from "src/application/interfaces/common/validation-specification.interface";
import { ICedenteRepository } from "src/application/interfaces/repositories/cedente.repository.interface";

export class CedenteDeveExistirSpecification implements IValidationSpecification<{
    id: string,
}> {
  constructor(private readonly cedenteRepository: ICedenteRepository) {}

  async isSatisfiedBy(value: {
    id: string,
  }): Promise<boolean> {
    const targetCedente = await this.cedenteRepository.findById(value.id);

    return !!targetCedente;
  }
}