import { Injectable } from '@nestjs/common';
import { ParteProcesso } from 'src/domain/entities/parte-processo';
import { IParteProcessoRepository } from 'src/application/interfaces/repositories/parte-processo.repository.interface';
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';

@Injectable()
export class FindPartesByProcessoIdUseCase {

    constructor(
        private parteProcessoRepository: IParteProcessoRepository,
        private processoRepository: IProcessoRepository
    ) {}

    async execute(processoId: string): Promise<ParteProcesso[]> {
        const processo = await this.processoRepository.findById(processoId);
        if (!processo) {
            throw new Error('notfound.processo');
        }

        return await this.parteProcessoRepository.findByProcessoId(processoId);
    }
}
