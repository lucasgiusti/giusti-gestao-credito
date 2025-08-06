import { Injectable } from '@nestjs/common';
import { Carteira } from 'src/domain/entities/carteira';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
import { UpdateCarteiraCommand } from './carteira.command';

@Injectable()
export class UpdateCarteiraUseCase {

    constructor(
        private readonly carteiraRepository: ICarteiraRepository,
    ) {}

    async execute(command: UpdateCarteiraCommand): Promise<Carteira> {
        const carteira = await this.carteiraRepository.findById(command.id);
        if (!carteira) {
            throw new Error('notfound.carteira');
        }

        // USECASE LOGIC
        carteira.update(command);
        const carteiraUpdated = await this.carteiraRepository.update(command.id, carteira);
        
        return carteiraUpdated;
    }
}