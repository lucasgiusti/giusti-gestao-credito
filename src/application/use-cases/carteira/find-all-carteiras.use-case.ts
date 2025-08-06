import { Injectable } from '@nestjs/common';
import { PaginatedResult, PaginationOptions } from 'src/application/interfaces/common/pagination.interface';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
import { Carteira } from 'src/domain/entities/carteira';
import { FindAllCarteirasCommand } from './carteira.command';

@Injectable()
export class FindAllCarteirasUseCase {

    constructor(
        private readonly carteiraRepository: ICarteiraRepository,
    ) {}

    async execute(command: FindAllCarteirasCommand): Promise<PaginatedResult<Carteira>> {
        const paginationOptions: PaginationOptions = {
            page: command.page ? Number(command.page) : undefined,
            limit: command.limit ? Number(command.limit) : undefined
        };
        
        const carteiras = await this.carteiraRepository.findAll(paginationOptions);
        return carteiras;
    }
}