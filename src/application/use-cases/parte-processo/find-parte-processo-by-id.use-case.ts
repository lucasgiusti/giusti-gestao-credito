import { Injectable } from '@nestjs/common';
import { ParteProcesso } from 'src/domain/entities/parte-processo';
import { IParteProcessoRepository } from 'src/application/interfaces/repositories/parte-processo.repository.interface';
import { ErrorMessages } from 'src/application/validations/constants/error.messages';

export interface IFindParteProcessoByIdUseCaseCommand {
    id: string;
    processoId: string;
}

@Injectable()
export class FindParteProcessoByIdUseCase {

    constructor(
        private parteProcessoRepository: IParteProcessoRepository
    ) {}

    async execute(command: IFindParteProcessoByIdUseCaseCommand): Promise<ParteProcesso> {
        const parteProcesso = await this.parteProcessoRepository.findByIdAndProcessoId(command.id, command.processoId);
        
        if (!parteProcesso) {
            throw new Error(ErrorMessages.PARTE_PROCESSO_NAO_EXISTE);
        }

        return parteProcesso;
    }
}
