import { Injectable } from '@nestjs/common';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
import { BaseUseCase } from 'src/application/interfaces/use-cases/base.use-case';
import { ErrorMessages } from 'src/application/validations/constants/error.messages';
import { ValidationIdentifiers } from 'src/application/validations/constants/validation-identifiers';

export interface IDeleteCarteiraUseCaseCommand {
    id: string,
}

@Injectable()
export class DeleteCarteiraUseCase extends BaseUseCase<IDeleteCarteiraUseCaseCommand, void> {

    constructor(
        private readonly carteiraRepository: ICarteiraRepository,
    ) {
        super();
    }

    protected get validationId(): string {
        return ValidationIdentifiers.CARTEIRA_DELETE;
    }

    async execute(command: IDeleteCarteiraUseCaseCommand): Promise<void> {
        const carteira = await this.carteiraRepository.findById(command.id);
        if (!carteira) {
            throw new Error(ErrorMessages.CARTEIRA_NAO_EXISTE);
        }

        // VALIDATION
        await this.validate(command);

        // USECASE LOGIC
        await this.carteiraRepository.delete(command.id);
    }
}