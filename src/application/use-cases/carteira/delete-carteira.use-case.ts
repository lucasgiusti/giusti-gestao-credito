import { Injectable } from '@nestjs/common';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
import { MultiStageValidationRegistry } from 'src/application/validations/registry/multi-stage.registry';

interface DeleteCarteiraUseCaseCommand {
    id: string,
}

@Injectable()
export class DeleteCarteiraUseCase {

    constructor(
        private readonly carteiraRepository: ICarteiraRepository,
    ) {}

    async execute({
        id,
    }: DeleteCarteiraUseCaseCommand): Promise<void> {
        // VALIDATION
        await this.validate(id);

        // USECASE LOGIC
        await this.carteiraRepository.delete(id);
    }

    private async validate(id: string): Promise<void> {
        const validate = await MultiStageValidationRegistry.validate(
            DeleteCarteiraUseCase.name,
            `${DeleteCarteiraUseCase.name}_rules`,
            { 
                id,
            }
        );
        if (validate.isFailure) {
            throw new Error(validate.error);
        }
    }
}