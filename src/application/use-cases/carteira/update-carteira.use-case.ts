import { Injectable } from '@nestjs/common';
import { Carteira } from 'src/domain/entities/carteira';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
import { BaseUseCase } from 'src/application/interfaces/use-cases/base.use-case';
import { ErrorMessages } from 'src/application/validations/constants/error.messages';
import { ValidationIdentifiers } from 'src/application/validations/constants/validation-identifiers';

export interface IUpdateCarteiraUseCaseCommand {
    id: string,
    nome: string,
    codigo: string,
}

@Injectable()
export class UpdateCarteiraUseCase extends BaseUseCase<IUpdateCarteiraUseCaseCommand, Carteira> {

    constructor(
        private readonly carteiraRepository: ICarteiraRepository,
    ) {
        super();
    }

    protected get validationId(): string {
        return ValidationIdentifiers.CARTEIRA_UPDATE;
    }

    async execute(command: IUpdateCarteiraUseCaseCommand): Promise<Carteira> {
        const carteira = await this.carteiraRepository.findById(command.id);
        if (!carteira) {
            throw new Error(ErrorMessages.CARTEIRA_NAO_EXISTE);
        }

        // VALIDATION
        await this.validate(command);

        // USECASE LOGIC
        const carteiraProps = {
            ...command,
        };
        
        const carteiraObj = carteira.update(carteiraProps);
        const carteiraUpdated = await this.carteiraRepository.update(command.id, carteiraObj);
        
        return carteiraUpdated;
    }
}