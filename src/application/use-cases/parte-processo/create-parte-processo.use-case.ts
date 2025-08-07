import { Injectable } from '@nestjs/common';
import { ParteProcesso } from 'src/domain/entities/parte-processo';
import { IParteProcessoRepository } from 'src/application/interfaces/repositories/parte-processo.repository.interface';
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';
import { BaseUseCase } from 'src/application/interfaces/use-cases/base.use-case';
import { ValidationIdentifiers } from 'src/application/validations/constants/validation-identifiers';

export interface ICreateParteProcessoUseCaseCommand {
    processoId: string;
    cedenteId: string;
    percentual: number;
}

@Injectable()
export class CreateParteProcessoUseCase extends BaseUseCase<ICreateParteProcessoUseCaseCommand, ParteProcesso> {

    constructor(
        private parteProcessoRepository: IParteProcessoRepository,
        private processoRepository: IProcessoRepository,
    ) {
        super();
    }

    protected get validationId(): string {
        return ValidationIdentifiers.PARTE_PROCESSO_CREATE;
    }

    async execute(command: ICreateParteProcessoUseCaseCommand): Promise<ParteProcesso> {
        const processo = await this.processoRepository.findById(command.processoId);
        if (!processo) {
            throw new Error('notfound.processo');
        }

        // VALIDATION
        await this.validate(command);

        // USECASE LOGIC
        const parteProcessoProps = {
            ...command,
        };
        
        const parteProcessoObj = processo.addParteProcesso(parteProcessoProps);
        const parteProcessoCreated = await this.parteProcessoRepository.create(parteProcessoObj);

        // RETURN
        return parteProcessoCreated;
    }
}
