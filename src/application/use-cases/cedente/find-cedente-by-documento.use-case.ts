import { Injectable } from '@nestjs/common';
import { ICedenteRepository } from 'src/application/interfaces/repositories/cedente.repository.interface';
import { Cedente } from 'src/domain/entities/cedente';
import { DocumentoFactory } from 'src/domain/value-objects/documento';
import { ErrorMessages } from 'src/application/validations/constants/error.messages';

export interface IFindCedenteByDocumentoUseCaseCommand {
    documento: string;
}

@Injectable()
export class FindCedenteByDocumentoUseCase {

    constructor(
        private readonly cedenteRepository: ICedenteRepository,
    ) {}

    async execute(command: IFindCedenteByDocumentoUseCaseCommand): Promise<Cedente> {
        const numeroDocumento = DocumentoFactory.create(command.documento);
        const cedente = await this.cedenteRepository.findByDocumento(numeroDocumento.value);

        if (!cedente) {
            throw new Error(ErrorMessages.CEDENTE_NAO_EXISTE);
        }

        return cedente;
    }
}