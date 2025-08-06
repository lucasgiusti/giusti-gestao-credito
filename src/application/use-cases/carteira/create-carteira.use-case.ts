import { Injectable } from '@nestjs/common';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
import { MultiStageValidationRegistry } from 'src/application/validations/registry/multi-stage.registry';
import { Carteira } from 'src/domain/entities/carteira';
import { CreateCarteiraCommand } from './carteira.command';

@Injectable()
export class CreateCarteiraUseCase {

    constructor(
        private readonly carteiraRepository: ICarteiraRepository,
    ) {}

    async execute(command: CreateCarteiraCommand): Promise<Carteira> {
        // VALIDATION
        await this.validate(command);

        // USECASE LOGIC
        const carteira = Carteira.create(command);
        const carteiraCreated = await this.carteiraRepository.create(carteira);

        // RETURN
        return carteiraCreated;
    }

    private async validate(command: CreateCarteiraCommand): Promise<void> {
        const validate = await MultiStageValidationRegistry.validate(
            CreateCarteiraUseCase.name,
            `${CreateCarteiraUseCase.name}_rules`,
            command
        );
        if (validate.isFailure) {
            throw new Error(validate.error);
        }
    }
}