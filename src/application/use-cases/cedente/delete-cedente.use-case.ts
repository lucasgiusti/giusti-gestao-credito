import { Injectable } from '@nestjs/common';
import { ICedenteRepository } from 'src/application/interfaces/repositories/cedente.repository.interface';
import { IParteProcessoRepository } from 'src/application/interfaces/repositories/parte-processo.repository.interface';

interface DeleteCedenteUseCaseCommand {
    id: string,
}

@Injectable()
export class DeleteCedenteUseCase {

    constructor(
        private readonly cedenteRepository: ICedenteRepository,
        private readonly parteProcessoRepository: IParteProcessoRepository,
    ) {}

    async execute({
        id,
    }: DeleteCedenteUseCaseCommand): Promise<void> {
        const cedente = await this.cedenteRepository.findById(id);
        if (!cedente) {
            throw new Error('invalid.cedente.not.found');
        }

        const existsPartes = await this.parteProcessoRepository.existsByCedenteId(id);

        cedente.canBeDeleted(existsPartes);

        await this.cedenteRepository.delete(id);
    }
}