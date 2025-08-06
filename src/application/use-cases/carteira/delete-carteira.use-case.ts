import { Injectable } from '@nestjs/common';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
import { MultiStageValidationRegistry } from 'src/application/validations/registry/multi-stage.registry';
import { DeleteCarteiraCommand } from './carteira.command';

@Injectable()
export class DeleteCarteiraUseCase {

    constructor(
        private readonly carteiraRepository: ICarteiraRepository,
    ) {}

    async execute(command: DeleteCarteiraCommand): Promise<void> {
        const carteira = await this.carteiraRepository.findById(command.id);
        if (!carteira) {
            throw new Error('notfound.carteira');
        }

        // VALIDATION
        await this.validate(command);

        // USECASE LOGIC
        await this.carteiraRepository.delete(command.id);
    }

    private async validate(command: DeleteCarteiraCommand): Promise<void> {
        const validate = await MultiStageValidationRegistry.validate(
            DeleteCarteiraUseCase.name,
            `${DeleteCarteiraUseCase.name}_rules`,
            command
        );
        if (validate.isFailure) {
            throw new Error(validate.error);
        }
    }
}