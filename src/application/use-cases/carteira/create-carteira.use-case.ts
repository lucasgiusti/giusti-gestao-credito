import { Injectable } from '@nestjs/common';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
import { MultiStageValidationRegistry } from 'src/application/validations/registry/multi-stage.registry';
import { Carteira } from 'src/domain/entities/carteira';

interface CreateCarteiraUseCaseCommand {
    nome: string,
    codigo: string,
}

@Injectable()
export class CreateCarteiraUseCase {

    constructor(
        private readonly carteiraRepository: ICarteiraRepository,
    ) {}

    async execute({
        nome,
        codigo,
    }: CreateCarteiraUseCaseCommand): Promise<Carteira> {
        // VALIDATION
        await this.validate(codigo);

        // USECASE LOGIC
        const carteira = Carteira.create({
            nome,
            codigo,
        });

        const carteiraCreated = await this.carteiraRepository.create(carteira);
        return carteiraCreated;
    }

    private async validate(codigo: string): Promise<void> {
        const validate = await MultiStageValidationRegistry.validate(
            CreateCarteiraUseCase.name,
            `${CreateCarteiraUseCase.name}_rules`,
            { 
                codigo,
            }
        );
        if (validate.isFailure) {
            throw new Error(validate.error);
        }
    }
}