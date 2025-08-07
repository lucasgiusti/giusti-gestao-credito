import { Injectable } from '@nestjs/common';
import { ParteProcesso } from 'src/domain/entities/parte-processo';
import { IParteProcessoRepository } from 'src/application/interfaces/repositories/parte-processo.repository.interface';
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';
import { BaseUseCase } from 'src/application/interfaces/use-cases/base.use-case';
import { ValidationIdentifiers } from 'src/application/validations/constants/validation-identifiers';

export interface IUpdateParteProcessoUseCaseCommand {
    id: string;
    processoId: string;
    cedenteId: string;
    percentual: number;
}

@Injectable()
export class UpdateParteProcessoUseCase extends BaseUseCase<IUpdateParteProcessoUseCaseCommand, ParteProcesso> {

    constructor(
        private parteProcessoRepository: IParteProcessoRepository,
        private processoRepository: IProcessoRepository
    ) {
        super();
    }

    protected get validationId(): string {
        return ValidationIdentifiers.PARTE_PROCESSO_UPDATE;
    }

    async execute(command: IUpdateParteProcessoUseCaseCommand): Promise<ParteProcesso> {
        const processo = await this.processoRepository.findById(command.processoId);
        if (!processo) {
            throw new Error('notfound.processo');
        }

        // VALIDATION
        await this.validate(command);

        const parteProcessoProps = {
            ...command,
        };

        const parteProcessoObj = processo.updateParteProcesso(parteProcessoProps);
        
        const parteProcessoUpdated = await this.parteProcessoRepository.update(command.id, parteProcessoObj);

        // RETURN
        return parteProcessoUpdated;
    }
}
