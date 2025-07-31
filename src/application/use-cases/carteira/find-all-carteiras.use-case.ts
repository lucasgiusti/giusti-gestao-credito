import { Injectable } from '@nestjs/common';
import { PaginatedResult, PaginationOptions } from 'src/application/interfaces/common/pagination.interface';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
import { Carteira } from 'src/domain/entities/carteira';

interface FindAllCarteirasUseCaseCommand {
    page?: number;
    limit?: number;
}

@Injectable()
export class FindAllCarteirasUseCase {

    constructor(
        private readonly carteiraRepository: ICarteiraRepository,
    ) {}

    async execute({ page, limit }: FindAllCarteirasUseCaseCommand): Promise<PaginatedResult<Carteira>> {
        const paginationOptions: PaginationOptions = {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined
        };
        
        const carteiras = await this.carteiraRepository.findAll(paginationOptions);
        return carteiras;
    }
}