import { Injectable } from '@nestjs/common';
import { Carteira } from 'src/domain/entities/carteira';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
import { MultiStageValidationRegistry } from 'src/application/validations/registry/multi-stage.registry';

interface UpdateCarteiraUseCaseCommand {
    id: string,
    nome: string,
    codigo: string,
}

@Injectable()
export class UpdateCarteiraUseCase {

    constructor(
        private readonly carteiraRepository: ICarteiraRepository,
    ) {}

    async execute({
        id,
        nome,
        codigo,
    }: UpdateCarteiraUseCaseCommand): Promise<Carteira> {
        const carteira = await this.carteiraRepository.findById(id);

        // VALIDATION
        await this.validate(carteira);

        // USECASE LOGIC
        carteira.update({ nome, codigo });
        const carteiraUpdated = await this.carteiraRepository.update(id, carteira);
        
        return carteiraUpdated;
    }

    private async validate(carteira: Carteira): Promise<void> {
        const validate = await MultiStageValidationRegistry.validate(
            UpdateCarteiraUseCase.name,
            `${UpdateCarteiraUseCase.name}_rules`,
            { 
                carteira,
            }
        );
        if (validate.isFailure) {
            throw new Error(validate.error);
        }
    }
}