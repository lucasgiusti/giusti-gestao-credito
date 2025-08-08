import { Injectable } from '@nestjs/common';
import { Cedente } from 'src/domain/entities/cedente';
import { ICedenteRepository } from 'src/application/interfaces/repositories/cedente.repository.interface';
import { BaseUseCase } from 'src/application/interfaces/use-cases/base.use-case';
import { ValidationIdentifiers } from 'src/application/validations/constants/validation-identifiers';
import { ErrorMessages } from 'src/application/validations/constants/error.messages';

export interface IUpdateCedenteUseCaseCommand {
    id: string,
    nome: string,
    documento: string,
}
@Injectable()
export class UpdateCedenteUseCase extends BaseUseCase<IUpdateCedenteUseCaseCommand, Cedente> {

    constructor(
        private cedenteRepository: ICedenteRepository
    ) {
        super();
    }

    protected get validationId(): string {
        return ValidationIdentifiers.CEDENTE_UPDATE;
    }   

    async execute(command: IUpdateCedenteUseCaseCommand): Promise<Cedente> {
        const cedente = await this.cedenteRepository.findById(command.id);
        if (!cedente) {
            throw new Error(ErrorMessages.CEDENTE_NAO_EXISTE);
        }

        // VALIDATION
        await this.validate(command);

        // USECASE LOGIC
        const cedenteProps = {
            ...command,
        };
        
        const cedenteObj = cedente.update(cedenteProps);
        const cedenteUpdated = await this.cedenteRepository.update(command.id, cedenteObj);

        // RETURN
        return cedenteUpdated;
    }
}