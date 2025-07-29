import { Injectable } from '@nestjs/common';
import { ParteProcesso } from 'src/domain/entities/parte-processo';
import { IParteProcessoRepository } from 'src/application/interfaces/repositories/parte-processo.repository.interface';
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';
import { ICedenteRepository } from 'src/application/interfaces/repositories/cedente.repository.interface';

interface CreateParteProcessoUseCaseCommand {
    processoId: string;
    cedenteId: string;
    percentual: number;
}

@Injectable()
export class CreateParteProcessoUseCase {

    constructor(
        private parteProcessoRepository: IParteProcessoRepository,
        private processoRepository: IProcessoRepository,
        private cedenteRepository: ICedenteRepository
    ) {}

    async execute({
        processoId,
        cedenteId,
        percentual
    }: CreateParteProcessoUseCaseCommand): Promise<ParteProcesso> {
        const processo = await this.processoRepository.findById(processoId);
        if (!processo) {
            throw new Error('notfound.processo');
        }

        const cedente = await this.cedenteRepository.findById(cedenteId);
        if (!cedente) {
            throw new Error('notfound.cedente');
        }

        const parteExists = await this.parteProcessoRepository.findByProcessoIdAndCedenteId(processoId, cedenteId);

        const parteProcesso = ParteProcesso.create({
            processoId,
            cedenteId,
            percentual,
            processo,
            parteProcessoExists: parteExists
        });

        processo.addParteProcesso(parteProcesso);

        processo.validatePartes()

        const parteProcessoCreated = await this.parteProcessoRepository.create(parteProcesso);

        return parteProcessoCreated;
    }
}
