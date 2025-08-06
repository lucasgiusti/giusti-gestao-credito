import { Injectable } from '@nestjs/common';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
import { MultiStageValidationRegistry } from 'src/application/validations/registry/multi-stage.registry';
import { Carteira } from 'src/domain/entities/carteira';

interface FindCarteiraByIdUseCaseCommand {
    id: string;
}

@Injectable()
export class FindCarteiraByIdUseCase {

    constructor(
        private readonly carteiraRepository: ICarteiraRepository,
    ) {}

    async execute({id}: FindCarteiraByIdUseCaseCommand): Promise<Carteira> {
        const carteira = await this.carteiraRepository.findById(id);

        // VALIDATION
        await this.validate(id);

        return carteira;
    }

    private async validate(id: string): Promise<void> {
        const validate = await MultiStageValidationRegistry.validate(
            FindCarteiraByIdUseCase.name,
            `${FindCarteiraByIdUseCase.name}_rules`,
            { 
                id,
            }
        );
        if (validate.isFailure) {
            throw new Error(validate.error);
        }
    }
}