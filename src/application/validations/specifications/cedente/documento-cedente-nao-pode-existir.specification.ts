import { IValidationSpecification } from "src/application/interfaces/common/validation-specification.interface";
import { ICedenteRepository } from "src/application/interfaces/repositories/cedente.repository.interface";

export class DocumentoCedenteNaoPodeExistirSpecification implements IValidationSpecification<{
    id?: string,
    documento: string,
}> {
  constructor(private readonly cedenteRepository: ICedenteRepository) {}

  async isSatisfiedBy(value: {
    id?: string,
    documento: string,
  }): Promise<boolean> {
    if (!value.documento) {
      return false;
    }

    const targetCedente = await this.cedenteRepository.findByDocumento(value.documento);

    return !targetCedente || targetCedente.id === value.id;
  }
}