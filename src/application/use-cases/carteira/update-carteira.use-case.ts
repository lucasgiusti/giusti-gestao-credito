import { Injectable, BadRequestException } from '@nestjs/common';
import { Carteira } from 'src/domain/entities/carteira';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';

interface UpdateCarteiraUseCaseCommand {
    id: number,
    nome: string,
}

@Injectable()
export class UpdateCarteiraUseCase {

    constructor(
        private readonly carteiraRepository: ICarteiraRepository,
    ) {}

    async execute({
        id,
        nome,
    }: UpdateCarteiraUseCaseCommand): Promise<Carteira> {
        const carteira = await this.carteiraRepository.findById(id);
        if (!carteira) {
            throw new BadRequestException('invalid.carteira.not.found');
        }

        carteira.update(nome);

        const carteiraUpdated = await this.carteiraRepository.update(id, carteira);
        
        return carteiraUpdated;
    }
}