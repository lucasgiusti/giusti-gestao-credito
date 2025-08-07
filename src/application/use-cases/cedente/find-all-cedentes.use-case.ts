import { Injectable } from '@nestjs/common';
import { ICedenteRepository } from 'src/application/interfaces/repositories/cedente.repository.interface';
import { Cedente } from 'src/domain/entities/cedente';
import { IPaginationOptions, IPaginatedResult } from 'src/application/interfaces/common/pagination.interface';

export interface IFindAllCedentesUseCaseCommand {
    page?: number;
    limit?: number;
}

@Injectable()
export class FindAllCedentesUseCase {

    constructor(
        private readonly cedenteRepository: ICedenteRepository,
    ) {}

    async execute(command: IFindAllCedentesUseCaseCommand): Promise<IPaginatedResult<Cedente>> {
        const paginationOptions: IPaginationOptions = {
            page: command.page ? Number(command.page) : undefined,
            limit: command.limit ? Number(command.limit) : undefined
        };
        
        const cedentes = await this.cedenteRepository.findAll(paginationOptions);
        return cedentes;
    }
}