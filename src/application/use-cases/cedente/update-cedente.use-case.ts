import { Injectable } from '@nestjs/common';
import { Cedente } from 'src/domain/entities/cedente';
import { ICedenteRepository } from 'src/application/interfaces/repositories/cedente.repository.interface';

interface UpdateCedenteUseCaseCommand {
    id: number,
    nome: string,
    documento: string,
}

@Injectable()
export class UpdateCedenteUseCase {

    constructor(
        private cedenteRepository: ICedenteRepository
    ) {}

    async execute({
        id,
        nome,
        documento,
    }: UpdateCedenteUseCaseCommand): Promise<Cedente> {

        const cedente = await this.cedenteRepository.findById(id);
        if (!cedente) {
            throw new Error('invalid.cedente.not.found');
        }

        const cedenteExists = await this.cedenteRepository.findByDocumento(documento);

        cedente.update({nome, documento, cedenteExists});
        const cedenteUpdated = await this.cedenteRepository.update(id, cedente);

        return cedenteUpdated;
    }
}