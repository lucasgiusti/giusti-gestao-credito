import { Injectable, ConflictException } from '@nestjs/common';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
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
        const carteira = Carteira.create({
            nome,
            codigo,
        });

        const carteiraCreated = await this.carteiraRepository.create(carteira);
        return carteiraCreated;
    }
}