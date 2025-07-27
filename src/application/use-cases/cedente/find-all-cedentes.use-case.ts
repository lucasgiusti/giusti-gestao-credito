import { Injectable } from '@nestjs/common';
import { ICedenteRepository } from 'src/application/interfaces/repositories/cedente.repository.interface';
import { Cedente } from 'src/domain/entities/cedente';

interface FindAllCedentesUseCaseCommand {}

@Injectable()
export class FindAllCedentesUseCase {

    constructor(
        private readonly cedenteRepository: ICedenteRepository,
    ) {}

    async execute({}: FindAllCedentesUseCaseCommand): Promise<Cedente[]> {
        const cedentes = await this.cedenteRepository.findAll();
        return cedentes;
    }
}