import { Injectable } from '@nestjs/common';
import { Processo } from 'src/domain/entities/processo';
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';

interface FindProcessoByIdUseCaseCommand {
    id: string;
}
@Injectable()
export class FindProcessoByIdUseCase {

    constructor(
        private processoRepository: IProcessoRepository
    ) {}

    async execute({
        id
    }: FindProcessoByIdUseCaseCommand): Promise<Processo> {
        const processo = await this.processoRepository.findById(id);
        
        if (!processo) {
            throw new Error('notfound.processo');
        }

        return processo;
    }
}
