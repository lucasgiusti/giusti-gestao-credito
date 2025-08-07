import { Injectable } from '@nestjs/common';
import { ICedenteRepository } from 'src/application/interfaces/repositories/cedente.repository.interface';
import { Cedente } from 'src/domain/entities/cedente';

export interface IFindCedenteByIdUseCaseCommand {
    id: string;
}

@Injectable()
export class FindCedenteByIdUseCase {

    constructor(
        private readonly cedenteRepository: ICedenteRepository,
    ) {}

    async execute(command: IFindCedenteByIdUseCaseCommand): Promise<Cedente> {
        const cedente = await this.cedenteRepository.findById(command.id);

        if (!cedente) {
            throw new Error('invalid.cedente.not.found');
        }

        return cedente;
    }
}