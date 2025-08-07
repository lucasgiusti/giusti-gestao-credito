import { Injectable } from '@nestjs/common';
import { ICedenteRepository } from 'src/application/interfaces/repositories/cedente.repository.interface';
import { BaseUseCase } from 'src/application/interfaces/use-cases/base.use-case';
import { ValidationIdentifiers } from 'src/application/validations/constants/validation-identifiers';

export interface IDeleteCedenteUseCaseCommand {
    id: string,
}

@Injectable()
export class DeleteCedenteUseCase extends BaseUseCase<IDeleteCedenteUseCaseCommand, void> {

    constructor(
        private readonly cedenteRepository: ICedenteRepository,
    ) {
        super();
    }

    protected get validationId(): string {
        return ValidationIdentifiers.CEDENTE_DELETE;
    }

    async execute(command: IDeleteCedenteUseCaseCommand): Promise<void> {
        const cedente = await this.cedenteRepository.findById(command.id);
        if (!cedente) {
            throw new Error('notfound.cedente');
        }

        // VALIDATION
        await this.validate(command);

        // USECASE LOGIC
        await this.cedenteRepository.delete(command.id);
    }
}