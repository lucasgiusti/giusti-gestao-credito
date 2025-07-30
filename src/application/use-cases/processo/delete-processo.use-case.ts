import { Injectable } from '@nestjs/common';
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';
import { IParteProcessoRepository } from 'src/application/interfaces/repositories/parte-processo.repository.interface';

interface DeleteProcessoUseCaseCommand {
    id: string;
}
@Injectable()
export class DeleteProcessoUseCase {

    constructor(
        private processoRepository: IProcessoRepository,
        private parteProcessoRepository: IParteProcessoRepository
    ) {}

    async execute({
        id
    }: DeleteProcessoUseCaseCommand): Promise<void> {
        const processo = await this.processoRepository.findById(id);
        if (!processo) {
            throw new Error('notfound.processo');
        }

        const existsPartes = await this.parteProcessoRepository.existsByProcessoId(id);

        processo.canBeDeleted(existsPartes);

        await this.processoRepository.delete(id);
    }
}
