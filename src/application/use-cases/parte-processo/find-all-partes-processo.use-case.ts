import { Injectable } from '@nestjs/common';
import { ParteProcesso } from 'src/domain/entities/parte-processo';
import { IParteProcessoRepository } from 'src/application/interfaces/repositories/parte-processo.repository.interface';
import { PaginationOptions, PaginatedResult } from 'src/application/interfaces/common/pagination.interface';

interface FindAllPartesProcessoUseCaseCommand {
    page?: number;
    limit?: number;
}
@Injectable()
export class FindAllPartesProcessoUseCase {

    constructor(
        private parteProcessoRepository: IParteProcessoRepository,
    ) {}

    async execute({ page, limit }: FindAllPartesProcessoUseCaseCommand): Promise<PaginatedResult<ParteProcesso>> {
        const paginationOptions: PaginationOptions = {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined
        };
        
        const partesProcesso = await this.parteProcessoRepository.findAll(paginationOptions);
        return partesProcesso;
    }
}
