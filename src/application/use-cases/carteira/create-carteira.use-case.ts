import { Injectable } from '@nestjs/common';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
import { BaseUseCase } from 'src/application/interfaces/use-cases/base.use-case';
import { ValidationIdentifiers } from 'src/application/validations/constants/validation-identifiers';
import { Carteira } from 'src/domain/entities/carteira';

export interface ICreateCarteiraUseCaseCommand {
    nome: string,
    codigo: string,
}
@Injectable()
export class CreateCarteiraUseCase extends BaseUseCase<ICreateCarteiraUseCaseCommand, Carteira> {

    constructor(
        private readonly carteiraRepository: ICarteiraRepository,
    ) {
        super();
    }

    protected get validationId(): string {
        return ValidationIdentifiers.CARTEIRA_CREATE;
    }

    async execute(command: ICreateCarteiraUseCaseCommand): Promise<Carteira> {
        // VALIDATION
        await this.validate(command);

        // USECASE LOGIC
        const carteiraProps = {
            ...command,
        };

        const carteiraObj = Carteira.create(carteiraProps);
        const carteiraCreated = await this.carteiraRepository.create(carteiraObj);

        // RETURN
        return carteiraCreated;
    }
}