import { Injectable } from '@nestjs/common';
import { Cedente } from 'src/domain/entities/cedente';
import { ICedenteRepository } from 'src/application/interfaces/repositories/cedente.repository.interface';
import { BaseUseCase } from 'src/application/interfaces/use-cases/base.use-case';
import { ValidationIdentifiers } from 'src/application/validations/constants/validation-identifiers';

export interface ICreateCedenteUseCaseCommand {
    nome: string,
    documento: string,
}
@Injectable()
export class CreateCedenteUseCase extends BaseUseCase<ICreateCedenteUseCaseCommand, Cedente> {

    constructor(
        private cedenteRepository: ICedenteRepository
    ) {
        super();
    }

    protected get validationId(): string {
        return ValidationIdentifiers.CEDENTE_CREATE;
    }

    async execute(command: ICreateCedenteUseCaseCommand): Promise<Cedente> {

        // VALIDATION
        await this.validate(command);

        // USECASE LOGIC
        const cedenteProps = {
            ...command,
        };

        const cedenteObj = Cedente.create(cedenteProps);
        const cedenteCreated = await this.cedenteRepository.create(cedenteObj);

        // RETURN
        return cedenteCreated;
    }
}
