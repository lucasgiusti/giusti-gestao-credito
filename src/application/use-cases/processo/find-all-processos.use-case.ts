import { Injectable } from '@nestjs/common';
import { Processo } from 'src/domain/entities/processo';
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';

interface FindAllProcessosUseCaseCommand {
    
}
@Injectable()
export class FindAllProcessosUseCase {

    constructor(
        private processoRepository: IProcessoRepository
    ) {}

    async execute({}: FindAllProcessosUseCaseCommand): Promise<Processo[]> {
        return await this.processoRepository.findAll();
    }
}
