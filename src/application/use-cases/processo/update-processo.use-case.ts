import { Injectable } from '@nestjs/common';
import { Processo, TipoProcesso } from 'src/domain/entities/processo';
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';
import { BaseUseCase } from 'src/application/interfaces/use-cases/base.use-case';
import { ValidationIdentifiers } from 'src/application/validations/constants/validation-identifiers';

export interface IUpdateProcessoUseCaseCommand {
    id: string;
    numero: string;
    carteiraId: string;
    valorPedido: number;
    valorHomologado: number;
    tipo: TipoProcesso;
}

@Injectable()
export class UpdateProcessoUseCase extends BaseUseCase<IUpdateProcessoUseCaseCommand, Processo> {

    constructor(
        private processoRepository: IProcessoRepository,
    ) {
        super();
    }

    protected get validationId(): string {
        return ValidationIdentifiers.PROCESSO_UPDATE;
    }

    async execute(command: IUpdateProcessoUseCaseCommand): Promise<Processo> {
        const processo = await this.processoRepository.findById(command.id);
        if (!processo) {
            throw new Error('notfound.processo');
        }

        // VALIDATION
        await this.validate(command);

        const processoProps = {
            ...command,
        };

        const processoObj = processo.update(processoProps);

        const processoUpdated = await this.processoRepository.update(command.id, processoObj);

        // RETURN
        return processoUpdated;
    }
}
