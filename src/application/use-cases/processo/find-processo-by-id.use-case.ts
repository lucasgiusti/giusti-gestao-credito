import { Injectable } from '@nestjs/common';
import { Processo } from 'src/domain/entities/processo';
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';
import { ErrorMessages } from 'src/application/validations/constants/error.messages';

export interface IFindProcessoByIdUseCaseCommand {
    id: string;
}

@Injectable()
export class FindProcessoByIdUseCase {

    constructor(
        private processoRepository: IProcessoRepository
    ) {}

    async execute(command: IFindProcessoByIdUseCaseCommand): Promise<Processo> {
        const processo = await this.processoRepository.findById(command.id);
        
        if (!processo) {
            throw new Error(ErrorMessages.PROCESSO_NAO_EXISTE);
        }

        return processo;
    }
}
