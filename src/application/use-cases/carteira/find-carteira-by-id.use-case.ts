import { Injectable } from '@nestjs/common';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
import { Carteira } from 'src/domain/entities/carteira';

interface FindCarteiraByIdUseCaseCommand {
    id: number;
}

@Injectable()
export class FindCarteiraByIdUseCase {

    constructor(
        private readonly carteiraRepository: ICarteiraRepository,
    ) {}

    async execute({id}: FindCarteiraByIdUseCaseCommand): Promise<Carteira> {
        const carteira = await this.carteiraRepository.findById(id);

        if (!carteira) {
            throw new Error('invalid.carteira.not.found');
        }

        return carteira;
    }
}