import { Injectable } from '@nestjs/common';
import { IPaginatedResult, IPaginationOptions } from 'src/application/interfaces/common/pagination.interface';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
import { Carteira } from 'src/domain/entities/carteira';

export interface IFindAllCarteirasUseCaseCommand {
    page?: number;
    limit?: number;
}

@Injectable()
export class FindAllCarteirasUseCase {

    constructor(
        private readonly carteiraRepository: ICarteiraRepository,
    ) {}

    async execute(command: IFindAllCarteirasUseCaseCommand): Promise<IPaginatedResult<Carteira>> {
        const paginationOptions: IPaginationOptions = {
            page: command.page ? Number(command.page) : undefined,
            limit: command.limit ? Number(command.limit) : undefined
        };
        
        const carteiras = await this.carteiraRepository.findAll(paginationOptions);
        return carteiras;
    }
}