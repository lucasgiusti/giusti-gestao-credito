import { Injectable, ConflictException } from '@nestjs/common';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
import { Carteira } from 'src/domain/entities/carteira';

interface CreateCarteiraUseCaseCommand {
    name: string,
}

@Injectable()
export class CreateCarteiraUseCase {

    constructor(
        private readonly carteiraRepository: ICarteiraRepository,
    ) {}

    async execute({
        name,
    }: CreateCarteiraUseCaseCommand): Promise<Carteira> {
        const carteira = new Carteira({
            name,
        });

        const response = await this.carteiraRepository.create(carteira);
        return response;
    }
}