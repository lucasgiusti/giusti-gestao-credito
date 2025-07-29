import { Injectable } from '@nestjs/common';
import { IParteProcessoRepository } from 'src/application/interfaces/repositories/parte-processo.repository.interface';
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';

interface DeleteParteProcessoUseCaseCommand {
    id: string;
}
@Injectable()
export class DeleteParteProcessoUseCase {

    constructor(
        private parteProcessoRepository: IParteProcessoRepository,
        private processoRepository: IProcessoRepository
    ) {}

    async execute({
        id
    }: DeleteParteProcessoUseCaseCommand): Promise<void> {
        const parteProcesso = await this.parteProcessoRepository.findById(id);
        if (!parteProcesso) {
            throw new Error('notfound.parteProcesso');
        }

        await this.parteProcessoRepository.delete(id);
    }
}
