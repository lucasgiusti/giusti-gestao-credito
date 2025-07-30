import { Injectable } from '@nestjs/common';
import { Carteira } from 'src/domain/entities/carteira';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';

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
        if (!carteira) {
            throw new Error('invalid.carteira.not.found');
        }

        carteira.update({ nome, codigo });

        const carteiraUpdated = await this.carteiraRepository.update(id, carteira);
        
        return carteiraUpdated;
    }
}