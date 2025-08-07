import { Injectable } from '@nestjs/common';
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';
import { BaseUseCase } from 'src/application/interfaces/use-cases/base.use-case';
import { ValidationIdentifiers } from 'src/application/validations/constants/validation-identifiers';

export interface IDeleteProcessoUseCaseCommand {
    id: string;
}

@Injectable()
export class DeleteProcessoUseCase extends BaseUseCase<IDeleteProcessoUseCaseCommand, void> {

    constructor(
        private processoRepository: IProcessoRepository,
    ) {
        super();
    }

    protected get validationId(): string {
        return ValidationIdentifiers.PROCESSO_DELETE;
    }

    async execute(command: IDeleteProcessoUseCaseCommand): Promise<void> {
        const processo = await this.processoRepository.findById(command.id);
        if (!processo) {
            throw new Error('notfound.processo');
        }

        // VALIDATION
        await this.validate(command);

        // USECASE LOGIC
        await this.processoRepository.delete(command.id);
    }
}
