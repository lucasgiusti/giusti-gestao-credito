import { Injectable } from '@nestjs/common';
import { ParteProcesso } from 'src/domain/entities/parte-processo';
import { IParteProcessoRepository } from 'src/application/interfaces/repositories/parte-processo.repository.interface';
import { IPaginationOptions, IPaginatedResult } from 'src/application/interfaces/common/pagination.interface';

export interface IFindPartesByProcessoIdUseCaseCommand {
    processoId: string;
    page?: number;
    limit?: number;
}

@Injectable()
export class FindPartesByProcessoIdUseCase {

    constructor(
        private parteProcessoRepository: IParteProcessoRepository
    ) {}

    async execute(command: IFindPartesByProcessoIdUseCaseCommand): Promise<IPaginatedResult<ParteProcesso>> {
        const paginationOptions: IPaginationOptions = {
            page: command.page ? Number(command.page) : undefined,
            limit: command.limit ? Number(command.limit) : undefined
        };

        return await this.parteProcessoRepository.findByProcessoId(command.processoId, paginationOptions);
    }
}
