import { Injectable } from '@nestjs/common';
import { ParteProcesso } from 'src/domain/entities/parte-processo';
import { IParteProcessoRepository } from 'src/application/interfaces/repositories/parte-processo.repository.interface';
import { ICedenteRepository } from 'src/application/interfaces/repositories/cedente.repository.interface';
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';

interface UpdateParteProcessoUseCaseCommand {
    id: string;
    cedenteId: string;
    percentual: number;
}

@Injectable()
export class UpdateParteProcessoUseCase {

    constructor(
        private parteProcessoRepository: IParteProcessoRepository,
        private cedenteRepository: ICedenteRepository,
        private processoRepository: IProcessoRepository
    ) {}

    async execute({
        id,
        cedenteId,
        percentual
    }: UpdateParteProcessoUseCaseCommand): Promise<ParteProcesso> {
        const parteProcesso = await this.parteProcessoRepository.findById(id);
        if (!parteProcesso) {
            throw new Error('notfound.parteProcesso');
        }

        const cedente = await this.cedenteRepository.findById(cedenteId);
        if (!cedente) {
            throw new Error('notfound.cedente');
        }

        const processo = await this.processoRepository.findById(parteProcesso.processoId);
        if (!processo) {
            throw new Error('notfound.processo');
        }
        
        const parteProcessoExists = await this.parteProcessoRepository.findByProcessoIdAndCedenteId(
            parteProcesso.processoId, 
            cedenteId
        );

        parteProcesso.update({
            cedenteId,
            percentual,
            processo,
            parteProcessoExists
        });

        processo.updateParteProcesso(parteProcesso);
        processo.validatePartes();
        
        return await this.parteProcessoRepository.update(id, parteProcesso);
    }
}
