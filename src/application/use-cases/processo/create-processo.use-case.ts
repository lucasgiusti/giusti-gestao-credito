import { Injectable } from '@nestjs/common';
import { Processo, TipoProcesso } from 'src/domain/entities/processo';
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';
import { BaseUseCase } from 'src/application/interfaces/use-cases/base.use-case';
import { ValidationIdentifiers } from 'src/application/validations/constants/validation-identifiers';

export interface ICreateProcessoUseCaseCommand {
    numero: string;
    carteiraId: string;
    valorPedido: number;
    valorHomologado: number;
    tipo: TipoProcesso;
}

@Injectable()
export class CreateProcessoUseCase extends BaseUseCase<ICreateProcessoUseCaseCommand, Processo> {

    constructor(
        private processoRepository: IProcessoRepository,
    ) {
        super();
    }

    protected get validationId(): string {
        return ValidationIdentifiers.PROCESSO_CREATE;
    }

    async execute(command: ICreateProcessoUseCaseCommand): Promise<Processo> {
        // VALIDATION
        await this.validate(command);

        // USECASE LOGIC
        const processoProps = {
            ...command,
            partes: [],
        };

        const processoObj = Processo.create(processoProps);
        const processoCreated = await this.processoRepository.create(processoObj);

        // RETURN
        return processoCreated;
    }
}
