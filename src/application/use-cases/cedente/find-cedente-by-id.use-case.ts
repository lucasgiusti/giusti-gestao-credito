import { Injectable } from '@nestjs/common';
import { ICedenteRepository } from 'src/application/interfaces/repositories/cedente.repository.interface';
import { Cedente } from 'src/domain/entities/cedente';

interface FindCedenteByIdUseCaseCommand {
    id: string;
}

@Injectable()
export class FindCedenteByIdUseCase {

    constructor(
        private readonly cedenteRepository: ICedenteRepository,
    ) {}

    async execute({id}: FindCedenteByIdUseCaseCommand): Promise<Cedente> {
        const cedente = await this.cedenteRepository.findById(id);

        if (!cedente) {
            throw new Error('invalid.cedente.not.found');
        }

        return cedente;
    }
}