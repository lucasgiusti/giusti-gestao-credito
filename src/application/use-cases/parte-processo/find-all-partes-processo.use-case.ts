import { Injectable } from '@nestjs/common';
import { ParteProcesso } from 'src/domain/entities/parte-processo';
import { IParteProcessoRepository } from 'src/application/interfaces/repositories/parte-processo.repository.interface';
import { IPaginationOptions, IPaginatedResult } from 'src/application/interfaces/common/pagination.interface';

export interface IFindAllPartesProcessoUseCaseCommand {
    page?: number;
    limit?: number;
}

@Injectable()
export class FindAllPartesProcessoUseCase {

    constructor(
        private parteProcessoRepository: IParteProcessoRepository,
    ) {}

    async execute(command: IFindAllPartesProcessoUseCaseCommand): Promise<IPaginatedResult<ParteProcesso>> {
        const paginationOptions: IPaginationOptions = {
            page: command.page ? Number(command.page) : undefined,
            limit: command.limit ? Number(command.limit) : undefined
        };
        
        const partesProcesso = await this.parteProcessoRepository.findAll(paginationOptions);
        return partesProcesso;
    }
}
