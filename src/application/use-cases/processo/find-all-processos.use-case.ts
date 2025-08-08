import { Injectable } from '@nestjs/common';
import { Processo } from 'src/domain/entities/processo';
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';
import { IPaginationOptions, IPaginatedResult } from 'src/application/interfaces/common/pagination.interface';import { StructuredLoggerService } from 'src/infraestructure/logging/structured-logger.service';

export interface IFindAllProcessosUseCaseCommand {
    page?: number;
    limit?: number;
}

@Injectable()
export class FindAllProcessosUseCase {

    constructor(
        private processoRepository: IProcessoRepository,
    ) {
    }

    async execute(command: IFindAllProcessosUseCaseCommand): Promise<IPaginatedResult<Processo>> {
        const paginationOptions: IPaginationOptions = {
            page: command.page ? Number(command.page) : undefined,
            limit: command.limit ? Number(command.limit) : undefined
        };
        
        const processos = await this.processoRepository.findAll(paginationOptions);

        return processos;
    }
}
