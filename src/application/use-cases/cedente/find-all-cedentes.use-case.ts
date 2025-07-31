import { Injectable } from '@nestjs/common';
import { ICedenteRepository } from 'src/application/interfaces/repositories/cedente.repository.interface';
import { Cedente } from 'src/domain/entities/cedente';
import { PaginationOptions, PaginatedResult } from 'src/application/interfaces/common/pagination.interface';

interface FindAllCedentesUseCaseCommand {
    page?: number;
    limit?: number;
}

@Injectable()
export class FindAllCedentesUseCase {

    constructor(
        private readonly cedenteRepository: ICedenteRepository,
    ) {}

    async execute({ page, limit }: FindAllCedentesUseCaseCommand): Promise<PaginatedResult<Cedente>> {
        const paginationOptions: PaginationOptions = {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined
        };
        
        const cedentes = await this.cedenteRepository.findAll(paginationOptions);
        return cedentes;
    }
}