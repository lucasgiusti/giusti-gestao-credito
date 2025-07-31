import { Injectable } from '@nestjs/common';
import { ParteProcesso } from 'src/domain/entities/parte-processo';
import { IParteProcessoRepository } from 'src/application/interfaces/repositories/parte-processo.repository.interface';
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';
import { PaginationOptions, PaginatedResult } from 'src/application/interfaces/common/pagination.interface';

interface FindPartesByProcessoIdUseCaseCommand {
    processoId: string;
    page?: number;
    limit?: number;
}
@Injectable()
export class FindPartesByProcessoIdUseCase {

    constructor(
        private parteProcessoRepository: IParteProcessoRepository,
        private processoRepository: IProcessoRepository
    ) {}

    async execute({
        processoId,
        page,
        limit
    }: FindPartesByProcessoIdUseCaseCommand): Promise<PaginatedResult<ParteProcesso>> {
        const paginationOptions: PaginationOptions = {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined
        };
        const processo = await this.processoRepository.findById(processoId);
        if (!processo) {
            throw new Error('notfound.processo');
        }

        return await this.parteProcessoRepository.findByProcessoId(processoId, paginationOptions);
    }
}
