import { Injectable } from '@nestjs/common';
import { ICedenteRepository } from 'src/application/interfaces/repositories/cedente.repository.interface';
import { Cedente } from 'src/domain/entities/cedente';

interface FindCedenteByDocumentoUseCaseCommand {
    documento: string;
}

@Injectable()
export class FindCedenteByDocumentoUseCase {

    constructor(
        private readonly cedenteRepository: ICedenteRepository,
    ) {}

    async execute({documento}: FindCedenteByDocumentoUseCaseCommand): Promise<Cedente> {
        const cedente = await this.cedenteRepository.findByDocumento(documento);

        if (!cedente) {
            throw new Error('invalid.cedente.not.found');
        }

        return cedente;
    }
}