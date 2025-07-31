import { Injectable } from '@nestjs/common';
import { Processo } from 'src/domain/entities/processo';
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';
import { PaginationOptions, PaginatedResult } from 'src/application/interfaces/common/pagination.interface';

interface FindAllProcessosUseCaseCommand {
    page?: number;
    limit?: number;
}
@Injectable()
export class FindAllProcessosUseCase {

    constructor(
        private processoRepository: IProcessoRepository
    ) {}

    async execute({ page, limit }: FindAllProcessosUseCaseCommand): Promise<PaginatedResult<Processo>> {
        const paginationOptions: PaginationOptions = {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined
        };
        
        const processos = await this.processoRepository.findAll(paginationOptions);
        return processos;
    }
}
