import { Injectable } from '@nestjs/common';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
import { Carteira } from 'src/domain/entities/carteira';

interface FindAllCarteirasUseCaseCommand {}

@Injectable()
export class FindAllCarteirasUseCase {

    constructor(
        private readonly carteiraRepository: ICarteiraRepository,
    ) {}

    async execute({}: FindAllCarteirasUseCaseCommand): Promise<Carteira[]> {
        const carteiras = await this.carteiraRepository.findAll();
        return carteiras;
    }
}