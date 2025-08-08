import { Injectable } from '@nestjs/common';
import { IParteProcessoRepository } from 'src/application/interfaces/repositories/parte-processo.repository.interface';
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';
import { BaseUseCase } from 'src/application/interfaces/use-cases/base.use-case';
import { ValidationIdentifiers } from 'src/application/validations/constants/validation-identifiers';
import { ErrorMessages } from 'src/application/validations/constants/error.messages';

export interface IDeleteParteProcessoUseCaseCommand {
    id: string;
    processoId: string;
}
@Injectable()
export class DeleteParteProcessoUseCase extends BaseUseCase<IDeleteParteProcessoUseCaseCommand, void> {

    constructor(
        private parteProcessoRepository: IParteProcessoRepository,
        private processoRepository: IProcessoRepository
    ) {
        super();
    }

    protected get validationId(): string {
        return ValidationIdentifiers.PARTE_PROCESSO_DELETE;
    }

    async execute(command: IDeleteParteProcessoUseCaseCommand): Promise<void> {
        const processo = await this.processoRepository.findById(command.processoId);
        if (!processo) {
            throw new Error(ErrorMessages.PROCESSO_NAO_EXISTE);
        }

        // VALIDATION
        await this.validate(command);

        // USECASE LOGIC
        const parteProcessoObj = processo.deleteParteProcesso(command.id);
        await this.parteProcessoRepository.delete(parteProcessoObj.id);
    }
}
